/* MF35 Explorer: original procedural 3D model of a 1958 Massey Ferguson 35 diesel.
 *
 * Built from simple shapes in code. It is not traced from, or derived from, any AGCO
 * drawing or third-party 3D asset. Main proportions follow the FE-35 workshop manual's
 * general data (SRC-035 B.1): wheelbase 72 in, track 48 in front / 52 in rear,
 * tyres 4 x 19 front and 10 x 28 rear, overall length 117 in, width 64 in, height 54 in,
 * ground clearance 12 5/8 in under the centre and 21 in under the front axle.
 * Engine internals use the 23C bore and stroke (84 x 102 mm). The bonnet, grille, dash
 * cowl, clamshell mudguards, dished wheels and seat follow the owner's photograph and period
 * views of the FE35 by eye. Other shapes and the positions of parts the manual does not
 * dimension are approximate and simplified. Surface grain is generated in code (no textures
 * are loaded from files).
 *
 * Every mesh belongs to a group named with a hierarchy id from data/hierarchy.json, so
 * the 3D object, the catalogue record and (later) the diagram references share one key.
 *
 * Axes: metres; x points forward (rear axle at x = 0), y up (ground at y = 0),
 * z to the tractor's right-hand side.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MF35Model = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var IN = 0.0254;
  // Main dimensions (SRC-035 B.1, B.29)
  var DIM = {
    wheelbase: 72 * IN,           // 1.829 m
    rearHalfTrack: 52 * IN / 2,   // 0.660 m
    frontHalfTrack: 48 * IN / 2,  // 0.610 m
    rearTyreR: 0.60,              // 10-28: 28 in rim + 10 in section, about 47 in diameter
    rearRimR: 28 * IN / 2,
    frontTyreR: 0.34,             // 4.00-19: 19 in rim + 4 in section, about 27 in diameter
    frontRimR: 19 * IN / 2,
    crankY: 0.66,
    bore: 0.084137,
    stroke: 0.1016
  };

  // Hierarchy ids treated as outer casings: made see-through in X-ray mode.
  var CASINGS = ['engine-block', 'cylinder-head', 'rocker-cover', 'sump', 'timing-cover', 'clutch-housing',
    'gearbox-casing', 'gearbox-top-cover', 'centre-housing', 'axle-trumpet-lh', 'axle-trumpet-rh', 'brake-drum',
    'lift-cover-casting', 'bonnet', 'side-panels', 'grille', 'fuel-tank', 'radiator', 'dashboard', 'hyd-pump',
    'cylinder-liner', 'lift-cylinder', 'clutch-dual-cover', 'clutch-single-cover', 'pto-guard', 'air-cleaner', 'mudguards',
    'footplates', 'seat', 'steering-box', 'flywheel', 'clutch-dual-transmission-plate', 'clutch-dual-pto-plate', 'clutch-single-plate'];

  // Exploded-view directions: how far (metres, at full explosion) each group moves away from
  // its parent assembly. 'mirror' flips z for the left-hand side so pairs open outwards.
  // Groups not listed move radially away from their parent's centre (see viewer.js).
  // These are presentation choices for a clear layout, not dismantling instructions.
  var EXPLODE = {
    // whole tractor
    bodywork: [0, 0.95, 0],
    fuel: [0.05, 0.55, 0],
    cooling: [0.85, 0.2, 0],
    engine: [0.35, 0.22, 0],
    clutch: [0.12, 0.05, 0],
    transmission: [0, 0, 0],
    'rear-axle': [-0.12, 0, 0],
    pto: [-0.2, -0.3, 0],
    hydraulics: [-0.35, 0.6, 0],
    linkage: [-0.8, 0.1, 0],
    'front-axle': [0.55, -0.05, 0],
    electrical: [0.05, 0.35, 0.5],
    wheels: [0, 0, 0.85, 'mirror'],
    // engine
    'engine-block-assy': [0, 0, 0],
    'cylinder-head-assy': [0, 0.32, 0],
    valvetrain: [0, 0.22, 0],
    'crank-assy': [0, -0.32, 0],
    'lubrication-assy': [0, -0.55, 0],
    'timing-assy': [0.32, 0, 0],
    'flywheel-assy': [-0.3, 0, 0],
    manifolds: [0, 0.05, 0.38],
    // hydraulics
    'hyd-pump': [0, -0.15, 0],
    'lift-cover': [0, 0.12, 0],
    'hyd-controls': [0, 0.3, 0.35],
    'lift-cover-gasket': [0, 0.16, 0],
    'lift-cylinder': [0.34, -0.2, 0],
    'lift-piston-rings': [0.18, -0.2, 0],
    'lift-piston': [0.07, -0.2, 0],
    'connecting-rod-ram': [-0.08, -0.2, 0],
    rockshaft: [-0.18, 0.05, 0],
    'rockshaft-bushes': [-0.18, 0.05, 0.1, 'mirror'],
    'rockshaft-seals': [-0.18, 0.05, 0.2, 'mirror'],
    'lift-arm-lh': [-0.3, 0, -0.32],
    'lift-arm-rh': [-0.3, 0, 0.32],
    quadrant: [0, 0.05, 0.12],
    'draft-lever': [0, 0.05, 0.24],
    'position-lever': [0, 0.05, 0.36],
    'draft-control-spring': [-0.3, 0, 0],
    'draft-control-plunger': [-0.16, 0, 0],
    'draft-control-rocker': [-0.02, -0.12, 0],
    'top-link-bracket': [-0.45, 0.05, 0],
    'position-control-cam': [0.02, -0.06, 0.12],
    'internal-control-linkage': [0.16, -0.1, 0],
    // rear axle
    differential: [0, -0.05, 0],
    brakes: [0.25, 0, 0],
    // bodywork
    bonnet: [0, 0.35, 0],
    'side-panels': [0, 0.15, 0.3, 'mirror'],
    grille: [0.3, 0.05, 0],
    'front-badge': [0.45, 0.1, 0],
    dashboard: [0, 0.3, 0],
    'serial-plate': [0, 0.42, 0.15],
    mudguards: [-0.05, 0.1, 0.35, 'mirror'],
    seat: [-0.2, 0.4, 0],
    'seat-support': [-0.12, 0.18, 0],
    footplates: [0, -0.08, 0.3, 'mirror'],
    // wheels: each layer slides outwards off its hub
    'front-wheel-nuts': [0.1, 0, 0.1, 'mirror'],
    'front-wheel': [0.1, 0, 0.25, 'mirror'],
    'front-tyre': [0.1, 0, 0.45, 'mirror'],
    'rear-wheel-nuts': [-0.1, 0, 0.1, 'mirror'],
    'rear-wheel-centre': [-0.1, 0, 0.22, 'mirror'],
    'rear-rim-clamps': [-0.1, 0, 0.34, 'mirror'],
    'rear-rim': [-0.1, 0, 0.46, 'mirror'],
    'rear-tyre': [-0.1, 0, 0.7, 'mirror'],
    'tyre-valves': [0, 0.08, 0.8, 'mirror'],
    // clutch
    'clutch-dual': [0.3, 0, 0],
    'clutch-single': [0.3, 0, 0],
    'release-bearing': [0.08, 0, 0],
    'release-fork': [0, -0.18, 0],
    'clutch-pedal': [0, 0, -0.2],
    // casings that enclose their assembly move clear of it
    'clutch-housing': [-0.32, 0, 0],
    'gearbox-top-cover': [0, 0.3, 0],
    'gearbox-casing': [0, -0.05, -0.35],
    'centre-housing': [0.1, 0, 0],
    'lift-cover-casting': [0, 0.3, 0],
    'timing-cover': [0.22, 0, 0],
    'rocker-cover': [0, 0.2, 0]
  };

  // Axis along which parts that share their assembly's centre slide out (default: upwards).
  var EXPLODE_AXIS = {
    'hyd-pump': [1, 0, 0],
    clutch: [1, 0, 0],
    'clutch-dual': [1, 0, 0],
    'clutch-single': [1, 0, 0],
    'flywheel-assy': [-1, 0, 0],
    transmission: [0, 1, 0],
    differential: [0, 0, 1],
    'rear-axle': [0, 0, 1],
    pto: [-1, 0, 0],
    'crank-assy': [0, -1, 0],
    'timing-assy': [1, 0, 0],
    'fuel-injection': [0, 0, -1],
    cooling: [1, 0, 0],
    wheels: [0, 0, 1]
  };

  function build(THREE) {
    var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
    var rootGroup = new THREE.Group();
    rootGroup.name = 'mf35';
    var parts = {};

    /* ---------- materials ----------
     * Procedural surface textures (no image files): fine noise for cast iron and a softer
     * grain for painted tinwork, so castings read as castings and paint as paint. */
    function noiseTexture(size, scale, contrast, seed) {
      if (typeof document === 'undefined') return null;
      var c = document.createElement('canvas');
      c.width = c.height = size;
      var ctx = c.getContext('2d');
      var img = ctx.createImageData(size, size);
      var d = img.data;
      var rnd = seed || 1;
      function rand() { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; }
      // Value noise: a coarse random grid interpolated, plus fine grain.
      var cells = Math.max(2, Math.round(size / scale));
      var grid = [];
      for (var i = 0; i < (cells + 1) * (cells + 1); i++) grid.push(rand());
      function at(gx, gy) { return grid[((gy % cells) + cells) % cells * (cells + 1) + ((gx % cells) + cells) % cells]; }
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var fx = x / scale, fy = y / scale;
          var gx = Math.floor(fx), gy = Math.floor(fy);
          var tx = fx - gx, ty = fy - gy;
          tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
          var v = at(gx, gy) * (1 - tx) * (1 - ty) + at(gx + 1, gy) * tx * (1 - ty) + at(gx, gy + 1) * (1 - tx) * ty + at(gx + 1, gy + 1) * tx * ty;
          v = 0.5 + (v - 0.5) * contrast + (rand() - 0.5) * contrast * 0.35;
          var b = Math.max(0, Math.min(255, Math.round(v * 255)));
          var k = (y * size + x) * 4;
          d[k] = d[k + 1] = d[k + 2] = b; d[k + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      var tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }
    var castTex = noiseTexture(256, 6, 0.9, 7);     // sand-cast grain
    var paintTex = noiseTexture(256, 24, 0.5, 3);   // soft paint variation
    var rubberTex = noiseTexture(128, 3, 0.8, 11);
    function mat(color, rough, metal, opts) {
      var o = { color: color, roughness: rough == null ? 0.6 : rough, metalness: metal == null ? 0.1 : metal };
      if (opts) for (var k in opts) o[k] = opts[k];
      return new THREE.MeshStandardMaterial(o);
    }
    function textured(m, tex, bump, repeat) {
      if (!tex) return m;
      var t = tex.clone(); t.needsUpdate = true; t.repeat.set(repeat || 2, repeat || 2);
      m.roughnessMap = t;
      if (bump) { m.bumpMap = t; m.bumpScale = bump; }
      return m;
    }
    var M = {
      red: textured(mat(0xa32127, 0.42, 0.08), paintTex, 0.0006, 3),      // tinwork: MF red from Dec 1957 (SRC-001)
      redDark: textured(mat(0x8a1c22, 0.5, 0.08), paintTex, 0.0006, 3),
      grey: textured(mat(0x8f949a, 0.72, 0.28), castTex, 0.0018, 4),      // grey-painted castings (SRC-001)
      greyDark: textured(mat(0x666c73, 0.74, 0.28), castTex, 0.0018, 4),
      castRaw: textured(mat(0x4f5459, 0.85, 0.35), castTex, 0.0025, 4),   // unpainted iron
      alu: textured(mat(0xb9bcbf, 0.55, 0.5), castTex, 0.001, 6),         // alloy rocker cover
      steel: mat(0xb4b9bf, 0.35, 0.65),
      steelDark: mat(0x6d7278, 0.45, 0.55),
      chrome: mat(0xe6e9ec, 0.12, 0.95),
      black: textured(mat(0x1d1f22, 0.65, 0.08), paintTex, 0.0004, 3),
      tyre: textured(mat(0x1e2022, 0.92, 0.0), rubberTex, 0.002, 6),
      rubber: mat(0x2b2d30, 0.85, 0.0),
      copper: mat(0xb87333, 0.35, 0.7),
      brass: mat(0xc9a34a, 0.35, 0.7),
      bronze: mat(0x9c6b30, 0.4, 0.6),
      wheel: textured(mat(0xb3b7bb, 0.5, 0.3), paintTex, 0.0005, 3),      // silver-painted wheel centres and rims
      glass: new THREE.MeshStandardMaterial({ color: 0xe8eef5, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.6 }),
      lens: new THREE.MeshStandardMaterial({ color: 0xf6f3e6, roughness: 0.25, metalness: 0.0, transparent: true, opacity: 0.85 }),
      fuelGlass: new THREE.MeshStandardMaterial({ color: 0xd8c27a, roughness: 0.15, metalness: 0.0, transparent: true, opacity: 0.7 }),
      battery: mat(0x2a2c30, 0.6, 0.05),
      gauge: mat(0xf1efe6, 0.5, 0.0),
      gaugeFace: mat(0x15171a, 0.6, 0.0),
      seat: textured(mat(0x2a2d31, 0.85, 0.0), rubberTex, 0.0015, 4),
      plate: mat(0xc7cbd0, 0.35, 0.6),
      core: textured(mat(0x3c4146, 0.8, 0.1), castTex, 0.001, 8),
      gasket: mat(0x8a6a3b, 0.6, 0.2),
      paper: mat(0xe2d9b8, 0.9, 0.0),
      badge: mat(0xd9dde2, 0.2, 0.9),
      badgeRed: mat(0xb0202a, 0.35, 0.3)
    };

    /* ---------- helpers ---------- */
    function part(id) {
      if (!parts[id]) {
        var g = new THREE.Group();
        g.name = id;
        g.userData.partId = id;
        rootGroup.add(g);
        parts[id] = g;
      }
      return parts[id];
    }
    function add(id, geo, material, pos, rot) {
      var m = new THREE.Mesh(geo, material);
      if (pos) m.position.copy(pos);
      if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
      m.castShadow = true;
      m.receiveShadow = true;
      part(id).add(m);
      return m;
    }
    function box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
    // Rounded box: w (x) by h (y) by d (z), corner radius r on the x-y profile.
    function rbox(w, h, d, r) {
      r = Math.min(r || 0.02, w / 2 - 0.001, h / 2 - 0.001);
      var s = new THREE.Shape();
      var x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      var bev = Math.min(0.012, d / 4);
      var g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 2, curveSegments: 6 });
      g.translate(0, 0, -(d - 2 * bev) / 2);
      return g;
    }
    function cyl(r1, r2, len, axis, seg, open) {
      var g = new THREE.CylinderGeometry(r1, r2, len, seg || 24, 1, !!open);
      if (axis === 'x') g.rotateZ(-Math.PI / 2);
      if (axis === 'z') g.rotateX(Math.PI / 2);
      return g;
    }
    function ring(rOuter, tube, axis, seg) {
      var g = new THREE.TorusGeometry(rOuter, tube, 8, seg || 32);
      if (axis === 'x') g.rotateY(Math.PI / 2);
      if (axis === 'y') g.rotateX(Math.PI / 2);
      return g;
    }
    function sphere(r) { return new THREE.SphereGeometry(r, 16, 12); }
    // Lathe profile [[radius, along-axis], ...] turned about the given axis.
    function lathe(profile, axis, seg) {
      var g = new THREE.LatheGeometry(profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 40);
      if (axis === 'x') g.rotateZ(-Math.PI / 2);
      if (axis === 'z') g.rotateX(Math.PI / 2);
      return g;
    }
    // A round bar from a to b.
    function rod(id, a, b, r, material, seg) {
      var dir = new THREE.Vector3().subVectors(b, a);
      var len = dir.length();
      var g = new THREE.CylinderGeometry(r, r, len, seg || 12);
      var m = add(id, g, material, new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5));
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      return m;
    }
    // A flat bar from a to b, width w (in the plane containing 'side'), thickness t.
    function bar(id, a, b, w, t, material) {
      var dir = new THREE.Vector3().subVectors(b, a);
      var len = dir.length();
      var m = add(id, box(w, len, t), material, new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5));
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      return m;
    }
    function tube(id, points, r, material, closed) {
      var curve = new THREE.CatmullRomCurve3(points, !!closed, 'catmullrom', 0.3);
      return add(id, new THREE.TubeGeometry(curve, Math.max(24, points.length * 12), r, 8, !!closed), material);
    }
    function helix(id, base, height, radius, turns, wire, material) {
      var pts = [];
      var n = Math.round(turns * 16);
      for (var i = 0; i <= n; i++) {
        var a = (i / n) * turns * Math.PI * 2;
        pts.push(V(Math.cos(a) * radius, (i / n) * height - height / 2, Math.sin(a) * radius));
      }
      return add(id, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, wire, 6, false), material, V(base.x, base.y + height / 2, base.z));
    }
    // Lofted surface through cross-sections. Each section is {x, pts: [[y, z], ...]} with the
    // same number of points; consecutive sections are joined with quads. Optional end caps.
    function loft(sections, caps) {
      var n = sections[0].pts.length;
      var pos = [], idx = [];
      sections.forEach(function (sec) { sec.pts.forEach(function (p) { pos.push(sec.x, p[0], p[1]); }); });
      for (var i = 0; i < sections.length - 1; i++) {
        for (var j = 0; j < n - 1; j++) {
          var a = i * n + j, b = a + 1, c = a + n, d = c + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
      if (caps) {
        [0, sections.length - 1].forEach(function (si, k) {
          var base = si * n;
          for (var j = 1; j < n - 1; j++) {
            if (k === 0) idx.push(base, base + j, base + j + 1); else idx.push(base, base + j + 1, base + j);
          }
        });
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }
    // Rounded-top cross-section used for the bonnet: from the left skirt bottom, over the crown, to the right.
    function crownSection(halfW, yBottom, yTop, r, nArc) {
      var pts = [[yBottom, -halfW]];
      var cx = halfW - r;
      for (var i = 0; i <= nArc; i++) {
        var a = Math.PI - (i / nArc) * Math.PI;   // 180 -> 0 degrees
        var z = Math.cos(a), y = Math.sin(a);
        // superellipse-ish blend: corners rounded with radius r, flat-ish crown between
        pts.push([yTop - r + r * y, (z < 0 ? -cx : cx) + r * z]);
      }
      pts.push([yBottom, halfW]);
      return pts;
    }
    function hexNut(id, pos, size, axis, material) {
      return add(id, cyl(size, size, size * 0.9, axis, 6), material || M.steelDark, pos);
    }
    var SIDES = [-1, 1];

    var WB = DIM.wheelbase, RR = DIM.rearTyreR, RF = DIM.frontTyreR, TR = DIM.rearHalfTrack, TF = DIM.frontHalfTrack;
    var CY = DIM.crankY;

    /* =====================================================================
     * WHEELS AND TYRES (10-28 rear on dished pressed-steel centres, 4.00-19 three-rib front)
     * ===================================================================== */
    SIDES.forEach(function (s) {
      var z = s * TR;
      // Rear tyre 10-28: lathe section plus angled bar lugs with rounded shoulders.
      var t = add('rear-tyre', lathe([[0.355, -0.118], [0.40, -0.13], [0.50, -0.128], [0.56, -0.112], [0.585, -0.08], [0.592, -0.03], [0.592, 0.03], [0.585, 0.08], [0.56, 0.112], [0.50, 0.128], [0.40, 0.13], [0.355, 0.118]], 'z', 64), M.tyre, V(0, RR, z));
      t.userData.spin = true;
      var lugs = 20;
      for (var i = 0; i < lugs; i++) {
        for (var h = -1; h <= 1; h += 2) {
          var a = (i / lugs) * Math.PI * 2 + (h > 0 ? Math.PI / lugs : 0);
          var lug = add('rear-tyre', rbox(0.035, 0.028, 0.125, 0.008), M.tyre,
            V(Math.cos(a) * 0.599, RR + Math.sin(a) * 0.599, z + h * 0.06));
          lug.rotation.set(0, 0, a);
          lug.rotateX(h * 0.55);
        }
      }
      // Rim (6-loop, with bead seats), dished centre disc, clamps, hub cap
      add('rear-rim', lathe([[0.342, -0.128], [0.362, -0.124], [0.36, -0.10], [0.346, -0.06], [0.340, 0.0], [0.346, 0.06], [0.36, 0.10], [0.362, 0.124], [0.342, 0.128]], 'z', 56), M.wheel, V(0, RR, z));
      var disc = add('rear-wheel-centre', lathe([[0.0, 0.0], [0.11, 0.0], [0.13, 0.012], [0.19, 0.035], [0.26, 0.055], [0.31, 0.06], [0.33, 0.058], [0.342, 0.05]], 'z', 48), M.wheel, V(0, RR, z - s * 0.085));
      disc.scale.z = s;
      add('rear-wheel-centre', lathe([[0.0, 0.0], [0.105, 0.0], [0.11, 0.012], [0.0, 0.012]], 'z', 32), M.wheel, V(0, RR, z - s * 0.085)).scale.z = s;
      for (var c = 0; c < 6; c++) {
        var ca = (c / 6) * Math.PI * 2 + Math.PI / 6;
        add('rear-rim-clamps', rbox(0.045, 0.03, 0.035, 0.006), M.steelDark, V(Math.cos(ca) * 0.325, RR + Math.sin(ca) * 0.325, z - s * 0.03)).rotation.z = ca;
        hexNut('rear-rim-clamps', V(Math.cos(ca) * 0.325, RR + Math.sin(ca) * 0.325, z - s * 0.052), 0.009, 'z');
      }
      for (var nb = 0; nb < 6; nb++) {
        var na = (nb / 6) * Math.PI * 2;
        hexNut('rear-wheel-nuts', V(Math.cos(na) * 0.082, RR + Math.sin(na) * 0.082, z - s * 0.07), 0.012, 'z');
      }
      add('tyre-valves', cyl(0.006, 0.006, 0.045, 'z', 8), M.brass, V(0.30, RR + 0.17, z - s * 0.02));
      add('tyre-valves', cyl(0.0075, 0.0075, 0.008, 'z', 8), M.black, V(0.30, RR + 0.17, z - s * 0.045));

      // Front tyre 4.00-19 (three-rib) and six-bolt pressed wheel
      var zf = s * TF;
      add('front-tyre', lathe([[0.24, -0.052], [0.285, -0.058], [0.318, -0.05], [0.332, -0.03], [0.326, -0.02], [0.338, -0.008], [0.338, 0.008], [0.326, 0.02], [0.332, 0.03], [0.318, 0.05], [0.285, 0.058], [0.24, 0.052]], 'z', 56), M.tyre, V(WB, RF, zf));
      add('front-wheel', lathe([[0.228, -0.052], [0.246, -0.048], [0.24, -0.02], [0.236, 0.0], [0.24, 0.02], [0.246, 0.048], [0.228, 0.052]], 'z', 48), M.wheel, V(WB, RF, zf));
      add('front-wheel', lathe([[0.0, 0.0], [0.06, 0.0], [0.075, 0.008], [0.15, 0.014], [0.21, 0.022], [0.232, 0.02]], 'z', 40), M.wheel, V(WB, RF, zf - s * 0.012)).scale.z = s;
      add('front-hub', lathe([[0.0, 0.0], [0.03, 0.0], [0.045, 0.025], [0.045, 0.05], [0.0, 0.05]], 'z', 24), M.chrome, V(WB, RF, zf + s * 0.01)).scale.z = s;   // hub cap
      for (var fn = 0; fn < 6; fn++) {
        var fa = (fn / 6) * Math.PI * 2;
        hexNut('front-wheel-nuts', V(WB + Math.cos(fa) * 0.058, RF + Math.sin(fa) * 0.058, zf + s * 0.0), 0.009, 'z');
      }
      add('tyre-valves', cyl(0.005, 0.005, 0.03, 'z', 8), M.brass, V(WB + 0.17, RF + 0.13, zf + s * 0.03));
    });

    /* =====================================================================
     * REAR AXLE, DIFFERENTIAL, BRAKES
     * ===================================================================== */
    // Centre housing: a deep casting with a flat top for the lift cover, rounded lower corners,
    // a rear face carrying the PTO and top-link bracket, and side faces for the axle housings.
    add('centre-housing', rbox(0.54, 0.60, 0.46, 0.09), M.grey, V(0.07, 0.60, 0));
    add('centre-housing', rbox(0.56, 0.08, 0.50, 0.02), M.grey, V(0.07, 0.885, 0));        // top flange
    add('centre-housing', rbox(0.30, 0.22, 0.40, 0.06), M.grey, V(-0.12, 0.46, 0));        // rear lower boss (PTO housing area)
    for (var cb = 0; cb < 7; cb++) SIDES.forEach(function (s) { hexNut('centre-housing', V(-0.16 + cb * 0.077, 0.93, s * 0.225), 0.008, 'y'); });
    SIDES.forEach(function (s) {
      var id = s > 0 ? 'axle-trumpet-rh' : 'axle-trumpet-lh';
      // Axle housing: bolted flange at the centre housing, tapering to the hub end with a brake flange.
      var tr = add(id, lathe([[0.17, 0.0], [0.17, 0.03], [0.145, 0.04], [0.125, 0.12], [0.10, 0.24], [0.088, 0.30], [0.088, 0.32], [0.11, 0.325], [0.11, 0.345], [0.0, 0.345]], 'z', 36), M.grey, V(0, RR, s * 0.23));
      tr.scale.z = s;
      for (var fb = 0; fb < 10; fb++) {
        var fa = (fb / 10) * Math.PI * 2;
        hexNut(id, V(Math.cos(fa) * 0.145, RR + Math.sin(fa) * 0.145, s * 0.235), 0.009, 'z');
      }
      // Mudguard and footplate bracket on each housing
      add(id, rbox(0.06, 0.26, 0.03, 0.01), M.grey, V(0.05, RR + 0.12, s * 0.46));
      // Brakes (SRC-035 P.1, K.11): Girling double-anchor floating-cam drum brakes, 14 x 2 in, at the rear
      // wheels. The backplate is bolted to the outer end of the axle housing; the drum is fitted to the axle
      // shaft between the hub and the wheel centre and opens inboard over the shoes. The operating camshaft
      // passes through the backplate and carries the rear brake lever on its inboard side.
      var BZ = 0.548;                                   // backplate, at the trumpet's outer flange
      add('brake-backing-plate', cyl(0.172, 0.172, 0.008, 'z', 40), M.greyDark, V(0, RR, s * BZ));
      add('brake-backing-plate', ring(0.168, 0.008, 'z'), M.greyDark, V(0, RR, s * (BZ + 0.006)));
      var drum = add('brake-drum', lathe([[0.090, 0.0], [0.180, 0.0], [0.180, 0.012], [0.187, 0.018], [0.187, 0.058], [0.178, 0.058], [0.178, 0.008], [0.090, 0.008]], 'z', 48), M.greyDark, V(0, RR, s * 0.604));
      drum.scale.z = -s;                                // closed face outboard, open inboard
      for (var bs = 0; bs < 2; bs++) {                  // two shoes, each with its lining
        var shoe = add('brake-shoes', new THREE.TorusGeometry(0.163, 0.011, 6, 20, Math.PI * 0.82), M.bronze, V(0, RR, s * 0.575));
        shoe.rotation.z = bs * Math.PI + Math.PI * 0.09;
        shoe.scale.z = 2.2;
      }
      add('brake-springs', cyl(0.006, 0.006, 0.20, 'x', 8), M.steel, V(0, RR + 0.12, s * 0.574));
      add('brake-springs', cyl(0.006, 0.006, 0.20, 'x', 8), M.steel, V(0, RR - 0.12, s * 0.574));
      // Operating camshaft through the backplate (front, low) and the rear brake lever hanging from it
      add('brake-cam', cyl(0.014, 0.014, 0.07, 'z', 12), M.steelDark, V(0.115, RR - 0.10, s * (BZ - 0.02)));
      bar('brake-cam', V(0.115, RR - 0.10, s * (BZ - 0.05)), V(0.13, RR - 0.21, s * (BZ - 0.05)), 0.03, 0.012, M.steelDark);
      add('half-shaft', cyl(0.03, 0.03, 0.48, 'z', 16), M.steel, V(0, RR, s * 0.34));
      add('rear-hub', cyl(0.11, 0.11, 0.06, 'z', 32), M.greyDark, V(0, RR, s * 0.615));
      add('axle-seals', ring(0.06, 0.01, 'z'), M.rubber, V(0, RR, s * 0.59));
      for (var ws = 0; ws < 8; ws++) {
        var wa = (ws / 8) * Math.PI * 2;
        add('wheel-studs-rear', cyl(0.007, 0.007, 0.08, 'z', 8), M.steel, V(Math.cos(wa) * 0.09, RR + Math.sin(wa) * 0.09, s * TR));
      }
      add('diff-bearings', ring(0.06, 0.014, 'z'), M.steel, V(0, RR, s * 0.12));
      add('diff-gears', cyl(0.035, 0.02, 0.04, 'z', 16), M.steelDark, V(0, RR, s * 0.05)).rotation.x = s > 0 ? Math.PI / 2 : -Math.PI / 2;
    });
    add('crown-wheel', cyl(0.15, 0.15, 0.03, 'z', 48), M.steelDark, V(0, RR, -0.09));
    add('pinion', cyl(0.025, 0.045, 0.08, 'x', 20), M.steelDark, V(0.12, RR, -0.03));
    add('diff-cage', cyl(0.08, 0.08, 0.16, 'z', 24), M.steel, V(0, RR, 0.0));
    add('diff-lock', cyl(0.05, 0.05, 0.03, 'z', 20), M.brass, V(0, RR, 0.14));

    /* =====================================================================
     * ENGINE: STANDARD 23C
     * ===================================================================== */
    var EX0 = 1.10, EX1 = 1.70;                    // block front/rear faces
    var CYLX = [1.595, 1.465, 1.335, 1.205];       // no. 1 at the front
    var DECK = 0.98;
    add('engine-block', rbox(EX1 - EX0, DECK - 0.62, 0.34, 0.03), M.grey, V((EX0 + EX1) / 2, (DECK + 0.62) / 2, 0));
    SIDES.forEach(function (s) {
      add('engine-block', rbox(0.46, 0.16, 0.012, 0.01), M.grey, V(1.40, 0.86, s * 0.175));   // water jacket side plates
      for (var sp = 0; sp < 6; sp++) hexNut('engine-block', V(1.19 + sp * 0.084, 0.93, s * 0.183), 0.006, 'z');
    });
    add('engine-block', rbox(0.10, 0.10, 0.36, 0.02), M.grey, V(EX1 - 0.03, 0.70, 0));          // front mounting boss
    add('engine-block', rbox(0.06, 0.30, 0.40, 0.02), M.grey, V(EX0 + 0.02, 0.80, 0));          // rear flange to the clutch housing
    [1.22, 1.40, 1.58].forEach(function (x) { add('core-plugs', cyl(0.022, 0.022, 0.01, 'z', 20), M.brass, V(x, 0.84, -0.172)); });
    [1.14, 1.66].forEach(function (x) { add('block-studs-dowels', cyl(0.006, 0.006, 0.03, 'y', 8), M.steel, V(x, DECK + 0.005, 0.13)); });
    CYLX.forEach(function (x, i) {
      // Liners: removable flanged sleeves (SRC-035 B.32)
      add('cylinder-liner', cyl(0.047, 0.047, 0.24, 'y', 28, true), M.steel, V(x, 0.86, 0));
      add('cylinder-liner', ring(0.049, 0.004, 'y', 28), M.steel, V(x, 0.978, 0));
      // Pistons 1 and 4 at TDC, 2 and 3 at BDC.
      var up = i === 0 || i === 3;
      var theta = up ? 0 : Math.PI;
      var r = DIM.stroke / 2, L = 0.19;
      var pinY = CY + r * Math.cos(theta) + Math.sqrt(L * L - Math.pow(r * Math.sin(theta), 2));
      add('piston', cyl(0.042, 0.042, 0.095, 'y', 28), M.steel, V(x, pinY + 0.02, 0));
      for (var k = 0; k < 3; k++) add('piston-rings', ring(0.0425, 0.0025, 'y', 28), M.steelDark, V(x, pinY + 0.058 - k * 0.011, 0));
      add('piston-rings', ring(0.0425, 0.0035, 'y', 28), M.steelDark, V(x, pinY + 0.022, 0));
      add('gudgeon-pin', cyl(0.0143, 0.0143, 0.075, 'z', 12), M.steel, V(x, pinY, 0));
      add('small-end-bush', cyl(0.019, 0.019, 0.03, 'z', 14, true), M.bronze, V(x, pinY, 0));
      var pinPos = V(x, CY + r * Math.cos(theta), 0);
      rod('conrod', V(x, pinY, 0), pinPos, 0.012, M.steelDark);
      add('conrod', cyl(0.038, 0.038, 0.032, 'z', 20), M.steelDark, pinPos);
      add('big-end-bearings', ring(0.03, 0.003, 'z', 24), M.bronze, pinPos);
      SIDES.forEach(function (s) { add('conrod-bolts', cyl(0.005, 0.005, 0.06, 'y', 8), M.steel, V(x + s * 0.026, pinPos.y, 0.0)); });
      // Crankshaft: crankpin and webs
      add('crankshaft', cyl(0.029, 0.029, 0.04, 'x', 20), M.steel, pinPos);
      SIDES.forEach(function (s) {
        var web = add('crankshaft', rbox(0.016, 0.12, 0.09, 0.03), M.steel, V(x + s * 0.03, CY + (up ? 0.03 : -0.03), 0));
        web.rotation.y = Math.PI / 2;
      });
      // Cylinder head details over each bore
      add('combustion-chamber-insert', cyl(0.0178, 0.0178, 0.02, 'y', 20), M.steelDark, V(x, 1.0, -0.055));
      // Adjacent cylinders mirror their valves (head port face, SRC-035 Fig. 122): E I | I E | E I | I E from the front.
      var vo = i % 2 === 0 ? 1 : -1;
      [[-0.025 * vo, 'inlet'], [0.025 * vo, 'exhaust']].forEach(function (v) {
        var vx = x + v[0];
        var kind = v[1];
        add(kind + '-valve', cyl(0.0039, 0.0039, 0.13, 'y', 8), M.steel, V(vx, 1.05, 0.0));
        add(kind + '-valve', cyl(kind === 'inlet' ? 0.019 : 0.0155, 0.004, 0.012, 'y', 20), M.steel, V(vx, 0.99, 0));
        add(kind + '-valve-guide', cyl(0.0075, 0.0075, 0.05, 'y', 10, true), M.bronze, V(vx, 1.04, 0));
        helix('valve-spring-outer', V(vx, 1.065, 0), 0.045, 0.014, 5, 0.0018, M.steelDark);
        helix('valve-spring-inner', V(vx, 1.065, 0), 0.042, 0.0095, 6, 0.0013, M.steel);
        add('valve-cap-collets', cyl(0.016, 0.012, 0.007, 'y', 14), M.steel, V(vx, 1.112, 0));
        // Rockers, pushrods, tappets (pushrods run up the left side of the block)
        bar('rocker-arm', V(vx, 1.122, 0), V(vx, 1.128, -0.06), 0.012, 0.012, M.steelDark);
        rod('pushrod', V(vx, 1.125, -0.065), V(vx, 0.80, -0.11), 0.004, M.steel);
        add('tappet', cyl(0.009, 0.009, 0.03, 'y', 12), M.steel, V(vx, 0.785, -0.11));
      });
      // Injectors on the left of the head, Pintaux nozzles (SRC-035 B.41)
      add('injector', cyl(0.012, 0.012, 0.09, 'y', 14), M.steel, V(x, 1.08, -0.085)).rotation.x = -0.35;
      add('injector-nozzle', cyl(0.006, 0.003, 0.025, 'y', 10), M.steelDark, V(x, 1.02, -0.066)).rotation.x = -0.35;
      add('injector-seals', ring(0.009, 0.002, 'y', 16), M.copper, V(x, 1.033, -0.07));
      add('heater-plugs', cyl(0.006, 0.006, 0.05, 'z', 8), M.brass, V(x, 1.03, 0.16));
    });
    // Crankshaft main journals and the parts along it
    add('crankshaft', cyl(0.035, 0.035, EX1 - EX0 + 0.08, 'x', 20), M.steel, V((EX0 + EX1) / 2, CY, 0));
    [EX0 + 0.02, 1.40, EX1 - 0.02].forEach(function (x) { add('main-bearings', cyl(0.042, 0.042, 0.035, 'x', 24, true), M.bronze, V(x, CY, 0)); });
    SIDES.forEach(function (s) { add('thrust-washers', ring(0.045, 0.004, 'x', 24), M.bronze, V(1.40 + s * 0.02, CY, 0)); });
    add('rear-crank-seal', ring(0.052, 0.008, 'x', 28), M.rubber, V(EX0 - 0.005, CY, 0));
    add('front-crank-seal', ring(0.03, 0.006, 'x', 24), M.rubber, V(EX1 + 0.055, CY, 0));
    add('crank-pulley', cyl(0.073, 0.073, 0.035, 'x', 32), M.greyDark, V(1.79, CY, 0));
    add('crank-pulley', cyl(0.025, 0.025, 0.04, 'x', 12), M.steel, V(1.825, CY, 0));               // starting-handle dog
    // Camshaft and timing chain (chain drive: SRC-035, SRC-008)
    add('camshaft', cyl(0.016, 0.016, EX1 - EX0 + 0.04, 'x', 14), M.steel, V((EX0 + EX1) / 2, 0.76, -0.11));
    CYLX.forEach(function (x) { [-0.025, 0.025].forEach(function (o) { add('camshaft', cyl(0.022, 0.022, 0.012, 'x', 3), M.steel, V(x + o, 0.76, -0.11)); }); });
    [EX0 + 0.03, 1.40, EX1 - 0.03].forEach(function (x) { add('camshaft-bearings', cyl(0.024, 0.024, 0.025, 'x', 18, true), M.bronze, V(x, 0.76, -0.11)); });
    add('crank-sprocket', cyl(0.032, 0.032, 0.018, 'x', 21), M.steelDark, V(1.735, CY, 0));
    add('cam-sprocket', cyl(0.064, 0.064, 0.018, 'x', 42), M.steelDark, V(1.735, 0.76, -0.11));
    tube('timing-chain', [V(1.735, CY - 0.034, 0.0), V(1.735, CY, 0.036), V(1.735, 0.76, -0.04), V(1.735, 0.826, -0.11), V(1.735, 0.76, -0.177), V(1.735, CY + 0.02, -0.04), V(1.735, CY - 0.02, -0.03)], 0.005, M.steelDark, true);
    add('timing-chain-tensioner', rbox(0.03, 0.06, 0.02, 0.008), M.steelDark, V(1.735, 0.71, 0.05));
    add('timing-cover', rbox(0.05, 0.30, 0.30, 0.06), M.grey, V(1.725, 0.72, -0.04));
    add('injection-pump-drive', cyl(0.02, 0.02, 0.17, 'x', 14), M.steelDark, V(1.635, 0.82, -0.245));
    // Lubrication
    add('sump', rbox(EX1 - EX0 + 0.02, 0.18, 0.30, 0.04), M.grey, V((EX0 + EX1) / 2, 0.53, 0));
    add('sump', rbox(0.22, 0.13, 0.26, 0.04), M.grey, V(1.82, 0.535, 0));   // forward extension carrying the front axle (shape approximate)
    hexNut('sump', V(1.40, 0.435, 0.0), 0.012, 'y');   // drain plug
    for (var sb = 0; sb < 6; sb++) SIDES.forEach(function (s) { hexNut('sump', V(1.14 + sb * 0.105, 0.62, s * 0.16), 0.007, 'y'); });
    // Rotor oil pump flange-bolted to the front main bearing housing, gear-driven from the crankshaft
    // (SRC-035 C.102, Figs. 101 and 130); gauze strainer in the sump below it; relief valve in the filter head.
    add('oil-pump', cyl(0.035, 0.035, 0.06, 'x', 18), M.steelDark, V(1.67, CY - 0.085, 0));
    add('oil-pump', cyl(0.03, 0.03, 0.015, 'x', 24), M.steelDark, V(1.745, CY - 0.085, 0));       // driven gear
    add('oil-pump', cyl(0.05, 0.05, 0.015, 'x', 30), M.steelDark, V(1.758, CY, 0));               // driving gear on the crank nose
    add('oil-strainer', rbox(0.12, 0.012, 0.10, 0.004), M.steel, V(1.64, 0.47, 0));
    rod('oil-strainer', V(1.65, 0.48, 0), V(1.67, CY - 0.12, 0), 0.008, M.steel);
    add('oil-pressure-relief', cyl(0.012, 0.012, 0.04, 'x', 10), M.brass, V(1.52, 0.815, -0.255));
    add('oil-filter', cyl(0.05, 0.05, 0.16, 'y', 24), M.greyDark, V(1.52, 0.72, -0.225));
    add('oil-filter', cyl(0.055, 0.055, 0.03, 'y', 24), M.grey, V(1.52, 0.815, -0.225));
    hexNut('oil-filter', V(1.52, 0.63, -0.225), 0.012, 'y');
    // Engine oil filler: ribbed cap on the left of the block below the head joint, near the front (SRC-035 Fig. 109 'O')
    add('engine-block', cyl(0.02, 0.02, 0.04, 'z', 16), M.grey, V(1.60, 0.93, -0.19));
    add('engine-block', cyl(0.03, 0.03, 0.025, 'z', 20), M.black, V(1.60, 0.93, -0.215));
    // Pump to filter head on the left; the rocker shaft is fed through internal drillings, not a pipe.
    tube('oil-pipes', [V(1.67, CY - 0.085, -0.03), V(1.64, 0.62, -0.14), V(1.55, 0.70, -0.21), V(1.53, 0.80, -0.225)], 0.005, M.copper);
    rod('dipstick', V(1.30, 0.55, -0.16), V(1.32, 0.96, -0.23), 0.004, M.steel);
    add('dipstick', ring(0.014, 0.003, 'x'), M.steel, V(1.32, 0.975, -0.23));
    tube('engine-breather', [V(1.30, 1.16, 0.06), V(1.27, 1.19, 0.12), V(1.25, 0.90, 0.20), V(1.24, 0.55, 0.20)], 0.008, M.black);
    // Flywheel
    add('flywheel', cyl(0.20, 0.20, 0.05, 'x', 48), M.steelDark, V(1.065, CY, 0));
    add('ring-gear', ring(0.205, 0.008, 'x', 64), M.steel, V(1.07, CY, 0));
    for (var fb = 0; fb < 6; fb++) {
      var fba = (fb / 6) * Math.PI * 2;
      add('flywheel-bolts', cyl(0.008, 0.008, 0.02, 'x', 6), M.steel, V(1.09, CY + Math.cos(fba) * 0.05, Math.sin(fba) * 0.05));
    }
    // Head, gasket, rocker gear
    add('head-gasket', box(0.58, 0.004, 0.32), M.copper, V(1.40, DECK + 0.002, 0));
    add('cylinder-head', rbox(0.58, 0.105, 0.30, 0.02), M.grey, V(1.40, DECK + 0.057, 0));
    CYLX.forEach(function (x, i) {
      var vo = i % 2 === 0 ? 1 : -1;
      add('cylinder-head', cyl(0.024, 0.024, 0.02, 'z', 16), M.grey, V(x - 0.025 * vo, 1.04, 0.158));   // inlet port boss
      add('cylinder-head', cyl(0.024, 0.024, 0.02, 'z', 16), M.grey, V(x + 0.025 * vo, 1.0, 0.158));    // exhaust port boss
    });
    add('cylinder-head', rbox(0.08, 0.06, 0.06, 0.015), M.grey, V(1.69, 1.05, 0.04));   // thermostat outlet boss
    // 22 head set screws and nuts (SRC-035 Fig. 120): two outer rows of nine and four between the valve groups.
    for (var hn = 0; hn < 9; hn++) SIDES.forEach(function (s) { hexNut('head-studs-nuts', V(1.14 + hn * 0.065, 1.115, s * 0.12), 0.011, 'y'); });
    [1.27, 1.40, 1.53, 1.66].forEach(function (x) { hexNut('head-studs-nuts', V(x, 1.115, 0.03), 0.011, 'y'); });
    add('rocker-shaft', cyl(0.0079, 0.0079, 0.50, 'x', 12), M.steel, V(1.40, 1.13, -0.06));
    [1.17, 1.40, 1.63].forEach(function (x) { add('rocker-shaft', rbox(0.025, 0.04, 0.03, 0.006), M.greyDark, V(x, 1.115, -0.06)); });
    add('rocker-cover', rbox(0.50, 0.085, 0.22, 0.035), M.alu, V(1.40, 1.155, -0.01));
    [1.22, 1.40, 1.58].forEach(function (x) { hexNut('rocker-cover', V(x, 1.205, -0.01), 0.008, 'y'); });
    // Manifolds on the right-hand side, exhaust stack ahead of the dash (owner photo)
    add('inlet-manifold', rbox(0.48, 0.05, 0.06, 0.02), M.greyDark, V(1.40, 1.07, 0.185));
    CYLX.forEach(function (x, i) { add('exhaust-manifold', cyl(0.022, 0.022, 0.07, 'z', 14), M.core, V(x + 0.025 * (i % 2 === 0 ? 1 : -1), 1.0, 0.18)); });
    add('exhaust-manifold', cyl(0.035, 0.035, 0.46, 'x', 18), M.core, V(1.40, 0.99, 0.225));
    // The manual's outlet leaves the middle of the manifold (Fig. 110). Its standard exhaust then runs down and back
    // under the RH footplate; the owner's tractor has an upright stack through the bonnet instead (owner photo), so the
    // stack is kept and fed from the mid-manifold outlet.
    tube('exhaust-elbow', [V(1.45, 0.99, 0.24), V(1.50, 1.0, 0.265), V(1.57, 1.06, 0.25), V(1.59, 1.14, 0.235), V(1.59, 1.22, 0.235)], 0.035, M.core);
    add('silencer', lathe([[0.0, 0.0], [0.03, 0.0], [0.046, 0.03], [0.046, 0.30], [0.03, 0.33], [0.0, 0.33]], 'y', 24), M.core, V(1.59, 1.22, 0.235));
    add('silencer', cyl(0.024, 0.024, 0.22, 'y', 16), M.core, V(1.59, 1.65, 0.235));
    add('silencer', ring(0.047, 0.006, 'y', 24), M.steelDark, V(1.59, 1.26, 0.235));

    /* =====================================================================
     * FUEL SYSTEM
     * ===================================================================== */
    add('fuel-tank', rbox(0.26, 0.21, 0.46, 0.06), M.red, V(0.98, 1.055, 0));
    add('fuel-cap', cyl(0.035, 0.035, 0.025, 'y', 20), M.steel, V(0.96, 1.195, -0.07));
    add('fuel-tap', cyl(0.01, 0.01, 0.05, 'y', 10), M.brass, V(0.90, 0.93, -0.16));
    add('sediment-bowl', cyl(0.025, 0.02, 0.045, 'y', 18), M.fuelGlass, V(0.90, 0.885, -0.16));
    add('fuel-lift-pump', rbox(0.06, 0.06, 0.04, 0.012), M.greyDark, V(1.15, 0.76, -0.19));
    [0, 1].forEach(function (i) { add('fuel-filters', cyl(0.035, 0.035, 0.1, 'y', 20), M.steelDark, V(1.25 + i * 0.08, 1.0, -0.235)); });
    tube('fuel-pipes-lp', [V(0.90, 0.86, -0.16), V(1.0, 0.80, -0.20), V(1.15, 0.76, -0.215)], 0.004, M.copper);
    tube('fuel-pipes-lp', [V(1.15, 0.79, -0.21), V(1.22, 0.92, -0.24), V(1.25, 0.95, -0.235)], 0.004, M.copper);
    tube('fuel-pipes-lp', [V(1.33, 0.95, -0.235), V(1.38, 0.88, -0.25), V(1.42, 0.86, -0.25)], 0.004, M.copper);
    // DPA distributor pump on the left side (SRC-035 B.41); body and governor head
    add('injection-pump', cyl(0.06, 0.06, 0.16, 'x', 24), M.steel, V(1.48, 0.82, -0.25));
    add('injection-pump', rbox(0.08, 0.06, 0.07, 0.015), M.steel, V(1.44, 0.885, -0.25));
    add('injection-pump', cyl(0.045, 0.045, 0.05, 'x', 24), M.alu, V(1.38, 0.82, -0.25));          // hydraulic head
    [0, 1, 2, 3].forEach(function (i) { add('injection-pump', cyl(0.007, 0.007, 0.02, 'y', 8), M.brass, V(1.385 + i * 0.015, 0.875, -0.235)); });   // outlet unions
    add('injection-pump', rbox(0.05, 0.03, 0.04, 0.008), M.steel, V(1.56, 0.80, -0.27));          // stop control
    add('injection-pump', cyl(0.004, 0.004, 0.10, 'y', 8), M.steel, V(1.50, 0.94, -0.26));        // throttle lever
    CYLX.forEach(function (x, i) {
      tube('injector-pipes', [V(1.40 + i * 0.015, 0.87, -0.22), V(1.40 + i * 0.015, 0.94, -0.19), V((x + 1.40) / 2, 1.06, -0.16), V(x, 1.12, -0.10)], 0.0035, M.steel);
    });
    tube('fuel-leak-off', [V(CYLX[3], 1.13, -0.1), V(CYLX[2], 1.135, -0.1), V(CYLX[1], 1.135, -0.1), V(CYLX[0], 1.13, -0.1), V(1.62, 1.08, -0.2), V(1.35, 1.0, -0.25)], 0.003, M.copper);
    // Air intake: oil-bath cleaner beside the engine, intake stack through the bonnet (positions approximate)
    // Oil-bath cleaner stands on the left beside the gearbox-end of the engine; its intake stack
    // rises through the bonnet on the left of the dash with a pre-cleaner bowl on top (owner photo).
    add('air-cleaner', cyl(0.07, 0.07, 0.30, 'y', 24), M.greyDark, V(1.02, 0.82, -0.235));
    add('air-cleaner', cyl(0.074, 0.065, 0.06, 'y', 24), M.greyDark, V(1.02, 0.64, -0.235));
    add('air-cleaner', ring(0.071, 0.006, 'y', 24), M.steelDark, V(1.02, 0.70, -0.235));
    tube('air-intake-pipe', [V(1.02, 0.97, -0.235), V(1.06, 1.03, -0.21), V(1.14, 1.06, -0.19), V(1.20, 1.07, -0.19)], 0.03, M.black);
    add('air-intake-pipe', cyl(0.03, 0.03, 0.30, 'y', 16), M.greyDark, V(0.96, 1.21, -0.19));
    add('air-intake-pipe', lathe([[0.0, 0.0], [0.05, 0.0], [0.058, 0.03], [0.05, 0.06], [0.03, 0.075], [0.0, 0.075]], 'y', 24), M.red, V(0.96, 1.36, -0.19));   // pre-cleaner bowl

    /* =====================================================================
     * COOLING
     * ===================================================================== */
    add('radiator', box(0.07, 0.38, 0.50), M.core, V(1.885, 0.88, 0));
    add('radiator', rbox(0.10, 0.08, 0.50, 0.03), M.greyDark, V(1.885, 1.11, 0));
    add('radiator', rbox(0.10, 0.06, 0.50, 0.02), M.greyDark, V(1.885, 0.66, 0));
    add('radiator-cap', cyl(0.03, 0.03, 0.03, 'y', 20), M.steel, V(1.885, 1.165, 0));
    add('thermostat', rbox(0.06, 0.05, 0.06, 0.015), M.greyDark, V(1.70, 1.07, 0.04));
    tube('top-hose', [V(1.72, 1.07, 0.04), V(1.79, 1.08, 0.03), V(1.85, 1.09, 0.02)], 0.022, M.rubber);
    tube('bottom-hose', [V(1.85, 0.68, 0.10), V(1.80, 0.72, 0.10), V(1.76, 0.82, 0.08)], 0.024, M.rubber);
    add('water-pump', rbox(0.07, 0.12, 0.14, 0.03), M.greyDark, V(1.735, 0.90, 0.02));
    add('water-pump', cyl(0.035, 0.03, 0.05, 'x', 20), M.greyDark, V(1.775, 0.90, 0.0));         // bearing housing
    add('water-pump-pulley', cyl(0.06, 0.06, 0.025, 'x', 28), M.greyDark, V(1.79, 0.90, 0));
    for (var b = 0; b < 4; b++) {
      var bl = add('fan', box(0.006, 0.17, 0.06), M.black, V(1.815, 0.90, 0));
      bl.rotation.x = (b / 4) * Math.PI * 2;
      bl.translateY(0.1);
      bl.rotateY(0.35);
    }
    add('fan', cyl(0.03, 0.03, 0.02, 'x', 16), M.black, V(1.815, 0.90, 0));
    tube('fan-belt', [V(1.79, CY - 0.075, 0), V(1.79, CY, 0.075), V(1.79, 0.84, 0.21), V(1.79, 0.90, 0.29), V(1.79, 0.92, 0.23), V(1.79, 0.96, 0.03), V(1.79, 0.90, -0.06), V(1.79, CY, -0.075)], 0.007, M.rubber, true);
    add('coolant-heater', rbox(0.08, 0.05, 0.03, 0.01), M.brass, V(1.30, 0.70, -0.18));

    /* =====================================================================
     * CLUTCH (both versions are built; the viewer shows the one fitted)
     * ===================================================================== */
    add('clutch-housing', cyl(0.255, 0.215, 0.25, 'x', 40), M.grey, V(0.965, CY, 0));
    // Dual clutch: 11 in transmission disc and 9 in PTO/pump disc (SRC-035 I.4)
    add('clutch-dual-transmission-plate', cyl(0.14, 0.14, 0.012, 'x', 40), M.bronze, V(1.03, CY, 0));
    add('clutch-dual-pto-plate', cyl(0.114, 0.114, 0.012, 'x', 36), M.bronze, V(0.985, CY, 0));
    add('clutch-dual-cover', cyl(0.185, 0.17, 0.08, 'x', 36, true), M.steelDark, V(1.0, CY, 0));
    add('clutch-dual-cover', ring(0.13, 0.008, 'x', 32), M.steel, V(0.965, CY, 0));
    // Single clutch: 10 in disc on the diesel (SRC-035 I.1)
    add('clutch-single-plate', cyl(0.127, 0.127, 0.012, 'x', 40), M.bronze, V(1.03, CY, 0));
    add('clutch-single-cover', cyl(0.175, 0.16, 0.06, 'x', 36, true), M.steelDark, V(1.0, CY, 0));
    add('release-bearing', cyl(0.045, 0.045, 0.03, 'x', 24), M.steel, V(0.93, CY, 0));
    bar('release-fork', V(0.92, CY + 0.03, 0), V(0.90, CY - 0.15, -0.22), 0.02, 0.012, M.steelDark);
    // Pedals: clutch on the left, brakes on the right
    bar('clutch-pedal', V(0.88, 0.47, -0.27), V(0.78, 0.72, -0.31), 0.025, 0.015, M.steelDark);
    add('clutch-pedal', box(0.06, 0.012, 0.09), M.steelDark, V(0.775, 0.73, -0.32));

    /* =====================================================================
     * GEARBOX
     * ===================================================================== */
    add('gearbox-casing', rbox(0.50, 0.48, 0.36, 0.05), M.grey, V(0.59, 0.645, 0));
    add('gearbox-top-cover', rbox(0.40, 0.03, 0.30, 0.01), M.greyDark, V(0.60, 0.895, 0));
    add('input-shaft', cyl(0.02, 0.02, 0.30, 'x', 14), M.steel, V(0.90, CY, 0));
    add('main-shaft', cyl(0.025, 0.025, 0.46, 'x', 14), M.steel, V(0.58, CY, 0));
    add('countershaft', cyl(0.025, 0.025, 0.46, 'x', 14, true), M.steel, V(0.58, 0.52, 0));
    [[0.45, 0.075, 0.045], [0.56, 0.06, 0.06], [0.68, 0.045, 0.075], [0.78, 0.055, 0.065]].forEach(function (g) {
      add('gearbox-gears', cyl(g[1], g[1], 0.028, 'x', 30), M.steelDark, V(g[0], CY, 0));
      add('gearbox-gears', cyl(g[2], g[2], 0.028, 'x', 30), M.steelDark, V(g[0], 0.52, 0));
    });
    add('range-gears', cyl(0.07, 0.07, 0.03, 'x', 30), M.steelDark, V(0.37, CY, 0));
    add('range-gears', cyl(0.05, 0.05, 0.03, 'x', 30), M.steelDark, V(0.37, 0.52, 0));
    [0.50, 0.62, 0.73].forEach(function (x) { bar('selector-forks', V(x, 0.84, 0.0), V(x, CY + 0.05, 0.0), 0.03, 0.008, M.steel); });
    [0.36, 0.83].forEach(function (x) { add('gearbox-bearings', ring(0.035, 0.009, 'x', 24), M.steel, V(x, CY, 0)); add('gearbox-bearings', ring(0.035, 0.009, 'x', 24), M.steel, V(x, 0.52, 0)); });
    rod('gear-lever-main', V(0.62, 0.91, -0.04), V(0.47, 1.22, -0.13), 0.011, M.black);
    add('gear-lever-main', sphere(0.022), M.black, V(0.47, 1.225, -0.13));
    rod('gear-lever-range', V(0.55, 0.91, 0.06), V(0.50, 1.07, 0.11), 0.01, M.black);
    add('gear-lever-range', sphere(0.02), M.black, V(0.50, 1.075, 0.11));

    /* =====================================================================
     * PTO (live via the dual clutch's rear disc: SRC-035 J.4, M.3)
     * ===================================================================== */
    add('pto-drive-shaft', cyl(0.016, 0.016, 1.30, 'x', 12), M.steel, V(0.33, 0.52, 0.0));
    add('pto-gears', cyl(0.05, 0.05, 0.025, 'x', 26), M.steelDark, V(-0.10, 0.52, 0));
    add('pto-gears', cyl(0.035, 0.035, 0.025, 'x', 22), M.steelDark, V(-0.10, 0.44, 0));
    add('pto-output-shaft', cyl(0.0175, 0.0175, 0.20, 'x', 6), M.steel, V(-0.26, 0.44, 0));
    add('pto-housing', rbox(0.03, 0.12, 0.14, 0.02), M.greyDark, V(-0.215, 0.44, 0));
    add('pto-bearings', ring(0.03, 0.008, 'x', 20), M.steel, V(-0.19, 0.44, 0));
    add('pto-seals', ring(0.022, 0.005, 'x', 20), M.rubber, V(-0.235, 0.44, 0));
    var guard = add('pto-guard', new THREE.CylinderGeometry(0.075, 0.075, 0.16, 20, 1, true, -Math.PI / 2, Math.PI), M.greyDark, V(-0.30, 0.44, 0));
    guard.rotation.z = Math.PI / 2;
    add('pto-guard', rbox(0.02, 0.12, 0.16, 0.01), M.greyDark, V(-0.225, 0.50, 0));   // shield bracket on the housing
    add('pto-output-shaft', cyl(0.0175, 0.0175, 0.06, 'x', 6), M.steel, V(-0.33, 0.44, 0));   // splined end under the guard
    bar('pto-engagement', V(0.0, 0.50, -0.235), V(-0.05, 0.62, -0.26), 0.018, 0.01, M.steelDark);
    add('pto-engagement', sphere(0.016), M.black, V(-0.05, 0.625, -0.26));

    /* =====================================================================
     * HYDRAULIC LIFT (SRC-035 L.5-L.6)
     * ===================================================================== */
    // Pump in the sump between gearbox and final drive: four cylinders in two opposed valve chambers
    add('hyd-pump', rbox(0.03, 0.14, 0.24, 0.02), M.greyDark, V(0.30, 0.43, 0));
    add('hyd-pump', rbox(0.03, 0.14, 0.24, 0.02), M.greyDark, V(0.14, 0.43, 0));
    add('hyd-pump-camshaft', cyl(0.016, 0.016, 0.18, 'x', 12), M.steel, V(0.22, 0.44, 0));
    SIDES.forEach(function (s) {
      add('hyd-pump-camshaft-bearing', ring(0.018, 0.005, 'x', 16), M.steel, V(0.22 + s * 0.07, 0.44, 0));
      add('hyd-valve-chamber', rbox(0.12, 0.10, 0.04, 0.015), M.grey, V(0.22, 0.44, s * 0.095));
      add('hyd-pump-cam-blocks', rbox(0.04, 0.05, 0.04, 0.01), M.steelDark, V(0.22 + s * 0.03, 0.44, 0));
      [-0.03, 0.03].forEach(function (o) {
        add('hyd-pump-pistons', cyl(0.0115, 0.0115, 0.05, 'z', 14), M.steel, V(0.22 + o, 0.44, s * 0.05));
        add('hyd-pump-piston-rings', ring(0.0118, 0.0015, 'z', 14), M.steelDark, V(0.22 + o, 0.44, s * 0.058));
      });
    });
    add('hyd-control-valve', cyl(0.012, 0.012, 0.06, 'x', 12), M.brass, V(0.10, 0.46, 0.05));
    add('hyd-relief-valve', cyl(0.01, 0.01, 0.04, 'z', 12), M.brass, V(0.27, 0.49, 0.12));
    add('hyd-strainer', cyl(0.03, 0.03, 0.08, 'x', 16), M.steelDark, V(0.22, 0.355, 0));
    // Lift cover with ram cylinder, rockshaft and lift arms
    add('lift-cover-casting', rbox(0.50, 0.11, 0.40, 0.04), M.grey, V(0.06, 0.955, 0));
    add('lift-cover-casting', rbox(0.34, 0.06, 0.20, 0.03), M.grey, V(0.08, 1.03, 0));          // ram cylinder hump
    add('lift-cover-casting', cyl(0.045, 0.045, 0.24, 'z', 20), M.grey, V(-0.12, 0.985, 0));    // rockshaft boss across the rear
    add('lift-cover-casting', cyl(0.02, 0.02, 0.025, 'y', 16), M.black, V(0.18, 1.07, -0.12));   // hydraulic filler cap
    add('lift-cover-gasket', box(0.48, 0.004, 0.38), M.gasket, V(0.06, 0.902, 0));
    add('lift-cylinder', cyl(0.045, 0.045, 0.20, 'x', 24, true), M.steelDark, V(0.16, 0.86, 0));
    add('lift-piston', cyl(0.038, 0.038, 0.05, 'x', 24), M.steel, V(0.08, 0.86, 0));
    add('lift-piston-rings', ring(0.038, 0.003, 'x', 24), M.steelDark, V(0.09, 0.86, 0));
    rod('connecting-rod-ram', V(0.06, 0.86, 0), V(-0.10, 0.92, 0), 0.01, M.steelDark);
    add('rockshaft', cyl(0.025, 0.025, 0.56, 'z', 18), M.steel, V(-0.12, 0.985, 0));
    bar('rockshaft', V(-0.12, 0.985, 0), V(-0.10, 0.92, 0), 0.04, 0.03, M.steelDark);   // ram arm
    [-0.24, -0.10, 0.10, 0.24].forEach(function (z) { add('rockshaft-bushes', cyl(0.03, 0.03, 0.03, 'z', 16, true), M.bronze, V(-0.12, 0.985, z)); });
    SIDES.forEach(function (s) {
      add('rockshaft-seals', ring(0.027, 0.004, 'z', 16), M.rubber, V(-0.12, 0.985, s * 0.205));
      var arm = s > 0 ? 'lift-arm-rh' : 'lift-arm-lh';
      bar(arm, V(-0.12, 0.985, s * 0.26), V(-0.52, 0.96, s * 0.26), 0.055, 0.03, M.grey);
      add(arm, cyl(0.035, 0.035, 0.04, 'z', 16), M.grey, V(-0.12, 0.985, s * 0.26));
    });
    // Controls on the right of the lift cover
    var q = add('quadrant', new THREE.TorusGeometry(0.12, 0.008, 6, 20, Math.PI * 0.55), M.steelDark, V(0.10, 0.96, 0.225));
    q.rotation.z = Math.PI * 0.2;
    rod('draft-lever', V(0.10, 0.96, 0.235), V(0.0, 1.10, 0.245), 0.008, M.steelDark);
    add('draft-lever', sphere(0.015), M.black, V(0.0, 1.105, 0.245));
    rod('position-lever', V(0.10, 0.96, 0.25), V(0.04, 1.09, 0.26), 0.008, M.steelDark);
    add('position-lever', sphere(0.014), M.black, V(0.04, 1.095, 0.26));
    // Draft control: top link bracket presses on the internal control spring
    add('top-link-bracket', rbox(0.08, 0.10, 0.12, 0.02), M.grey, V(-0.22, 0.98, 0));
    SIDES.forEach(function (s) { add('top-link-bracket', rbox(0.06, 0.12, 0.012, 0.006), M.grey, V(-0.24, 1.02, s * 0.05)); });
    add('top-link-bracket', cyl(0.012, 0.012, 0.13, 'z', 12), M.steel, V(-0.25, 1.05, 0));   // top link pin
    helix('draft-control-spring', V(-0.17, 0.86, 0), 0.10, 0.03, 6, 0.006, M.steel).rotation.z = Math.PI / 2;
    add('draft-control-plunger', cyl(0.012, 0.012, 0.10, 'x', 12), M.steel, V(-0.12, 0.90, 0));
    bar('draft-control-rocker', V(-0.05, 0.90, 0.0), V(-0.02, 0.82, 0.0), 0.03, 0.012, M.steelDark);
    add('position-control-cam', cyl(0.03, 0.03, 0.015, 'z', 3), M.steelDark, V(-0.04, 0.95, 0.10));
    rod('internal-control-linkage', V(-0.04, 0.95, 0.08), V(0.10, 0.88, 0.05), 0.005, M.steel);

    /* =====================================================================
     * THREE-POINT LINKAGE (Category I)
     * ===================================================================== */
    SIDES.forEach(function (s) {
      var id = s > 0 ? 'lower-link-rh' : 'lower-link-lh';
      var front = V(0.02, 0.40, s * 0.21), back = V(-0.86, 0.40, s * 0.36);
      bar(id, front, back, 0.06, 0.022, M.greyDark);
      add('ball-ends', sphere(0.028), M.steel, back);
      add('linkage-pins', cyl(0.011, 0.011, 0.08, 'z', 12), M.steel, front);
      var mid = V(-0.42, 0.40, s * 0.287);
      var armEnd = V(-0.50, 0.96, s * 0.26);
      if (s > 0) {
        // Right-hand lift rod with levelling box
        rod('lift-rod-rh', armEnd, V(-0.48, 0.80, s * 0.27), 0.012, M.steelDark);
        add('levelling-box', rbox(0.05, 0.12, 0.05, 0.01), M.greyDark, V(-0.475, 0.74, s * 0.272));
        rod('levelling-box', V(-0.475, 0.80, s * 0.272), V(-0.42, 0.90, s * 0.33), 0.006, M.steel);
        rod('lift-rod-rh', V(-0.47, 0.68, s * 0.275), mid, 0.012, M.steelDark);
      } else {
        rod('lift-rod-lh', armEnd, mid, 0.012, M.steelDark);
      }
      // Check chains from the lower links to the axle housing
      for (var lk = 0; lk < 8; lk++) {
        var t0 = lk / 8;
        var p = V(-0.30 + t0 * 0.26, 0.42 + t0 * 0.12, s * (0.27 - t0 * 0.03));
        var link = add('check-chains', ring(0.014, 0.003, lk % 2 ? 'y' : 'x', 10), M.steel, p);
        link.rotation.z = 0.4;
      }
    });
    rod('top-link', V(-0.25, 0.99, 0), V(-0.86, 1.04, 0), 0.016, M.greyDark);
    add('top-link', cyl(0.024, 0.024, 0.14, 'x', 12), M.greyDark, V(-0.56, 1.015, 0)).rotation.z = Math.PI / 2 + 0.08;
    // Swinging drawbar: hitch bar hung from a bracket under the centre housing with two stays to the
    // axle housings, clevis and pin at the rear (79026403V kit shape, approximate)
    add('drawbar', rbox(0.70, 0.022, 0.07, 0.006), M.greyDark, V(-0.48, 0.36, 0));
    add('drawbar', rbox(0.06, 0.04, 0.09, 0.008), M.greyDark, V(-0.82, 0.37, 0));
    add('drawbar', cyl(0.012, 0.012, 0.08, 'y', 12), M.steel, V(-0.82, 0.37, 0));
    add('drawbar', rbox(0.14, 0.03, 0.12, 0.01), M.greyDark, V(-0.16, 0.36, 0));
    SIDES.forEach(function (s) { bar('drawbar', V(-0.14, 0.38, s * 0.20), V(-0.62, 0.37, s * 0.03), 0.03, 0.012, M.greyDark); });

    /* =====================================================================
     * FRONT AXLE AND STEERING
     * ===================================================================== */
    add('front-axle-beam', rbox(0.11, 0.09, 0.62, 0.02), M.greyDark, V(WB, 0.58, 0));
    add('front-axle-pivot-pin', cyl(0.02, 0.02, 0.16, 'x', 14), M.steel, V(WB, 0.60, 0));
    SIDES.forEach(function (s) {
      add('front-axle-extensions', rbox(0.09, 0.075, 0.30, 0.015), M.greyDark, V(WB, 0.58, s * 0.40));
      rod('radius-rods', V(WB - 0.02, 0.57, s * 0.42), V(1.16, 0.50, s * 0.14), 0.016, M.greyDark);
      var kz = s * (TF - 0.075);
      add('stub-axle', cyl(0.03, 0.03, 0.30, 'y', 16), M.greyDark, V(WB, 0.47, kz));
      add('stub-axle', cyl(0.02, 0.02, 0.07, 'z', 14), M.steel, V(WB, RF, s * (TF - 0.04)));
      add('kingpin-bushes', ring(0.032, 0.006, 'y', 16), M.bronze, V(WB, 0.60, kz));
      add('kingpin-bushes', ring(0.032, 0.006, 'y', 16), M.bronze, V(WB, 0.34, kz));
      add('front-hub', cyl(0.055, 0.05, 0.08, 'z', 24), M.greyDark, V(WB, RF, s * (TF + 0.02)));
      bar('steering-arms', V(WB, 0.62, kz), V(WB - 0.16, 0.63, s * (TF - 0.13)), 0.035, 0.02, M.greyDark);
      rod('drag-links', V(WB - 0.16, 0.64, s * (TF - 0.13)), V(0.86, 0.80, s * 0.24), 0.014, M.steelDark);
    });
    add('steering-box', rbox(0.16, 0.14, 0.30, 0.03), M.grey, V(0.86, 0.95, 0));
    var colA = V(0.83, 1.0, 0), colB = V(0.585, 1.315, 0);
    rod('steering-column', colA, colB, 0.022, M.greyDark);
    var colDir = new THREE.Vector3().subVectors(colB, colA).normalize();
    var sw = part('steering-wheel');
    var swG = new THREE.Group();
    swG.position.copy(colB).addScaledVector(colDir, 0.02);
    swG.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), colDir);
    sw.add(swG);
    function swMesh(geo, material, pos, rotZ) {
      var m = new THREE.Mesh(geo, material);
      if (pos) m.position.copy(pos);
      if (rotZ != null) m.rotation.y = rotZ;
      m.castShadow = true;
      swG.add(m);
      return m;
    }
    swMesh(ring(0.208, 0.017, 'y', 56), M.black);
    swMesh(cyl(0.04, 0.045, 0.04, 'y', 24), M.black, V(0, -0.01, 0));
    swMesh(cyl(0.012, 0.012, 0.012, 'y', 6), M.chrome, V(0, 0.016, 0));   // chrome nut (1870806V92)
    for (var sp = 0; sp < 3; sp++) {
      var spoke = swMesh(box(0.19, 0.01, 0.02), M.steel, null, (sp / 3) * Math.PI * 2);
      spoke.translateX(0.105);
      spoke.rotation.z = -0.12;
    }

    /* =====================================================================
     * ELECTRICAL (12 V from two 6 V batteries: SRC-035 B.42)
     * ===================================================================== */
    add('starter-motor', cyl(0.055, 0.055, 0.22, 'x', 24), M.black, V(1.0, 0.56, 0.20));
    add('starter-motor', cyl(0.045, 0.045, 0.06, 'x', 24), M.alu, V(1.125, 0.56, 0.20));          // drive end bracket
    add('starter-motor', cyl(0.03, 0.03, 0.12, 'x', 20), M.black, V(1.0, 0.62, 0.25));            // solenoid
    add('starter-motor', ring(0.055, 0.005, 'x', 24), M.steelDark, V(0.93, 0.56, 0.20));
    add('dynamo', cyl(0.06, 0.06, 0.22, 'x', 24), M.black, V(1.63, 0.86, 0.255));
    add('dynamo', cyl(0.062, 0.062, 0.03, 'x', 24), M.alu, V(1.53, 0.86, 0.255));                 // commutator end bracket
    add('dynamo', rbox(0.10, 0.012, 0.04, 0.004), M.steelDark, V(1.66, 0.92, 0.25));              // adjusting strap
    add('dynamo', cyl(0.035, 0.035, 0.02, 'x', 20), M.greyDark, V(1.79, 0.86, 0.255));
    SIDES.forEach(function (s) {
      add('battery', rbox(0.09, 0.17, 0.16, 0.01), M.battery, V(1.985, 0.78, s * 0.09));
      add('battery', cyl(0.009, 0.009, 0.02, 'y', 10), M.brass, V(1.985, 0.875, s * 0.09 + 0.04));
      add('headlamps', lathe([[0.0, 0.0], [0.05, 0.0], [0.068, 0.04], [0.072, 0.09], [0.0, 0.09]], 'x', 28), M.red, V(1.95, 1.04, s * 0.30));
      add('headlamps', ring(0.07, 0.006, 'x', 28), M.chrome, V(2.04, 1.04, s * 0.30));
      add('headlamps', cyl(0.064, 0.064, 0.008, 'x', 28), M.lens, V(2.04, 1.04, s * 0.30));
    });
    tube('battery-cables', [V(1.985, 0.88, 0.13), V(1.90, 0.62, 0.22), V(1.40, 0.56, 0.20), V(1.11, 0.56, 0.20)], 0.007, M.black);
    tube('wiring-harness', [V(0.85, 1.0, 0.18), V(1.20, 0.95, 0.20), V(1.65, 0.96, 0.22), V(1.94, 1.04, 0.27)], 0.006, M.black);
    tube('wiring-harness', [V(1.94, 1.04, 0.27), V(1.96, 1.07, 0.0), V(1.94, 1.04, -0.27)], 0.005, M.black);
    tube('wiring-harness', [V(0.80, 0.98, 0.18), V(0.40, 1.02, 0.30), V(-0.05, 1.10, 0.62)], 0.005, M.black);
    add('regulator', rbox(0.04, 0.08, 0.10, 0.01), M.black, V(0.88, 1.02, 0.17));
    add('intake-heater', cyl(0.01, 0.01, 0.06, 'z', 10), M.brass, V(1.25, 1.07, 0.23));
    add('horn', cyl(0.035, 0.02, 0.04, 'x', 18), M.black, V(1.82, 0.98, -0.22));
    add('rear-lamp', rbox(0.06, 0.06, 0.05, 0.015), M.red, V(-0.12, 1.32, 0.80));
    add('rear-lamp', cyl(0.022, 0.022, 0.006, 'x', 18), M.glass, V(-0.153, 1.32, 0.80));

    /* =====================================================================
     * BODYWORK AND OPERATOR AREA (shapes from the owner's photo and period views; not measured)
     * ===================================================================== */
    // Bonnet: one lofted shell from the dash cowl to the nose, rounded crown, tapering
    // slightly towards the front and dipping at the nose; short skirts along the sides.
    (function () {
      var secs = [];
      var xs = [0.86, 1.05, 1.25, 1.45, 1.65, 1.82, 1.93, 1.99];
      xs.forEach(function (x, i) {
        var t = (x - 0.86) / (1.99 - 0.86);
        var hw = 0.275 - 0.03 * t - (i === xs.length - 1 ? 0.02 : 0);
        var top = 1.185 - 0.06 * t * t - (i === xs.length - 1 ? 0.025 : 0);
        var bottom = 0.97 + (x > 1.6 ? 0.0 : 0.0);
        secs.push({ x: x, pts: crownSection(hw, bottom, top, 0.095 - 0.01 * t, 14) });
      });
      add('bonnet', loft(secs, false), M.red);
      // Bonnet side lips and the raised centre spine
      SIDES.forEach(function (s) { add('bonnet', box(1.12, 0.012, 0.016), M.redDark, V(1.42, 0.965, s * 0.268)); });
      add('bonnet', rbox(1.0, 0.012, 0.05, 0.004), M.red, V(1.40, 1.183, 0));
      // Hinge and catch (826870V1) at the rear corners
      SIDES.forEach(function (s) { add('bonnet', cyl(0.008, 0.008, 0.06, 'x', 10), M.steelDark, V(0.90, 1.10, s * 0.25)); });
    })();
    // Side panels (826815V91 RH / 826816V91 LH): louvred panels dropping from the bonnet
    // skirt to the front axle support, either side of the radiator.
    SIDES.forEach(function (s) {
      add('side-panels', loft([
        { x: 1.62, pts: [[0.96, s * 0.262], [0.96, s * 0.262], [0.80, s * 0.262], [0.80, s * 0.262]] },
        { x: 1.98, pts: [[0.96, s * 0.245], [0.96, s * 0.245], [0.66, s * 0.245], [0.66, s * 0.245]] }
      ].map(function (sec) { return { x: sec.x, pts: sec.pts }; }), false), M.red).material.side = THREE.DoubleSide;
      for (var lv = 0; lv < 6; lv++) add('side-panels', box(0.16, 0.006, 0.012), M.redDark, V(1.78, 0.90 - lv * 0.035, s * 0.252));
    });
    // Grille: rounded cast shield with horizontal mesh bars, badge above, lamp wings either side.
    (function () {
      var sh = new THREE.Shape();
      sh.moveTo(-0.27, 0.0); sh.lineTo(0.27, 0.0); sh.lineTo(0.27, -0.30); sh.quadraticCurveTo(0.27, -0.42, 0.15, -0.46);
      sh.lineTo(-0.15, -0.46); sh.quadraticCurveTo(-0.27, -0.42, -0.27, -0.30); sh.lineTo(-0.27, 0.0);
      var hole = new THREE.Path();
      hole.moveTo(-0.215, -0.045); hole.lineTo(0.215, -0.045); hole.lineTo(0.215, -0.30); hole.quadraticCurveTo(0.215, -0.385, 0.12, -0.415);
      hole.lineTo(-0.12, -0.415); hole.quadraticCurveTo(-0.215, -0.385, -0.215, -0.30); hole.lineTo(-0.215, -0.045);
      sh.holes.push(hole);
      var shell = new THREE.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 12 });
      shell.rotateY(Math.PI / 2);
      add('grille', shell, M.red, V(2.0, 1.14, 0));
      // Surround ring and the mesh of bars inside
      var inner = new THREE.Shape();
      inner.moveTo(-0.22, -0.05); inner.lineTo(0.22, -0.05); inner.lineTo(0.22, -0.30); inner.quadraticCurveTo(0.22, -0.39, 0.12, -0.42);
      inner.lineTo(-0.12, -0.42); inner.quadraticCurveTo(-0.22, -0.39, -0.22, -0.30); inner.lineTo(-0.22, -0.05);
      var mesh = new THREE.ExtrudeGeometry(inner, { depth: 0.01, bevelEnabled: false, curveSegments: 12 });
      mesh.rotateY(Math.PI / 2);
      add('grille', mesh, M.black, V(2.02, 1.14, 0));
      for (var gb = 0; gb < 12; gb++) {
        var gy = 1.08 - gb * 0.03;
        var hw = gy > 0.84 ? 0.21 : 0.21 - (0.84 - gy) * 0.9;
        add('grille', box(0.006, 0.008, hw * 2), M.plate, V(2.04, gy, 0));
      }
      [-0.10, 0.0, 0.10].forEach(function (z) { add('grille', box(0.006, 0.36, 0.006), M.plate, V(2.041, 0.91, z)); });
      // Lamp wings each side of the grille
      SIDES.forEach(function (s) { add('grille', lathe([[0.0, 0.0], [0.085, 0.0], [0.09, 0.03], [0.07, 0.10], [0.0, 0.10]], 'x', 28), M.red, V(1.93, 1.04, s * 0.30)); });
    })();
    // Front badge: the triple-triangle emblem on a plate (187990V1)
    add('front-badge', cyl(0.045, 0.045, 0.006, 'x', 32), M.badge, V(2.072, 1.10, 0));
    [[0, 0.016], [-0.016, -0.012], [0.016, -0.012]].forEach(function (o) { add('front-badge', cyl(0.012, 0.012, 0.004, 'x', 3), M.badgeRed, V(2.077, 1.10 + o[1], o[0])).rotation.x = Math.PI / 2; });
    // "Massey Ferguson 35" side name plates on the bonnet
    SIDES.forEach(function (s) { add('front-badge', rbox(0.26, 0.03, 0.005, 0.004), M.badge, V(1.30, 1.09, s * 0.272)); });

    // Dash cowl and instrument panel: a sloping panel between the bonnet rear and the
    // steering column, carrying the gauges, key switch and the serial plate below.
    (function () {
      var cowl = loft([
        { x: 0.86, pts: crownSection(0.275, 0.95, 1.185, 0.09, 14) },
        { x: 0.80, pts: crownSection(0.265, 0.95, 1.12, 0.08, 14) }
      ], false);
      add('dashboard', cowl, M.red).material.side = THREE.DoubleSide;
      var panel = add('dashboard', rbox(0.03, 0.24, 0.50, 0.03), M.black, V(0.815, 1.02, 0));
      panel.rotation.z = 0.35;
      add('dashboard', rbox(0.08, 0.10, 0.46, 0.02), M.grey, V(0.84, 0.90, 0));   // cast support over the steering box
    })();
    add('serial-plate', box(0.004, 0.035, 0.075), M.plate, V(0.796, 0.955, 0.13));
    add('starter-switch', cyl(0.012, 0.012, 0.02, 'x', 12), M.chrome, V(0.805, 0.96, -0.13));
    add('starter-switch', cyl(0.004, 0.004, 0.03, 'x', 8), M.steel, V(0.79, 0.96, -0.13));
    // Gauges: chrome bezels, black faces, pointers (ammeter, water temperature, oil pressure, tractormeter)
    function gauge(id, pos, r, nrm) {
      var g = part(id);
      var grp = new THREE.Group();
      grp.position.copy(pos);
      grp.rotation.z = 0.35;
      g.add(grp);
      function gm(geo, material, p) { var m = new THREE.Mesh(geo, material); if (p) m.position.copy(p); m.castShadow = true; grp.add(m); return m; }
      gm(cyl(r + 0.004, r + 0.004, 0.012, 'x', 32), M.chrome);
      gm(cyl(r, r, 0.004, 'x', 32), M.gaugeFace, V(-0.008, 0, 0));
      gm(ring(r + 0.001, 0.0025, 'x', 32), M.chrome, V(-0.01, 0, 0));
      var ptr = gm(box(0.002, r * 0.75, 0.004), M.gauge, V(-0.011, r * 0.25, 0));
      ptr.rotation.x = -0.6;
      return grp;
    }
    gauge('ammeter', V(0.822, 1.085, 0.16), 0.026);
    gauge('temp-gauge', V(0.822, 1.085, -0.16), 0.026);
    gauge('oil-pressure-gauge', V(0.836, 1.125, -0.07), 0.026);
    gauge('tractormeter', V(0.836, 1.125, 0.07), 0.036);

    // Mudguards: clamshell type, a crowned sheet over the wheel with a flat inner skirt and
    // a rolled outer edge, carried on a bracket from the axle housing.
    SIDES.forEach(function (s) {
      var a0 = 0.12, a1 = Math.PI - 0.22;
      var secs = [];
      var N = 36;
      for (var i = 0; i <= N; i++) {
        var a = a0 + (a1 - a0) * (i / N);
        var ca = Math.cos(a), sa = Math.sin(a);
        var pts = [];
        // cross-section across the fender width: inner edge, crown, outer rolled lip
        var prof = [[-0.0, 0.69], [0.02, 0.715], [0.10, 0.725], [0.20, 0.725], [0.28, 0.715], [0.32, 0.70], [0.335, 0.68], [0.335, 0.665]];
        prof.forEach(function (q) {
          var rr = q[1];
          pts.push([RR + sa * rr, s * (TR - 0.17 + q[0])]);
        });
        secs.push({ x: ca * 0.715, pts: pts });
      }
      // loft expects sections ordered along x; here they are ordered along the arc, which works the same way
      var sheet = loft(secs.map(function (sec) { return { x: sec.x, pts: sec.pts }; }), false);
      var mg = add('mudguards', sheet, M.red);
      mg.material.side = THREE.DoubleSide;
      // Inner skirt (flat wall towards the driver) and rolled front edge
      var wall = new THREE.Shape();
      wall.absarc(0, 0, 0.705, a0, a1, false);
      wall.absarc(0, 0, 0.50, a1, a0, true);
      add('mudguards', new THREE.ExtrudeGeometry(wall, { depth: 0.01, bevelEnabled: false, curveSegments: 40 }), M.red, V(0, RR, s * (TR - 0.175)));
      // Bracket to the axle housing and the front stay
      bar('mudguards', V(0.05, RR + 0.24, s * 0.47), V(0.05, RR + 0.62, s * (TR - 0.12)), 0.05, 0.012, M.grey);
      bar('mudguards', V(0.52, RR + 0.02, s * 0.44), V(0.56, RR + 0.30, s * (TR - 0.12)), 0.03, 0.01, M.grey);
    });

    // Seat: De Luxe cushion seat on a sprung pan, with the coil spring under it (825608V1)
    bar('seat-support', V(-0.08, 0.98, 0), V(-0.30, 1.04, 0), 0.06, 0.012, M.steelDark);
    helix('seat-support', V(-0.34, 1.045, 0), 0.07, 0.045, 4, 0.006, M.steelDark);
    add('seat-support', rbox(0.30, 0.012, 0.36, 0.02), M.steelDark, V(-0.36, 1.115, 0));
    add('seat', rbox(0.34, 0.07, 0.40, 0.035), M.seat, V(-0.36, 1.16, 0));
    add('seat', rbox(0.055, 0.22, 0.38, 0.03), M.seat, V(-0.545, 1.29, 0)).rotation.z = -0.22;
    SIDES.forEach(function (s) { rod('seat-support', V(-0.50, 1.12, s * 0.17), V(-0.54, 1.22, s * 0.17), 0.008, M.steelDark); });

    // Footplates (chequer plate) either side of the gearbox with the step, and the pedals
    SIDES.forEach(function (s) {
      var fp = add('footplates', box(0.66, 0.01, 0.26), M.greyDark, V(0.52, 0.56, s * 0.37));
      for (var cp = 0; cp < 5; cp++) for (var cq = 0; cq < 3; cq++) add('footplates', box(0.03, 0.003, 0.012), M.greyDark, V(0.26 + cp * 0.13, 0.567, s * (0.27 + cq * 0.10))).rotation.y = 0.6;
      add('footplates', box(0.30, 0.008, 0.14), M.greyDark, V(0.58, 0.40, s * 0.50));   // step
      bar('footplates', V(0.58, 0.40, s * 0.44), V(0.58, 0.56, s * 0.44), 0.06, 0.008, M.greyDark);
    });
    // Brake pedals and linkage (SRC-035 P.1-P.2, Fig. 2). Both pedals sit on the right of the transmission
    // housing and pivot on the combined brake cross shaft, which runs across under the front of the
    // transmission beside the radius rod ball cap. The left-wheel pedal is keyed to the cross shaft; the
    // combined brake arm on the shaft's left end works the left brake. The right-wheel pedal turns freely on
    // the shaft and works the right brake through its own lever. A rod and yoke from each arm runs back to
    // the rear brake lever on that wheel's backplate.
    var XS = 1.10, YS = 0.42, BZ_ROD = 0.548 - 0.05;                          // cross shaft
    rod('brake-linkage', V(XS, YS, -0.33), V(XS, YS, 0.37), 0.014, M.steel);
    add('parking-brake', rbox(0.10, 0.05, 0.01, 0.01), M.steelDark, V(XS - 0.04, YS + 0.05, 0.17));   // parking brake sector
    [0.29, 0.345].forEach(function (z, i) {
      add('brake-pedals', cyl(0.028, 0.028, 0.045, 'z', 16), M.steelDark, V(XS, YS, z));             // boss on the cross shaft
      // Arm: back from the boss under the footplate, then up through it to the pad
      bar('brake-pedals', V(XS, YS, z), V(0.84, 0.46, z), 0.03, 0.016, M.steelDark);
      bar('brake-pedals', V(0.84, 0.46, z), V(0.79, 0.70, z), 0.026, 0.016, M.steelDark);
      add('brake-pedals', rbox(0.075, 0.014, 0.05, 0.006), M.steelDark, V(0.78, 0.715, z));         // pad
      if (i === 1) {
        bar('brake-pedals', V(XS, YS, z + 0.03), V(XS + 0.01, YS - 0.11, z + 0.03), 0.03, 0.014, M.steelDark);   // right pedal's own lever
      }
    });
    add('parking-brake', box(0.012, 0.06, 0.012), M.steelDark, V(0.80, 0.62, 0.275));                // latch on the left-wheel pedal
    add('brake-pedals', box(0.02, 0.012, 0.06), M.steel, V(0.785, 0.70, 0.318));                      // combined brake lock
    bar('brake-linkage', V(XS, YS, -0.31), V(XS + 0.01, YS - 0.11, -0.31), 0.03, 0.014, M.steelDark); // combined brake arm (LH)
    SIDES.forEach(function (s) {
      var zArm = s > 0 ? 0.375 : -0.31;
      rod('brake-linkage', V(XS + 0.01, YS - 0.11, zArm), V(0.13, RR - 0.21, s * (BZ_ROD)), 0.008, M.steel);
    });
    // Front weights: removable, not fitted in the default model
    add('front-weights', rbox(0.06, 0.18, 0.40, 0.02), M.greyDark, V(2.14, 0.66, 0));

    return { root: rootGroup, parts: parts, casings: CASINGS.slice(), dims: DIM, removableHidden: ['front-weights'], explode: EXPLODE, explodeAxis: EXPLODE_AXIS };
  }

  return { build: build, DIM: DIM, CASINGS: CASINGS, EXPLODE: EXPLODE };
});
