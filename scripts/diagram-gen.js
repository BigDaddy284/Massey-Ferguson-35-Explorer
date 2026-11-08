/* MF35 Explorer: exploded line-diagram generator (Phase 6).
 * Runs inside the browser (classic script) against the live viewer. It projects every mesh of an
 * exploded assembly with an orthographic camera and emits an original SVG line drawing: one
 * silhouette fill per mesh in painter's order, crease lines where faces meet at a sharp angle, and
 * numbered callouts in the margins that match the 3D exploded view's numbering (explodeRefs).
 * Driven by scripts/build-diagrams.mjs; the output is committed as app/data/mf35-diagrams.js.
 */
(function () {
  'use strict';
  function gen(viewer, opts) {
    var THREE = viewer.THREE, index = viewer.index, st = viewer.state;
    var scope = opts.scope, depth = opts.depth;
    var dir = new THREE.Vector3(opts.view[0], opts.view[1], opts.view[2]).normalize(); // scene -> camera
    var up0 = new THREE.Vector3(0, 1, 0);
    var right = new THREE.Vector3().crossVectors(up0, dir).normalize();
    var up = new THREE.Vector3().crossVectors(dir, right).normalize();
    var light = new THREE.Vector3(opts.light ? opts.light[0] : 0.35, opts.light ? opts.light[1] : 1, opts.light ? opts.light[2] : 0.55).normalize();
    var CREASE = Math.cos((opts.crease || 32) * Math.PI / 180);

    viewer.setExplode({ scope: scope, depth: depth, t: 1 }, false);
    // Finish the (1 ms) tween now rather than waiting for the render loop.
    if (viewer.explode.tween) { viewer.explode.tween = null; viewer.explode.t = 1; viewer._setExplodeOffsets(1); viewer._afterExplode(); }
    viewer.model.root.updateMatrixWorld(true);

    var meshes = [];
    (viewer.partsUnder[scope] || []).forEach(function (p) {
      if (!st.fitted(p) || st.hidden[p]) return;
      (viewer.meshesByPart[p] || []).forEach(function (m) { if (m.visible !== false) meshes.push(m); });
    });

    var v = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
    var drawn = [];
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    meshes.forEach(function (m) {
      var g = m.geometry;
      var pos = g.attributes.position;
      if (!pos) return;
      var mw = m.matrixWorld;
      // Project and weld vertices by rounded screen position.
      var ids = new Int32Array(pos.count), pts = [], keys = {};
      var sx = 0, sy = 0, sd = 0;
      for (var i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mw);
        var x = v.dot(right), y = v.dot(up), d = v.dot(dir);
        var key = Math.round(x * 2000) + ',' + Math.round(y * 2000) + ',' + Math.round(d * 2000);
        var id = keys[key];
        if (id === undefined) { id = pts.length; keys[key] = id; pts.push([x, y, d]); }
        ids[i] = id;
      }
      var idx = g.index ? g.index.array : null;
      var triCount = idx ? idx.length / 3 : pos.count / 3;
      var edges = {}, front = 0, back = 0, nx = 0, ny = 0, nz = 0, area = 0;
      function edge(p, q, isFront, normal) {
        var k = p < q ? p + '_' + q : q + '_' + p;
        var e = edges[k] || (edges[k] = { p: p, q: q, f: 0, b: 0, n: [] });
        if (isFront) { e.f++; e.n.push(normal); } else e.b++;
      }
      for (var t = 0; t < triCount; t++) {
        var i0 = idx ? idx[t * 3] : t * 3, i1 = idx ? idx[t * 3 + 1] : t * 3 + 1, i2 = idx ? idx[t * 3 + 2] : t * 3 + 2;
        a.fromBufferAttribute(pos, i0).applyMatrix4(mw);
        b.fromBufferAttribute(pos, i1).applyMatrix4(mw);
        c.fromBufferAttribute(pos, i2).applyMatrix4(mw);
        b.sub(a); c.sub(a); n.crossVectors(b, c);
        var len = n.length();
        if (len < 1e-12) continue;
        n.multiplyScalar(1 / len);
        var isFront = n.dot(dir) > 0;
        var p0 = ids[i0], p1 = ids[i1], p2 = ids[i2];
        if (p0 === p1 || p1 === p2 || p0 === p2) continue;
        var normal = isFront ? [n.x, n.y, n.z] : null;
        if (isFront) { front++; nx += n.x * len; ny += n.y * len; nz += n.z * len; area += len; } else back++;
        edge(p0, p1, isFront, normal); edge(p1, p2, isFront, normal); edge(p2, p0, isFront, normal);
      }
      if (!front) return;
      // Silhouette: front/back boundary or a front-facing open edge. Crease: two front faces at a sharp angle.
      var sil = [], crease = [];
      Object.keys(edges).forEach(function (k) {
        var e = edges[k];
        if (e.f === 1 && (e.b >= 1 || e.f + e.b === 1)) sil.push(e);
        else if (e.f === 2 && e.b === 0) {
          var n0 = e.n[0], n1 = e.n[1];
          if (n0[0] * n1[0] + n0[1] * n1[1] + n0[2] * n1[2] < CREASE) crease.push(e);
        }
      });
      // Chain silhouette edges into loops.
      var adj = {};
      sil.forEach(function (e, i) { (adj[e.p] = adj[e.p] || []).push(i); (adj[e.q] = adj[e.q] || []).push(i); });
      var used = new Uint8Array(sil.length), loops = [];
      for (var s = 0; s < sil.length; s++) {
        if (used[s]) continue;
        used[s] = 1;
        var loop = [sil[s].p, sil[s].q], cur = sil[s].q, start = sil[s].p, guard = 0;
        while (cur !== start && guard++ < 20000) {
          var nxt = -1, list = adj[cur] || [];
          for (var j = 0; j < list.length; j++) if (!used[list[j]]) { nxt = list[j]; break; }
          if (nxt < 0) break;
          used[nxt] = 1;
          cur = sil[nxt].p === cur ? sil[nxt].q : sil[nxt].p;
          loop.push(cur);
        }
        if (loop.length >= 3) loops.push(loop);
      }
      // Depth for painter's order: mean of the front-facing vertex depths, nudged by the nearest point
      // so small parts sitting on a big one draw after it.
      var depthSum = 0, depthN = 0, near = -Infinity;
      sil.forEach(function (e) { depthSum += pts[e.p][2] + pts[e.q][2]; depthN += 2; near = Math.max(near, pts[e.p][2], pts[e.q][2]); });
      var zMean = depthN ? depthSum / depthN : 0;
      var shade = Math.max(0, (nx * light.x + ny * light.y + nz * light.z) / (area || 1));
      loops.forEach(function (lp) { lp.forEach(function (pi) { var p = pts[pi]; if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0]; if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1]; }); });
      // A casing that stays in place over the exploded parts is drawn see-through, as in the 3D view.
      var ghost = !!m.userData.casing && m.userData.off.lengthSq() < 0.01 && scope !== m.userData.partId;
      drawn.push({ part: m.userData.partId, pts: pts, loops: loops, crease: crease, z: zMean * 0.7 + near * 0.3, shade: shade, ghost: ghost });
    });
    drawn.sort(function (p, q) { return p.z - q.z; });

    // Layout: drawing scaled to W wide, labels in the margins.
    var W = 1400, ML = 150, MR = 150, MT = 50, MB = 50;
    var spanX = Math.max(1e-6, maxX - minX), spanY = Math.max(1e-6, maxY - minY);
    var k = W / spanX;
    var H = Math.round(spanY * k);
    var totalW = W + ML + MR, totalH = H + MT + MB;
    function X(x) { return ((x - minX) * k + ML); }
    function Y(y) { return ((maxY - y) * k + MT); }
    function f(z) { return Math.round(z).toString(); }
    function tone(s) { var l = Math.round(232 - 46 * (1 - Math.min(1, s * 1.1))); var l2 = Math.min(255, l + 6); return 'rgb(' + l + ',' + l2 + ',' + Math.min(255, l2 + 4) + ')'; }

    var partBox = {}, partPts = {};
    var body = drawn.map(function (dm) {
      var d = '';
      var samples = partPts[dm.part] || (partPts[dm.part] = []);
      dm.loops.forEach(function (lp) {
        var lx0 = Infinity, ly0 = Infinity, lx1 = -Infinity, ly1 = -Infinity, seg = '', last = null;
        for (var i = 0; i < lp.length; i++) {
          var p = dm.pts[lp[i]];
          var px = X(p[0]), py = Y(p[1]);
          if (last && Math.abs(px - last[0]) < 0.6 && Math.abs(py - last[1]) < 0.6) continue;
          seg += (last ? 'L' : 'M') + f(px) + ' ' + f(py);
          last = [px, py];
          if (px < lx0) lx0 = px; if (py < ly0) ly0 = py; if (px > lx1) lx1 = px; if (py > ly1) ly1 = py;
          if (i % 4 === 0) samples.push([px, py, dm.z]);
        }
        if (!last || (lx1 - lx0 < 1.5 && ly1 - ly0 < 1.5)) return;
        d += seg + 'Z';
        var bx = partBox[dm.part] || (partBox[dm.part] = [Infinity, Infinity, -Infinity, -Infinity]);
        if (lx0 < bx[0]) bx[0] = lx0; if (ly0 < bx[1]) bx[1] = ly0; if (lx1 > bx[2]) bx[2] = lx1; if (ly1 > bx[3]) bx[3] = ly1;
      });
      var cd = '';
      dm.crease.forEach(function (e) {
        var p = dm.pts[e.p], q = dm.pts[e.q];
        var x0 = X(p[0]), y0 = Y(p[1]), x1 = X(q[0]), y1 = Y(q[1]);
        if (Math.abs(x1 - x0) < 1 && Math.abs(y1 - y0) < 1) return;
        cd += 'M' + f(x0) + ' ' + f(y0) + 'L' + f(x1) + ' ' + f(y1);
      });
      if (!d) return '';
      if (dm.ghost) return '<g class="ghost" data-id="' + dm.part + '"><path d="' + d + '" fill="none"/></g>';
      return '<g data-id="' + dm.part + '"><path d="' + d + '" fill="' + tone(dm.shade) + '"/>' + (cd ? '<path class="c" d="' + cd + '"/>' : '') + '</g>';
    }).join('');

    // Callouts: numbering follows the 3D exploded view.
    var refs = viewer.explodeRefs(scope, depth);
    var items = [];
    refs.forEach(function (id, i) {
      var bx = [Infinity, Infinity, -Infinity, -Infinity], any = false;
      (viewer.partsUnder[id] || []).forEach(function (p) {
        var pb = partBox[p]; if (!pb) return; any = true;
        bx[0] = Math.min(bx[0], pb[0]); bx[1] = Math.min(bx[1], pb[1]); bx[2] = Math.max(bx[2], pb[2]); bx[3] = Math.max(bx[3], pb[3]);
      });
      if (!any) return;
      // Aim the leader at the mesh nearest the camera (so it lands on a visible face), at the point
      // of that mesh closest to the group's centre.
      var cxg = (bx[0] + bx[2]) / 2, cyg = (bx[1] + bx[3]) / 2, best = null, bd = Infinity, topZ = -Infinity;
      (viewer.partsUnder[id] || []).forEach(function (p) { (partPts[p] || []).forEach(function (pt) { if (pt[2] > topZ) topZ = pt[2]; }); });
      (viewer.partsUnder[id] || []).forEach(function (p) {
        (partPts[p] || []).forEach(function (pt) { if (pt[2] < topZ - 1e-9) return; var dd = (pt[0] - cxg) * (pt[0] - cxg) + (pt[1] - cyg) * (pt[1] - cyg); if (dd < bd) { bd = dd; best = pt; } });
      });
      items.push({ n: i + 1, id: id, x: best ? best[0] : cxg, y: best ? best[1] : cyg, box: bx });
    });
    // Labels: left column for parts left of centre, right column otherwise; spread to avoid overlap.
    var cx = ML + W / 2, left = [], rightCol = [];
    items.forEach(function (it) { (it.x < cx ? left : rightCol).push(it); });
    function spread(col, lx) {
      col.sort(function (p, q) { return p.y - q.y; });
      var GAP = 42, ys = col.map(function (it) { return it.y; });
      for (var i = 1; i < ys.length; i++) if (ys[i] < ys[i - 1] + GAP) ys[i] = ys[i - 1] + GAP;
      var over = ys.length ? ys[ys.length - 1] - (totalH - MB) : 0;
      if (over > 0) { for (var j = ys.length - 1; j >= 0; j--) { ys[j] -= over; if (j > 0 && ys[j - 1] + GAP > ys[j]) over = ys[j - 1] + GAP - ys[j]; else break; } }
      col.forEach(function (it, i) { it.lx = lx; it.ly = Math.max(MT, ys[i]); });
    }
    spread(left, ML - 60); spread(rightCol, ML + W + 60);
    var callouts = items.map(function (it) {
      // Leader from the label to the edge of the part's box nearest the label.
      var ex = Math.max(it.box[0], Math.min(it.box[2], it.lx)), ey = Math.max(it.box[1], Math.min(it.box[3], it.ly));
      var tx = it.x, ty = it.y;
      // stop the leader at the box edge towards the label
      var dx = it.lx - tx, dy = it.ly - ty, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var ax2 = tx, ay2 = ty;
      void ex; void ey;
      return '<g class="dg-callout" data-id="' + it.id + '" data-n="' + it.n + '"><line x1="' + f(it.lx) + '" y1="' + f(it.ly) + '" x2="' + f(ax2) + '" y2="' + f(ay2) + '"/><circle class="tip" cx="' + f(ax2) + '" cy="' + f(ay2) + '" r="2.6"/>' +
        '<circle class="num" cx="' + f(it.lx) + '" cy="' + f(it.ly) + '" r="19"/><text x="' + f(it.lx) + '" y="' + f(it.ly + 7) + '" text-anchor="middle">' + it.n + '</text></g>';
    }).join('');

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="diagram" viewBox="0 0 ' + totalW + ' ' + totalH + '" role="img">' +
      '<g class="parts">' + body + '</g><g class="dg-callouts">' + callouts + '</g></svg>';
    return {
      scope: scope, depth: depth, view: opts.view, viewBox: [totalW, totalH], svg: svg,
      items: items.map(function (it) { return { n: it.n, id: it.id, x: Math.round(it.x), y: Math.round(it.y) }; }),
      meshes: drawn.length, loops: drawn.reduce(function (s, dm) { return s + dm.loops.length; }, 0)
    };
  }
  window.MF35DiagramGen = { gen: gen };
})();
