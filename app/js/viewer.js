/* MF35 Explorer: Three.js viewer for the procedural model (Phases 3 and 4).
 * Rotation, zoom, pan, picking, highlighting, hiding, isolation, X-ray, camera presets,
 * and exploded views (whole tractor, one assembly or one subassembly, with numbered callouts).
 * Knows hierarchy ids only through the index passed in; all record data stays in app.js. */
(function (root) {
  'use strict';

  function webglAvailable() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function Viewer(opts) {
    var THREE = opts.THREE;
    var index = opts.index;
    // Treat hex colours as sRGB so the red and grey render true to the livery.
    if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
    var self = this;
    this.THREE = THREE;
    this.index = index;
    this.onPick = opts.onPick || function () {};
    this.nameOf = opts.nameOf || function (id) { return id; };

    var el = document.createElement('div');
    el.className = 'viewer3d';
    this.el = el;
    // Name label pinned to the selected part (as on Robodienst's anatomy pages): placed every frame in the render loop.
    var pin = document.createElement('div');
    pin.className = 'viewer-pin';
    pin.hidden = true;
    el.appendChild(pin);
    this.pin = pin;
    var tip = document.createElement('div');
    tip.className = 'viewer-tip';
    tip.hidden = true;
    el.appendChild(tip);
    this.tip = tip;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label', '3D model of the tractor. Drag to rotate, scroll to zoom, right-drag to pan, click a part to select it.');
    renderer.domElement.setAttribute('role', 'img');
    el.insertBefore(renderer.domElement, tip);
    this.renderer = renderer;

    var scene = new THREE.Scene();
    this.scene = scene;
    var camera = new THREE.PerspectiveCamera(32, 1, 0.03, 60);
    this.camera = camera;

    // Studio environment generated in code (a few soft light panels in a neutral room), so
    // metal and paint pick up reflections. Pre-filtered once and shared by every material.
    (function () {
      try {
        var env = new THREE.Scene();
        env.background = new THREE.Color(0x9aa0a8);
        var roomMat = new THREE.MeshStandardMaterial({ color: 0x8c9299, side: THREE.BackSide, roughness: 1, metalness: 0 });
        var room = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), roomMat);
        room.position.y = 5;
        env.add(room);
        var panel = function (w, h, pos, look, intensity, color) {
          var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: color || 0xffffff }));
          m.material.color.multiplyScalar(intensity);
          m.position.copy(pos); m.lookAt(look || new THREE.Vector3(0, 1, 0));
          env.add(m);
        };
        panel(8, 4, new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 0, 0), 6);          // overhead softbox
        panel(5, 3, new THREE.Vector3(6, 5, 7), null, 4, 0xfff4e6);                      // warm key
        panel(5, 3, new THREE.Vector3(-7, 4, -5), null, 2.5, 0xe6f0ff);                  // cool fill
        panel(3, 6, new THREE.Vector3(-3, 3, 8), null, 2);                               // side strip
        panel(14, 14, new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 1, 0), 0.6, 0xb8bcc2); // floor bounce
        var pmrem = new THREE.PMREMGenerator(renderer);
        var envTex = pmrem.fromScene(env, 0.04).texture;
        scene.environment = envTex;
        pmrem.dispose();
      } catch (e) { /* environment is cosmetic; carry on without it */ }
    })();
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    scene.add(new THREE.HemisphereLight(0xf4f7fb, 0x7f858c, 0.55));
    var key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2.5, 5, 3.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -2.4; key.shadow.camera.right = 2.4;
    key.shadow.camera.top = 2.4; key.shadow.camera.bottom = -2.4;
    key.shadow.camera.near = 1; key.shadow.camera.far = 14;
    key.shadow.bias = -0.0004;
    key.target.position.set(0.6, 0, 0);
    scene.add(key); scene.add(key.target);
    var fill = new THREE.DirectionalLight(0xdfe8f5, 0.45);
    fill.position.set(-3, 2.5, -3);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0xffffff, 0.3);
    rim.position.set(-1, 3, 4);
    scene.add(rim);

    var ground = new THREE.Mesh(new THREE.CircleGeometry(4.5, 64), new THREE.ShadowMaterial({ opacity: 0.2 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0.6, 0, 0);
    ground.receiveShadow = true;
    scene.add(ground);
    var grid = new THREE.GridHelper(9, 36, 0x9aa3ad, 0xbfc6ce);
    grid.position.set(0.6, 0.001, 0);
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);

    var model = root.MF35Model.build(THREE);
    this.model = model;
    scene.add(model.root);

    // Per-mesh materials so each part can be highlighted on its own.
    this.meshes = [];
    this.meshesByPart = {};
    var casings = {};
    model.casings.forEach(function (id) { casings[id] = true; });
    model.root.traverse(function (o) {
      if (!o.isMesh) return;
      var pid = null, p = o;
      while (p && !pid) { pid = p.userData && p.userData.partId; p = p.parent; }
      o.userData.partId = pid;
      o.material = o.material.clone();
      if (o.material.isMeshStandardMaterial) o.material.envMapIntensity = 0.7;
      o.userData.base = { opacity: o.material.opacity, transparent: o.material.transparent, emissive: o.material.emissive.getHex() };
      o.userData.casing = !!casings[pid];
      self.meshes.push(o);
      (self.meshesByPart[pid] = self.meshesByPart[pid] || []).push(o);
      if (!index.byId[pid] && window.console) console.warn('MF35 model: part id not in hierarchy:', pid);
    });

    // Which modelled parts sit under each hierarchy id (including itself).
    this.partsUnder = {};
    Object.keys(this.meshesByPart).forEach(function (pid) {
      if (!index.byId[pid]) return;
      index.byId[pid].path.forEach(function (anc) { (self.partsUnder[anc] = self.partsUnder[anc] || []).push(pid); });
    });

    // Exploded views: remember each mesh's assembled position and which side of the tractor it sits on.
    model.root.updateMatrixWorld(true);
    var tmpBox = new THREE.Box3(), tmpQ = new THREE.Quaternion();
    this.meshes.forEach(function (m) {
      tmpBox.setFromObject(m);
      var c = tmpBox.getCenter(new THREE.Vector3());
      m.userData.home = m.position.clone();
      m.userData.centre = c;
      m.userData.homeBox = tmpBox.clone();
      m.userData.side = c.z > 0.12 ? 1 : (c.z < -0.12 ? -1 : 0);
      m.userData.toLocal = m.parent.getWorldQuaternion(tmpQ).clone().invert();
      m.userData.off = new THREE.Vector3();
    });
    this.explodeHints = model.explode || {};
    this.explodeAxes = model.explodeAxis || {};
    this.explodeCache = {};
    this.explode = { scope: index.rootId, depth: 1, t: 0, tween: null };
    this.calloutLayer = document.createElement('div');
    this.calloutLayer.className = 'callouts';
    this.calloutLayer.hidden = true;
    el.appendChild(this.calloutLayer);
    this.callouts = [];
    this.calloutLayer.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-callout]');
      if (b) { ev.stopPropagation(); self.onPick(b.getAttribute('data-callout'), { callout: true }); }
    });
    this.homeBounds = new THREE.Box3().setFromObject(model.root);

    this.casingBoxes = [];
    this.meshes.forEach(function (m) { if (m.userData.casing) self.casingBoxes.push({ pid: m.userData.partId, mesh: m, box: new THREE.Box3().setFromObject(m) }); });

    this.state = { selected: null, hover: null, hidden: {}, isolate: null, xray: false, fitted: function () { return true; } };

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.screenSpacePanning = true;
    controls.minDistance = 0.35;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.9;
    this.controls = controls;

    this.bounds = new THREE.Box3().setFromObject(model.root);
    this.view('iso', true);

    // Picking: a click (not a drag) selects; double-click isolates.
    var raycaster = new THREE.Raycaster();
    var ndc = new THREE.Vector2();
    var down = null;
    function pickAt(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      var hits = raycaster.intersectObjects(self.meshes.filter(function (m) { return m.visible && !m.userData.ghost && !m.userData.occluding; }), false);
      return hits.length ? hits[0].object.userData.partId : null;
    }
    renderer.domElement.addEventListener('pointerdown', function (ev) { down = { x: ev.clientX, y: ev.clientY, t: Date.now() }; });
    renderer.domElement.addEventListener('pointerup', function (ev) {
      if (!down) return;
      var moved = Math.abs(ev.clientX - down.x) + Math.abs(ev.clientY - down.y);
      var now = Date.now();
      down = null;
      if (moved > 6 || ev.button > 0) return;
      var id = pickAt(ev);
      if (!id) return;
      var dbl = self._lastTap && now - self._lastTap.t < 350 && self._lastTap.id === id;
      self._lastTap = { t: now, id: id };
      self.onPick(id, { dbl: !!dbl });
    });
    var hoverQueued = false;
    renderer.domElement.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'touch' || ev.buttons) { tip.hidden = true; return; }
      if (hoverQueued) return;
      hoverQueued = true;
      requestAnimationFrame(function () {
        hoverQueued = false;
        var id = pickAt(ev);
        if (id !== self.state.hover) { self.state.hover = id; self.applyVisuals(); }
        renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
        if (id) {
          var r = el.getBoundingClientRect();
          tip.textContent = self.nameOf(id);
          tip.style.left = (ev.clientX - r.left + 14) + 'px';
          tip.style.top = (ev.clientY - r.top + 12) + 'px';
          tip.hidden = false;
        } else tip.hidden = true;
      });
    });
    renderer.domElement.addEventListener('pointerleave', function () {
      tip.hidden = true;
      if (self.state.hover) { self.state.hover = null; self.applyVisuals(); }
    });

    // Parts between the camera and the selection turn see-through, like a cutaway.
    var occTimer = null;
    controls.addEventListener('change', function () {
      if (occTimer || !self.state.selected) return;
      occTimer = setTimeout(function () { occTimer = null; self._updateOccluders(); }, 120);
    });

    this.tween = null;
    // Render on demand (Phase 9): the scene has ~900 meshes and a soft shadow map, so redrawing
    // it 60 times a second while nothing moves wastes battery and makes the rest of the page
    // sluggish on tablets. A frame is drawn only when the camera, an animation or the visual
    // state has changed (see invalidate() and the method wrapping at the end of this file).
    this._dirty = true;
    controls.addEventListener('change', function () { self._dirty = true; });
    var wasConnected = false;
    var loop = function () {
      requestAnimationFrame(loop);
      var connected = el.isConnected;
      if (connected && !wasConnected) self._dirty = true;
      wasConnected = connected;
      if (!connected) return;
      var animating = !!(self.tween || self.explode.tween);
      if (self.tween) self._stepTween();
      if (self.explode.tween) self._stepExplode();
      controls.update();
      if (!animating && !self._dirty) return;
      self._dirty = false;
      self._placeCallouts();
      self._placePin();
      renderer.render(scene, camera);
      self.frames = (self.frames || 0) + 1;
    };
    loop();
    window.addEventListener('resize', function () { self.resize(); });
    this.applyVisuals();
  }

  Viewer.prototype.resize = function () {
    var w = this.el.clientWidth || 800, h = this.el.clientHeight || 500;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    // Shift the picture left when a panel covers the right-hand side of the viewport.
    var inset = Math.min(this.insetRight || 0, w * 0.4);
    this.camera.aspect = (w + inset) / h;
    if (inset > 0) this.camera.setViewOffset(w + inset, h, inset, 0, w, h);
    else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  };
  Viewer.prototype.setInsetRight = function (px) {
    px = Math.round(px || 0);
    if (px === (this.insetRight || 0)) return;
    this.insetRight = px;
    this.resize();
  };

  Viewer.prototype.attach = function (host) {
    if (this.el.parentNode !== host) host.appendChild(this.el);
    this.resize();
  };

  /* ----- what is modelled ----- */
  Viewer.prototype.isModelled = function (id) { return !!(this.partsUnder[id] && this.partsUnder[id].length); };
  Viewer.prototype.modelledIds = function () { return Object.keys(this.meshesByPart); };

  /* ----- visual state ----- */
  Viewer.prototype.setFitted = function (fn) {
    if (fn !== this.state.fitted) this.explodeCache = {};
    this.state.fitted = fn;
    this.applyVisuals();
    if (this.explode.t > 0) this._setExplodeOffsets(this.explode.t);
  };
  Viewer.prototype.setSelection = function (id, frame) {
    this.state.selected = id || null;
    this.state.occluders = {};
    this.applyVisuals();
    this._updateOccluders();
    if (id && frame && this.isModelled(id)) this.frame(id);
  };
  Viewer.prototype.hide = function (id) {
    var self = this;
    (this.partsUnder[id] || []).forEach(function (p) { self.state.hidden[p] = true; });
    this.applyVisuals();
  };
  Viewer.prototype.isolate = function (id) {
    this.state.isolate = id && this.isModelled(id) ? id : null;
    this.applyVisuals();
    if (this.state.isolate) this.frame(this.state.isolate);
  };
  Viewer.prototype.showAll = function () {
    this.state.hidden = {};
    this.state.isolate = null;
    this.applyVisuals();
  };
  Viewer.prototype.hiddenCount = function () { return Object.keys(this.state.hidden).length; };
  Viewer.prototype.setXray = function (on) { this.state.xray = !!on; this.applyVisuals(); };

  Viewer.prototype._updateOccluders = function () {
    var st = this.state;
    var next = {};
    if (st.selected && !st.isolate && this.isModelled(st.selected)) {
      var THREE = this.THREE;
      var box = this._boxFor(st.selected);
      if (box) {
        var sel = {};
        (this.partsUnder[st.selected] || []).forEach(function (p) { sel[p] = true; });
        var c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3()).multiplyScalar(0.35);
        var pts = [c, c.clone().setX(c.x + size.x), c.clone().setX(c.x - size.x), c.clone().setY(c.y + size.y), c.clone().setY(c.y - size.y), c.clone().setZ(c.z + size.z), c.clone().setZ(c.z - size.z)];
        var cand = this.meshes.filter(function (m) { return m.visible && !m.userData.ghost && !sel[m.userData.partId]; });
        var ray = this._occRay || (this._occRay = new THREE.Raycaster());
        var cam = this.camera.position;
        pts.forEach(function (p) {
          var d = p.clone().sub(cam);
          var len = d.length();
          ray.set(cam, d.normalize());
          ray.far = Math.max(0, len - 0.01);
          ray.intersectObjects(cand, false).forEach(function (h) { next[h.object.userData.partId] = true; });
        });
      }
    }
    var prev = st.occluders || {};
    var changed = Object.keys(next).length !== Object.keys(prev).length || Object.keys(next).some(function (k) { return !prev[k]; });
    if (changed) { st.occluders = next; this.applyVisuals(); }
  };

  Viewer.prototype.applyVisuals = function () {
    var st = this.state;
    var under = function (list) { var o = {}; (list || []).forEach(function (p) { o[p] = true; }); return o; };
    var sel = st.selected ? under(this.partsUnder[st.selected]) : {};
    // While an assembly is exploded on its own, selecting that assembly would tint every part: skip it.
    var wholeScope = !!(st.selected && this.explode && this.explode.scope === st.selected && this.isExploded());
    if (wholeScope) sel = {};
    var hov = st.hover ? { } : {};
    if (st.hover) hov[st.hover] = true;
    var iso = st.isolate ? under(this.partsUnder[st.isolate]) : null;
    var ex = this.explode;
    if (ex && ex.scope && ex.scope !== this.index.rootId && (ex.t > 0.001 || (ex.tween && ex.tween.to > 0))) {
      var inScope = under(this.partsUnder[ex.scope]);
      if (iso) Object.keys(iso).forEach(function (k) { if (!inScope[k]) delete iso[k]; });
      else iso = inScope;
    }
    // Selecting a part hidden inside a casing makes the casings see-through automatically.
    var autoXray = false;
    if (st.selected && !st.xray && !wholeScope && this.partsUnder[st.selected]) {
      var sb = this._boxFor(st.selected, true);
      if (sb) {
        var c = sb.getCenter(new this.THREE.Vector3());
        autoXray = this.casingBoxes.some(function (cb) { return !sel[cb.pid] && !(iso && !iso[cb.pid]) && cb.mesh.visible && st.fitted(cb.pid) && !st.hidden[cb.pid] && cb.box.containsPoint(c); });
      }
    }
    this.state.autoXray = autoXray;
    // In an exploded assembly, casings that stay in place turn see-through so the parts inside stay visible.
    var exXray = !!(ex && ex.scope !== this.index.rootId && this.isExploded());
    this.meshes.forEach(function (m) {
      var pid = m.userData.partId;
      var mt = m.material, base = m.userData.base;
      var fitted = st.fitted(pid);
      m.visible = fitted && !st.hidden[pid];
      var ghost = !!(iso && !iso[pid]);
      m.userData.ghost = ghost;
      var occluding = !ghost && !sel[pid] && !!(st.occluders && st.occluders[pid]);
      m.userData.occluding = occluding;
      var opacity = base.opacity, transparent = base.transparent;
      if (ghost) { opacity = 0.07; transparent = true; }
      else if (occluding) { opacity = 0.14; transparent = true; }
      else if ((st.xray || autoXray || (exXray && m.userData.off.lengthSq() < 0.01)) && m.userData.casing && !sel[pid]) { opacity = 0.16; transparent = true; }
      mt.opacity = opacity;
      mt.transparent = transparent;
      mt.depthWrite = !transparent || opacity > 0.5;
      m.castShadow = !ghost && opacity > 0.5;
      if (sel[pid]) { mt.emissive.setHex(0x1f6fe0); mt.emissiveIntensity = 0.55; }
      else if (hov[pid]) { mt.emissive.setHex(0x4a87d6); mt.emissiveIntensity = 0.25; }
      else { mt.emissive.setHex(base.emissive); mt.emissiveIntensity = 1; }
      mt.needsUpdate = true;
    });
  };


  /* ----- exploded views (Phase 4) ----- */
  // Full-explosion offset for every mesh under `scope`, separating `depth` levels of the hierarchy.
  // Each step moves a child away from its parent: by the hint in model.js where one is given,
  // otherwise radially from the parent's centre. Left- and right-hand halves of a part move apart.
  Viewer.prototype._explodeVectors = function (scope, depth) {
    var key = scope + '|' + depth;
    if (this.explodeCache[key]) return this.explodeCache[key];
    var THREE = this.THREE, self = this, index = this.index, st = this.state, hints = this.explodeHints;
    var K = 0.7;
    var centres = {};
    function centreOf(id, side) {
      var k = id + '|' + side;
      if (centres[k]) return centres[k];
      var b = new THREE.Box3(), any = false, sides = {};
      (self.partsUnder[id] || []).forEach(function (p) {
        if (!st.fitted(p)) return;
        (self.meshesByPart[p] || []).forEach(function (m) { sides[m.userData.side] = true; });
      });
      var split = side !== 0 && sides[1] && sides[-1];
      (self.partsUnder[id] || []).forEach(function (p) {
        if (!st.fitted(p)) return;
        (self.meshesByPart[p] || []).forEach(function (m) {
          if (split && m.userData.side !== side) return;
          b.expandByPoint(m.userData.centre); any = true;
        });
      });
      var c = any ? b.getCenter(new THREE.Vector3()) : null;
      centres[k] = c;
      return c;
    }
    var sizes = {};
    function push(id) {
      if (sizes[id] != null) return sizes[id];
      var b = new THREE.Box3();
      (self.partsUnder[id] || []).forEach(function (p) { (self.meshesByPart[p] || []).forEach(function (m) { if (st.fitted(p)) b.union(m.userData.homeBox); }); });
      var sz = b.isEmpty() ? 0 : b.getSize(new THREE.Vector3());
      sizes[id] = sz ? Math.min(0.4, 0.22 * Math.max(sz.x, sz.y, sz.z)) : 0;
      return sizes[id];
    }
    // Children sharing their parent's centre (parts on one shaft, parts inside a housing) cannot
    // move radially, so they slide out one after another along the assembly's stacking axis.
    var stacks = {};
    function extent(id) {
      var b = new THREE.Box3();
      (self.partsUnder[id] || []).forEach(function (p) { if (st.fitted(p)) (self.meshesByPart[p] || []).forEach(function (m) { b.union(m.userData.homeBox); }); });
      return b.isEmpty() ? new THREE.Vector3() : b.getSize(new THREE.Vector3());
    }
    function stackOffset(parent, child, side) {
      var k = parent + '|' + side;
      if (!stacks[k]) {
        var pc = centreOf(parent, side), psz = extent(parent);
        var tol = Math.max(0.03, 0.1 * Math.max(psz.x, psz.y, psz.z));
        var ax = axes[parent] || [0, 1, 0];
        var axis = new THREE.Vector3(ax[0], ax[1], ax[2]).normalize();
        var map = {}, run = 0;
        index.byId[parent].childIds.forEach(function (c) {
          var cc = centreOf(c, side);
          if (!cc || cc.distanceTo(pc) > tol || hints[c]) return;
          var e = extent(c);
          var along = Math.abs(e.x * axis.x) + Math.abs(e.y * axis.y) + Math.abs(e.z * axis.z);
          run += along + Math.max(0.04, 0.12 * along);
          map[c] = axis.clone().multiplyScalar(run);
        });
        // The first coincident child stays put when the parent has no geometry of its own.
        var first = Object.keys(map)[0];
        if (first && !self.meshesByPart[parent]) {
          var shift = map[first].clone();
          Object.keys(map).forEach(function (c) { map[c].sub(shift); });
        }
        stacks[k] = map;
      }
      return stacks[k][child] || null;
    }
    var axes = this.explodeAxes || {};
    var out = new Map();
    var scopeDepth = index.byId[scope] ? index.byId[scope].path.length - 1 : 0;
    var maxSteps = depth === 'all' ? 99 : depth;
    (this.partsUnder[scope] || []).forEach(function (p) {
      var path = index.byId[p].path.slice(scopeDepth);
      (self.meshesByPart[p] || []).forEach(function (m) {
        var side = m.userData.side;
        var v = new THREE.Vector3();
        for (var i = 1; i < path.length && i <= maxSteps; i++) {
          var parent = path[i - 1], child = path[i];
          var h = hints[child];
          if (h) {
            var hv = new THREE.Vector3(h[0], h[1], h[2]);
            if (h[3] === 'mirror') hv.z *= side;
            v.add(hv);
            continue;
          }
          var cc = centreOf(child, side), pc = centreOf(parent, side);
          if (!cc || !pc) continue;
          var stack = stackOffset(parent, child, side);
          if (stack) { v.add(stack); continue; }
          var d = cc.clone().sub(pc);
          var len = d.length();
          if (len < 0.03) continue;
          // Spread in proportion to the distance from the parent's centre, plus a push along the main
          // axis, scaled to the parent's size, so small, tightly packed assemblies still open up.
          v.addScaledVector(d, K);
          var ad = [Math.abs(d.x), Math.abs(d.y), Math.abs(d.z)];
          var main = ad[0] >= ad[1] && ad[0] >= ad[2] ? 'x' : (ad[1] >= ad[2] ? 'y' : 'z');
          v[main] += Math.sign(d[main]) * push(parent);
        }
        out.set(m, v);
      });
    });
    // Keep the exploded layout above the studio floor by raising it as a whole if needed.
    var lowest = Infinity;
    out.forEach(function (v, m) { if (st.fitted(m.userData.partId)) lowest = Math.min(lowest, m.userData.homeBox.min.y + v.y); });
    if (lowest < 0.02) out.forEach(function (v) { v.y += 0.02 - lowest; });
    this.explodeCache[key] = out;
    return out;
  };
  Viewer.prototype._setExplodeOffsets = function (t, fromOffsets, k) {
    var vecs = this._explodeVectors(this.explode.scope, this.explode.depth);
    var tmp = new this.THREE.Vector3();
    this.meshes.forEach(function (m) {
      var v = vecs.get(m);
      tmp.set(0, 0, 0);
      if (v) tmp.copy(v).multiplyScalar(t);
      if (fromOffsets) tmp.lerpVectors(fromOffsets.get(m), tmp, k);
      m.userData.off.copy(tmp);
      m.position.copy(m.userData.home).add(tmp.applyQuaternion(m.userData.toLocal));
    });
    this._calloutsDirty = true; this._pinDirty = true;
  };
  // Move parts to the explosion amount t (0 assembled, 1 fully exploded) for the given scope and depth.
  Viewer.prototype.setExplode = function (opts, animate, onDone) {
    var ex = this.explode;
    var next = {
      scope: opts.scope !== undefined ? (opts.scope && this.isModelled(opts.scope) ? opts.scope : this.index.rootId) : ex.scope,
      depth: opts.depth !== undefined ? opts.depth : ex.depth,
      t: opts.t !== undefined ? Math.max(0, Math.min(1, opts.t)) : ex.t
    };
    var changedShape = next.scope !== ex.scope || next.depth !== ex.depth;
    if (!animate && !changedShape) {
      ex.tween = null;
      ex.t = next.t;
      this._setExplodeOffsets(ex.t);
      this._afterExplode();
      if (onDone) onDone();
      return;
    }
    var from = new Map();
    this.meshes.forEach(function (m) { from.set(m, m.userData.off.clone()); });
    ex.scope = next.scope; ex.depth = next.depth;
    ex.tween = { from: from, to: next.t, start: performance.now(), dur: animate ? 750 : 1, onDone: onDone };
    this.applyVisuals();
  };
  Viewer.prototype._stepExplode = function () {
    var ex = this.explode, tw = ex.tween;
    var k = Math.min(1, (performance.now() - tw.start) / tw.dur);
    var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    this._setExplodeOffsets(tw.to, tw.from, e);
    ex.t = tw.to;
    if (k >= 1) {
      ex.tween = null;
      this._afterExplode();
      if (tw.onDone) tw.onDone();
    }
  };
  Viewer.prototype._afterExplode = function () {
    var THREE = this.THREE;
    this.model.root.updateMatrixWorld(true);
    this.casingBoxes.forEach(function (cb) { cb.box.setFromObject(cb.mesh); });
    this.bounds = new THREE.Box3().setFromObject(this.model.root).union(this.homeBounds);
    this.applyVisuals();
    this._updateOccluders();
    this._calloutsDirty = true; this._pinDirty = true;
  };
  Viewer.prototype.isExploded = function () { return this.explode.t > 0.001 || !!(this.explode.tween && this.explode.tween.to > 0); };
  // Frame the exploded scope (or the whole tractor).
  Viewer.prototype.frameExplode = function () {
    var ex = this.explode, st = this.state;
    var t = ex.tween ? ex.tween.to : ex.t;
    // Frame where the parts are going, so the camera moves while they separate.
    var vecs = this._explodeVectors(ex.scope, ex.depth);
    var box = new this.THREE.Box3(), self = this, tmp = new this.THREE.Box3();
    (this.partsUnder[ex.scope] || []).forEach(function (p) {
      if (!st.fitted(p) || st.hidden[p]) return;
      (self.meshesByPart[p] || []).forEach(function (m) {
        tmp.copy(m.userData.homeBox);
        var v = vecs.get(m);
        if (v) tmp.translate(v.clone().multiplyScalar(t));
        box.union(tmp);
      });
    });
    if (box.isEmpty()) return;
    var dir = this.camera.position.clone().sub(this.controls.target);
    // With the rest of the tractor ghosted, the camera may come inside its outline.
    this._fit(box, dir, false, 0, 1.1, null, ex.scope !== this.index.rootId, true);
  };

  // Numbered references: the parts or groups shown separately at the current depth.
  Viewer.prototype.explodeRefs = function (scope, depth) {
    var index = this.index, self = this, st = this.state;
    scope = scope || this.explode.scope; depth = depth || this.explode.depth;
    var base = index.byId[scope].path.length - 1;
    var maxSteps = depth === 'all' ? 99 : depth;
    var refs = [];
    index.order.forEach(function (id) {
      if (id === scope || !self.isModelled(id)) return;
      var e = index.byId[id];
      if (e.path.indexOf(scope) === -1) return;
      var rel = e.path.length - 1 - base;
      if (rel > maxSteps) return;
      var deeper = e.childIds.some(function (c) { return self.isModelled(c); });
      if (rel < maxSteps && deeper) return;
      var fitted = (self.partsUnder[id] || []).some(function (p) { return st.fitted(p); });
      if (!fitted) return;
      refs.push(id);
    });
    return refs;
  };
  Viewer.prototype.setCallouts = function (ids) {
    var self = this;
    this.callouts = (ids || []).map(function (id, i) { return { id: id, n: i + 1, pos: null }; });
    var NS = 'http://www.w3.org/2000/svg';
    this.calloutLayer.innerHTML = '<svg class="leaders" aria-hidden="true"></svg>' + this.callouts.map(function (c) {
      return '<button type="button" class="callout" data-callout="' + c.id + '" title="' + String(self.nameOf(c.id)).replace(/"/g, '&quot;') + '">' + c.n + '</button>';
    }).join('');
    var svg = this.calloutLayer.firstChild;
    this.callouts.forEach(function (c, i) {
      c.el = self.calloutLayer.children[i + 1];
      c.line = document.createElementNS(NS, 'line');
      c.dot = document.createElementNS(NS, 'circle');
      c.dot.setAttribute('r', '2.5');
      svg.appendChild(c.line); svg.appendChild(c.dot);
    });
    this._calloutsDirty = true; this._pinDirty = true;
  };
  // The selection pin: a small dot on the part and its name beside it. Hidden for whole systems (too big to point at),
  // while exploded callouts are showing, and when the part is off screen.
  Viewer.prototype._placePin = function () {
    var id = this.state.selected, pin = this.pin;
    var node = id && this.index.byId[id];
    var show = node && node.node && node.depth >= 2 && !(this.callouts.length && this.explode.t > 0.3) && this.isModelled(id);
    if (!show) { if (!pin.hidden) pin.hidden = true; this._pinFor = null; return; }
    if (this._pinFor !== id || this._pinDirty) {
      this._pinFor = id; this._pinDirty = false;
      var box = this._boxFor(id);
      this._pinPos = box ? box.getCenter(new this.THREE.Vector3()) : null;
      pin.setAttribute('data-label', this.nameOf(id));
    }
    if (!this._pinPos) { pin.hidden = true; return; }
    var v = this._pinPos.clone().project(this.camera);
    if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) { pin.hidden = true; return; }
    var w = this.el.clientWidth, h = this.el.clientHeight;
    pin.hidden = false;
    pin.style.transform = 'translate(' + ((v.x + 1) / 2 * w).toFixed(1) + 'px,' + ((1 - v.y) / 2 * h).toFixed(1) + 'px)';
  };
  Viewer.prototype._placeCallouts = function () {
    var show = this.callouts.length && this.explode.t > 0.3;
    if (!show) { if (!this.calloutLayer.hidden) this.calloutLayer.hidden = true; return; }
    var THREE = this.THREE, self = this, st = this.state;
    if (this._calloutsDirty) {
      this._calloutsDirty = false;
      this.model.root.updateMatrixWorld(true);
      this.callouts.forEach(function (c) {
        var b = new THREE.Box3();
        (self.partsUnder[c.id] || []).forEach(function (p) {
          if (!st.fitted(p) || st.hidden[p]) return;
          (self.meshesByPart[p] || []).forEach(function (m) { b.expandByObject(m); });
        });
        c.pos = b.isEmpty() ? null : b.getCenter(new THREE.Vector3());
      });
    }
    this.calloutLayer.hidden = false;
    var w = this.el.clientWidth, h = this.el.clientHeight, v = new THREE.Vector3();
    // Labels sit a short leader line away from each part, pushed outwards from the assembly's centre.
    var centre = new THREE.Vector3(), n = 0;
    this.callouts.forEach(function (c) { if (c.pos) { centre.add(c.pos); n++; } });
    if (n) centre.multiplyScalar(1 / n).project(this.camera);
    var cx = (centre.x + 1) / 2 * w, cy = (1 - centre.y) / 2 * h;
    var LEAD = 30, placed = [];
    this.callouts.forEach(function (c) {
      var off = function () { c.el.style.display = 'none'; c.line.style.display = 'none'; c.dot.style.display = 'none'; };
      if (!c.pos) return off();
      v.copy(c.pos).project(self.camera);
      if (v.z > 1 || v.x < -1.05 || v.x > 1.05 || v.y < -1.05 || v.y > 1.05) return off();
      var px = (v.x + 1) / 2 * w, py = (1 - v.y) / 2 * h;
      var dx = px - cx, dy = py - cy, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 1) { dx = 0; dy = -1; d = 1; }
      // Lengthen the leader until the label clears labels already placed.
      var lx, ly, tries = 0;
      do {
        var len = LEAD + tries * 24;
        lx = px + dx / d * len; ly = py + dy / d * len;
        tries++;
      } while (tries < 5 && placed.some(function (q) { return Math.abs(q[0] - lx) < 23 && Math.abs(q[1] - ly) < 23; }));
      placed.push([lx, ly]);
      c.el.style.display = ''; c.line.style.display = ''; c.dot.style.display = '';
      c.el.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
      c.line.setAttribute('x1', px.toFixed(1)); c.line.setAttribute('y1', py.toFixed(1));
      c.line.setAttribute('x2', lx.toFixed(1)); c.line.setAttribute('y2', ly.toFixed(1));
      c.dot.setAttribute('cx', px.toFixed(1)); c.dot.setAttribute('cy', py.toFixed(1));
      var sel = st.selected && st.selected !== self.explode.scope && self.index.byId[st.selected];
      var on = !!sel && (self.index.byId[c.id].path.indexOf(st.selected) !== -1 || sel.path.indexOf(c.id) !== -1);
      if (c.on !== on) { c.on = on; c.el.classList.toggle('on', !!on); c.line.classList.toggle('on', !!on); }
    });
  };

  /* ----- camera ----- */
  Viewer.prototype._boxFor = function (id, anyVisibility) {
    var THREE = this.THREE;
    var box = new THREE.Box3();
    var self = this;
    var st = this.state;
    (this.partsUnder[id] || []).forEach(function (p) {
      if (!anyVisibility && (!st.fitted(p) || st.hidden[p])) return;
      (self.meshesByPart[p] || []).forEach(function (m) { box.expandByObject(m); });
    });
    return box.isEmpty() ? null : box;
  };
  Viewer.prototype._inside = function (box) {
    var c = box.getCenter(new this.THREE.Vector3());
    return this.casingBoxes.some(function (cb) { return cb.box.containsPoint(c); });
  };
  Viewer.prototype._fit = function (box, dir, instant, minDist, scale, avoid, free, tight) {
    var THREE = this.THREE;
    var sphere = box.getBoundingSphere(new THREE.Sphere());
    var r = Math.max(sphere.radius, 0.05);
    var fov = this.camera.fov * Math.PI / 180;
    // Fit to the part of the viewport not covered by a side panel.
    var cw = this.el.clientWidth || 800, ch = this.el.clientHeight || 500;
    var aspect = Math.max(0.3, (cw - Math.min(this.insetRight || 0, cw * 0.4)) / ch) || this.camera.aspect || 1.6;
    var fit = (r / Math.sin(Math.min(fov, fov * aspect) / 2)) * (scale || 1);
    if (tight) {
      // Fit the box's outline as seen from this direction rather than its bounding sphere.
      var f = dir.clone().normalize();
      var right = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0));
      if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
      right.normalize();
      var up = new THREE.Vector3().crossVectors(right, f).normalize();
      var c0 = sphere.center, hw = 0, hh = 0, near = 0, q = new THREE.Vector3();
      [box.min.x, box.max.x].forEach(function (x) { [box.min.y, box.max.y].forEach(function (y) { [box.min.z, box.max.z].forEach(function (z) {
        q.set(x, y, z).sub(c0);
        hw = Math.max(hw, Math.abs(q.dot(right))); hh = Math.max(hh, Math.abs(q.dot(up))); near = Math.max(near, q.dot(f));
      }); }); });
      var tv = Math.tan(fov / 2), th = tv * aspect;
      fit = (Math.max(hw / th, hh / tv) + near) * (scale || 1);
    }
    var dist0 = Math.min(Math.max(fit * 1.05, this.controls.minDistance * 1.1, minDist || 0), this.controls.maxDistance);
    var target = sphere.center.clone();
    var outer = this.bounds.clone().expandByScalar(0.05);
    var self = this;
    function place(d) {
      var unit = d.clone().normalize();
      var dist = dist0;
      var pos = target.clone().addScaledVector(unit, dist);
      // Keep the camera outside the tractor's outline.
      for (var i = 0; i < 30 && !free && outer.containsPoint(pos) && dist < self.controls.maxDistance; i++) {
        dist *= 1.08;
        pos = target.clone().addScaledVector(unit, dist);
      }
      if (pos.y < 0.08) pos.y = 0.08;
      return pos;
    }
    var pos = place(dir);
    if (avoid) {
      // Try a few viewing directions and keep the one with the fewest solid parts in the way.
      var ray = new THREE.Raycaster();
      var solid = this.meshes.filter(function (m) { return m.visible && !m.userData.ghost && !m.material.transparent && !avoid[m.userData.partId]; });
      var blockers = function (p) {
        var d = p.clone().sub(target);
        ray.set(target, d.clone().normalize());
        ray.far = d.length();
        return ray.intersectObjects(solid, false).length;
      };
      var best = { pos: pos, n: blockers(pos) };
      if (best.n) {
        [[1, 0.55, 1.15], [0.2, 0.5, 1], [-1, 0.6, 0.9], [-1, 0.4, -0.9], [0.2, 0.5, -1], [1, 0.6, -1.1], [0.05, 1, 0.3], [-1, 0.2, 0]].some(function (d) {
          var p = place(new THREE.Vector3(d[0], d[1], d[2]));
          var n = blockers(p);
          if (n < best.n) best = { pos: p, n: n };
          return n === 0;
        });
      }
      pos = best.pos;
    }
    this._tweenTo(pos, target, instant);
  };
  Viewer.prototype.frame = function (id) {
    var box = this._boxFor(id);
    if (!box) return;
    var dir = this.camera.position.clone().sub(this.controls.target);
    var avoid = {};
    (this.partsUnder[id] || []).forEach(function (p) { avoid[p] = true; });
    // Stand back far enough to keep the surrounding tractor in view for context.
    this._fit(box, dir, false, this._inside(box) ? 2.5 : 2.2, 1, avoid);
  };
  var PRESETS = {
    iso: [1.0, 0.55, 1.15],
    front: [1, 0.12, 0],
    side: [0, 0.12, 1],
    rear: [-1, 0.18, 0],
    top: [0, 1, 0.02],
    left: [0, 0.12, -1]
  };
  Viewer.prototype.view = function (name, instant) {
    var d = PRESETS[name] || PRESETS.iso;
    var box = this.state && this.state.isolate ? this._boxFor(this.state.isolate) : this.bounds;
    this._fit(box || this.bounds, new this.THREE.Vector3(d[0], d[1], d[2]), instant, 0, this.state && this.state.isolate ? 1 : 0.8);
  };
  Viewer.prototype._tweenTo = function (pos, target, instant) {
    if (instant) {
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      this.tween = null;
      this.controls.update();
      return;
    }
    this.tween = { p0: this.camera.position.clone(), t0: this.controls.target.clone(), p1: pos, t1: target, start: performance.now(), dur: 650 };
  };
  Viewer.prototype._stepTween = function () {
    var tw = this.tween;
    var k = Math.min(1, (performance.now() - tw.start) / tw.dur);
    var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    this.camera.position.lerpVectors(tw.p0, tw.p1, e);
    this.controls.target.lerpVectors(tw.t0, tw.t1, e);
    if (k >= 1) this.tween = null;
  };

  /** Ask for a fresh frame on the next animation tick. */
  Viewer.prototype.invalidate = function () { this._dirty = true; };
  // Every method that can change what is on screen marks the frame dirty after it runs.
  // Read-only helpers and the per-frame steps called from the loop itself are left alone.
  var NO_REDRAW = { isModelled: 1, modelledIds: 1, hiddenCount: 1, isExploded: 1, explodeRefs: 1, invalidate: 1,
    _boxFor: 1, _inside: 1, _explodeVectors: 1, _placeCallouts: 1, _stepTween: 1, _stepExplode: 1 };
  Object.keys(Viewer.prototype).forEach(function (name) {
    var fn = Viewer.prototype[name];
    if (typeof fn !== 'function' || NO_REDRAW[name]) return;
    Viewer.prototype[name] = function () {
      var out = fn.apply(this, arguments);
      this._dirty = true;
      return out;
    };
  });

  root.MF35Viewer = {
    available: function () { return !!(root.THREE && root.THREE.OrbitControls && root.MF35Model && webglAvailable()); },
    create: function (opts) { return new Viewer(opts); }
  };
})(typeof self !== 'undefined' ? self : this);
