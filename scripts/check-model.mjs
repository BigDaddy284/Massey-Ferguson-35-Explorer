// Connectivity check for the 3D model: every rod, bar and pipe must end on (or inside) another part,
// so nothing is drawn "going to nothing". Run: node scripts/check-model.mjs [--json]
// A loose end is one whose endpoint is farther than TOL from every other mesh's bounding box
// (other meshes of the same part count too: a lever may end on its own boss).
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THREE = require(path.join(root, 'app/vendor/three/three.min.js'));
const model = require(path.join(root, 'app/js/model.js'));
const TOL = 0.012;
const built = model.build(THREE);
built.root.updateMatrixWorld(true);
const meshes = [];
built.root.traverse((o) => { if (o.isMesh) meshes.push(o); });
const boxes = meshes.map((m) => ({ m, box: new THREE.Box3().setFromObject(m) }));
const loose = [];
let checked = 0;
for (const { m } of boxes) {
  const ends = m.userData.ends;
  if (!ends) continue;
  for (const [i, e] of ends.entries()) {
    checked++;
    const p = m.parent.localToWorld(e.clone());
    let best = Infinity, near = null;
    for (const o of boxes) {
      if (o.m === m) continue;
      const d = o.box.distanceToPoint(p);
      if (d < best) { best = d; near = o.m; }
    }
    if (best > TOL) loose.push({ part: m.parent.name, end: i, at: [p.x, p.y, p.z].map((v) => +v.toFixed(3)), gap: +best.toFixed(3), nearest: near && near.parent.name });
  }
}
if (process.argv.includes('--json')) console.log(JSON.stringify({ checked, loose }, null, 1));
else {
  console.log(`${checked} rod/pipe ends checked, ${loose.length} loose`);
  for (const l of loose) console.log(`  ${l.part} end ${l.end} at (${l.at.join(', ')}) is ${l.gap} m from anything (nearest ${l.nearest})`);
}
process.exitCode = loose.length ? 1 : 0;
