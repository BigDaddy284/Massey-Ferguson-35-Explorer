/* MF35 Explorer: Three.js viewer for the procedural model (Phase 3).
 * Rotation, zoom, pan, picking, highlighting, hiding, isolation, X-ray and camera presets.
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

    scene.add(new THREE.HemisphereLight(0xf4f7fb, 0x7f858c, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 0.95);
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

    this.casingBoxes = [];
    this.meshes.forEach(function (m) { if (m.userData.casing) self.casingBoxes.push({ pid: m.userData.partId, mesh: m, box: new THREE.Box3().setFromObject(m) }); });

    this.state = { selected: null, hover: null, hidden: {}, isolate: null, xray: false, fitted: function () { return true; } };

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.screenSpacePanning = true;
    controls.minDistance = 0.35;
    controls.maxDistance = 9;
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
    var loop = function () {
      requestAnimationFrame(loop);
      if (!el.isConnected) return;
      if (self.tween) self._stepTween();
      controls.update();
      renderer.render(scene, camera);
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
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  Viewer.prototype.attach = function (host) {
    if (this.el.parentNode !== host) host.appendChild(this.el);
    this.resize();
  };

  /* ----- what is modelled ----- */
  Viewer.prototype.isModelled = function (id) { return !!(this.partsUnder[id] && this.partsUnder[id].length); };
  Viewer.prototype.modelledIds = function () { return Object.keys(this.meshesByPart); };

  /* ----- visual state ----- */
  Viewer.prototype.setFitted = function (fn) { this.state.fitted = fn; this.applyVisuals(); };
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
    var hov = st.hover ? { } : {};
    if (st.hover) hov[st.hover] = true;
    var iso = st.isolate ? under(this.partsUnder[st.isolate]) : null;
    // Selecting a part hidden inside a casing makes the casings see-through automatically.
    var autoXray = false;
    if (st.selected && !st.xray && this.partsUnder[st.selected]) {
      var sb = this._boxFor(st.selected, true);
      if (sb) {
        var c = sb.getCenter(new this.THREE.Vector3());
        autoXray = this.casingBoxes.some(function (cb) { return !sel[cb.pid] && cb.mesh.visible && st.fitted(cb.pid) && !st.hidden[cb.pid] && cb.box.containsPoint(c); });
      }
    }
    this.state.autoXray = autoXray;
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
      else if ((st.xray || autoXray) && m.userData.casing && !sel[pid]) { opacity = 0.16; transparent = true; }
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
  Viewer.prototype._fit = function (box, dir, instant, minDist, scale, avoid) {
    var THREE = this.THREE;
    var sphere = box.getBoundingSphere(new THREE.Sphere());
    var r = Math.max(sphere.radius, 0.05);
    var fov = this.camera.fov * Math.PI / 180;
    var aspect = this.camera.aspect || 1.6;
    var fit = (r / Math.sin(Math.min(fov, fov * aspect) / 2)) * (scale || 1);
    var dist0 = Math.min(Math.max(fit * 1.05, this.controls.minDistance * 1.1, minDist || 0), this.controls.maxDistance);
    var target = sphere.center.clone();
    var outer = this.bounds.clone().expandByScalar(0.05);
    var self = this;
    function place(d) {
      var unit = d.clone().normalize();
      var dist = dist0;
      var pos = target.clone().addScaledVector(unit, dist);
      // Keep the camera outside the tractor's outline.
      for (var i = 0; i < 30 && outer.containsPoint(pos) && dist < self.controls.maxDistance; i++) {
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

  root.MF35Viewer = {
    available: function () { return !!(root.THREE && root.THREE.OrbitControls && root.MF35Model && webglAvailable()); },
    create: function (opts) { return new Viewer(opts); }
  };
})(typeof self !== 'undefined' ? self : this);
