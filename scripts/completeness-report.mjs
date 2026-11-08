// Phase 8: completeness report (spec §16). Reads data/*.json, the 3D model and the drawn diagrams,
// audits them and writes docs/research/08-completeness-report.md. Run: npm run report
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));
const core = require('../app/js/core.js');
const THREE = require('../app/vendor/three/three.min.js');
const model = require('../app/js/model.js');

const hierarchy = read('hierarchy.json');
const sources = read('sources.json').sources;
const suppliers = read('suppliers.json');
const config = read('configurations.json');
const diagramsSrc = fs.readFileSync(path.join(ROOT, 'app', 'data', 'mf35-diagrams.js'), 'utf8');
const diagrams = JSON.parse(diagramsSrc.slice(diagramsSrc.indexOf('{')).replace(/;\s*$/, ''));

const index = core.indexHierarchy(hierarchy.root);
const built = model.build(THREE);
built.root.updateMatrixWorld(true);
const modelledIds = Object.keys(built.parts);
const cov = core.coverage(index, modelledIds, diagrams.diagrams, suppliers);
const supByNode = core.supplierRefsByNode(suppliers);
const systems = index.byId[index.rootId].childIds;
const nameOf = (id) => index.byId[id].node.name;
const components = index.order.filter((id) => index.byId[id].node.kind === 'component');

// ---- totals
const tot = {};
for (const s of systems) for (const [k, v] of Object.entries(cov[s])) tot[k] = (tot[k] ?? 0) + v;
const FASTENER_RE = /stud|bolt|nut|pin\b|pins\b|washer|circlip|seal|gasket|o-ring|clip|spring|bush|bearing|shim|spacer|union|dowel|plug|collet/i;
const fastenerIds = components.filter((id) => FASTENER_RE.test(nameOf(id)));
const fastenerRefs = fastenerIds.filter((id) => (index.byId[id].node.partsBookReferences ?? []).length);
let bookRefs = 0, bookListed = 0, bookHeritage = 0, bookIn819045 = 0, mf35Refs = 0, mf35Primary = 0, mf35Cond = 0;
index.order.forEach((id) => (index.byId[id].node.partsBookReferences ?? []).forEach((r) => {
  if (r.book === 'MF35') { mf35Refs++; if (r.primary) mf35Primary++; if (r.condition) mf35Cond++; return; }
  bookRefs++; if (r.confidence === 'listed') bookListed++; if (r.heritage) bookHeritage++; if (r.inBook819045) bookIn819045++;
}));
const mf35Nodes = index.order.filter((id) => (index.byId[id].node.partsBookReferences ?? []).some((r) => r.book === 'MF35'));
const unsettled = components.filter((id) => { const n = index.byId[id].node; return !n.oemPartNumber && (n.partsBookReferences ?? []).some((r) => r.book === 'MF35'); });
const noMf35 = components.filter((id) => !(index.byId[id].node.partsBookReferences ?? []).some((r) => r.book === 'MF35'));

// ---- missing items
const notModelled = index.order.filter((id) => id !== index.rootId && index.byId[id].node.kind === 'component' && !built.parts[id]);
const noNumber = components.filter((id) => { const n = index.byId[id].node; return !n.oemPartNumber && !(n.partsBookReferences ?? []).length && !(n.replacementReferences ?? []).length; });
const noSupplier = components.filter((id) => !(supByNode[id] ?? []).length);
const noDescription = index.order.filter((id) => id !== index.rootId && !(index.byId[id].node.description && index.byId[id].node.function));
const assemblies = index.order.filter((id) => ['assembly', 'subassembly', 'system'].includes(index.byId[id].node.kind));
const diagramList = Array.isArray(diagrams.diagrams) ? diagrams.diagrams : Object.values(diagrams.diagrams);
const diagramScopes = new Set(diagramList.map((d) => d.scope));
const assembliesNoDiagram = assemblies.filter((id) => !diagramScopes.has(id));
// Spec §5.3 list of exploded views and the hierarchy id that covers each
const SPEC_DIAGRAMS = [['Complete engine', 'engine'], ['Cylinder head', 'cylinder-head-assy'], ['Cylinder block', 'engine-block-assy'], ['Crankshaft assembly', 'crank-assy'], ['Piston and connecting rod assembly', 'crank-assy'], ['Fuel injection system', 'fuel-injection'], ['Cooling system', 'cooling'], ['Clutch', 'clutch'], ['Gearbox', 'transmission'], ['Differential', 'differential'], ['Rear axle', 'rear-axle'], ['Hydraulic lift', 'lift-cover'], ['Hydraulic pump', 'hyd-pump'], ['PTO', 'pto'], ['Front axle', 'front-axle'], ['Steering', 'front-axle'], ['Braking system', 'brakes']];

// ---- hierarchy link audit
let oneWay = 0, relatedTotal = 0;
index.order.forEach((id) => (index.byId[id].node.related ?? []).forEach((r) => { relatedTotal++; if (!(index.byId[r].node.related ?? []).includes(id)) oneWay++; }));

// ---- variant audit
const axes = Object.fromEntries(config.variantAxes.map((a) => [a.id, a]));
const variantUse = {};
index.order.forEach((id) => { for (const [axis, opts] of Object.entries(index.byId[id].node.appliesTo ?? {})) for (const o of opts) (variantUse[axis] ??= {})[o] = ((variantUse[axis] ?? {})[o] ?? 0) + 1; });
const variantRows = Object.entries(axes).map(([axis, a]) => {
  const opts = (a.options ?? []).map((o) => `${o.id}: ${(variantUse[axis] ?? {})[o.id] ?? 0}`).join(', ');
  const target = config.ownerTractor?.[axis] ?? null;
  return `| ${axis} | ${a.label ?? axis} | ${opts || 'no node restricted by this axis'} | ${target === null ? 'unknown (default ' + (config.defaultTarget[axis] ?? '–') + ')' : target} |`;
});

// ---- 3D placement audit (metres: x forward from the rear axle, y up, z right)
const centres = {};
for (const id of modelledIds) { const box = new THREE.Box3().setFromObject(built.parts[id]); if (!box.isEmpty()) centres[id] = box.getCenter(new THREE.Vector3()); }
const rootBox = new THREE.Box3().setFromObject(built.root);
const size = rootBox.getSize(new THREE.Vector3());
// Expected regions from the workshop manual layout (SRC-035 B.1): rear axle at x=0, wheelbase 1.829 m.
const REGION = { engine: [0.6, 1.95], fuel: [0.85, 1.6], cooling: [1.2, 2.0], clutch: [0.75, 1.1], transmission: [0.3, 0.95], 'rear-axle': [-0.15, 0.85], pto: [-0.35, 0.95], hydraulics: [-0.35, 0.35], linkage: [-0.95, 0.1], 'front-axle': [0.5, 1.95] };
const placementFlags = [];
for (const id of modelledIds) {
  const e = index.byId[id]; if (!e || !centres[id]) continue;
  const r = REGION[e.path[1]]; if (!r) continue;
  if (centres[id].x < r[0] - 0.05 || centres[id].x > r[1] + 0.05) placementFlags.push(`${id} (${e.path[1]}) centre x=${centres[id].x.toFixed(2)} m, expected ${r[0]}–${r[1]}`);
}
const frontAxleX = centres['front-hub']?.x;   // wheel centres (the centre beam is swept forward of them)

// ---- supplier links
const supplierRows = suppliers.suppliers.map((s) => { const rs = suppliers.references.filter((r) => r.supplier === s.id); const by = {}; rs.forEach((r) => by[r.match] = (by[r.match] ?? 0) + 1); return `| ${s.name} | ${rs.length} | ${by['exact'] ?? 0} | ${by['agco-ref'] ?? 0} | ${by['book-ref'] ?? 0} | ${by['listed-fit'] ?? 0} | ${by['check-fit'] ?? 0} | ${rs.map((r) => r.checked).sort().pop()} |`; });

// ---- report
const pct = (n, d) => d ? `${n} (${Math.round(100 * n / d)}%)` : `${n}`;
const list = (ids) => ids.map((id) => `\`${id}\``).join(', ');
const today = new Date().toISOString().slice(0, 10);
const lines = [];
lines.push('# 08 – Completeness report (Phase 8, updated after reading parts book 819045)', '', `Generated ${today} by \`npm run report\` (\`scripts/completeness-report.mjs\`) from \`data/*.json\`, \`app/js/model.js\` and \`app/data/mf35-diagrams.js\`. Spec §16 asks for this breakdown; the application never claims to hold every component, and this report says what is still missing.`, '');
lines.push('## Totals', '', '| Measure | Count |', '|---|---|',
  `| Items identified (systems, assemblies, components) | ${tot.total} |`,
  `| Components | ${components.length} |`,
  `| Verified | ${pct(tot.verified, tot.total)} (original number and quantity read from parts book 819045) |`,
  `| Partially verified | ${pct(tot['partially-verified'], tot.total)} |`,
  `| Variant dependent | ${tot['variant-dependent']} |`,
  `| Unverified | ${pct(tot.unverified, tot.total)} |`,
  `| Original part numbers from parts book 819045 (SRC-032) | ${tot.oem} – ${mf35Refs} 819045 rows stored on ${mf35Nodes.length} items, ${mf35Primary} of them primary, ${mf35Cond} carrying a serial or engine-number condition |`,
  `| With parts-book numbers (either book) | ${pct(tot.partsBook, tot.total)} |`,
  `| TO35 parts-book numbers (SRC-041) | ${bookRefs} numbers, ${bookListed} on 23C engine pages, ${bookHeritage} also in the 2008 AGCO catalogue, ${bookIn819045} also found in 819045 |`,
  `| With 2008 AGCO replacement references (SRC-038) | ${pct(tot.replacement, tot.total)} |`,
  `| With description and function | ${pct(tot.described, tot.total)} |`,
  `| In drawn exploded diagrams | ${pct(tot.diagram, tot.total)} (${diagramList.length} diagrams) |`,
  `| Represented in 3D | ${pct(tot.model, tot.total)} |`,
  `| With UK purchase references | ${pct(tot.supplier, tot.total)} (${suppliers.references.length} references, ${suppliers.suppliers.length} suppliers) |`,
  `| Fastener and small-part records (studs, bolts, nuts, pins, seals, gaskets, bushes, bearings, springs…) | ${fastenerIds.length}, of which ${fastenerRefs.length} carry parts-book numbers |`, '');
lines.push('## By system', '', '| System | Items | Verified | Partial | Variant | Unverified | Original no. | Parts book | AGCO 2008 | Described | Diagram | 3D | UK refs |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const s of systems) { const c = cov[s]; lines.push(`| ${nameOf(s)} | ${c.total} | ${c.verified} | ${c['partially-verified']} | ${c['variant-dependent']} | ${c.unverified} | ${c.oem} | ${c.partsBook} | ${c.replacement} | ${c.described} | ${c.diagram} | ${c.model} | ${c.supplier} |`); }
lines.push('');
lines.push('## Missing components and fasteners', '',
  `The hierarchy was compared with the TO35 parts book tables that were read (36 pages). Components the book lists that the hierarchy lacked were added in Phase 8: sump strainer, throttle lever, throttle rods and bellcrank, fuel shut-off control, heater plug resistor, heater plug warning light and brake backing plate. Individual fasteners are recorded as rows inside the component they belong to (for example the nine long and eight short cylinder head bolts under *Head studs / bolts and nuts*), not yet as separate records; the spec's goal of one record per documented nut, bolt and fitting remains open; the 819045 fastener rows (studs, bolts, washers) are now attached to their parent components as references.`, '',
  `Components without any part-number reference yet (${noNumber.length}): ${list(noNumber)}.`, '',
  `Components with no UK purchase reference (${noSupplier.length}): see the catalogue's "UK suppliers" column. Items without a description or function: ${noDescription.length ? list(noDescription) : 'none'}.`, '');
lines.push('## Part numbers and quantities', '',
  `${tot.oem} components carry their original part number and quantity read from the AGCO MF35 / 35X parts book 819045 (SRC-032, the owner's copy); they are the only records marked verified. A number was taken as the 1958 original only when its row names the 23C (or no engine) and any serial condition covers the whole 1958 Coventry range 79553-125067; the earlier (J)/(N) service-engine rows were preferred over the later (K)/(P) rows. ${unsettled.length} components have 819045 rows but no settled number because the book splits them inside 1958 or on the 23C engine number, or lists several alternatives: ${list(unsettled)}. ${noMf35.length} components have no 819045 row at all: ${list(noMf35)}. ${bookRefs} numbers with quantities were read earlier from the Ferguson TO35 parts book page images and stored as \`partsBookReferences\`. Rows from the Standard Motors Diesel engine sections are graded \`listed\` (${bookListed}); chassis, electrical and installation rows are graded \`possible\` because the TO35 was US-built. ${bookHeritage} of them share their base number with a 2008 AGCO Heritage listing for the 35, which corroborates them (for example brake drum 827707M1 → 827707V5, timing chain 826094M1 → 826094V1, bottom hose 826988M1 → 826988V1). Where the book gives several numbers for one part (bore grades, weight grades, serial breaks) every number is kept with its condition. ${bookIn819045} of the TO35 numbers also appear in 819045 (flagged \`inBook819045\`); the rest are mostly superseded by later numbers in 819045 (cylinder block 827483M91 → 1884088M91, exhaust valve 826169M1 → 1884124M1, conrod bolt 826081M1 → 1884110M1). Quantities on verified records come from the 819045 row (per tractor where the book lists per-bank or per-rod figures, with a note).`, '');
lines.push('## Model relationships', '', `${relatedTotal} "connected parts" links; ${oneWay} are one-way (A lists B but B does not list A). One-way links are shown in both directions by the record panel's related chips only from the side that declares them; making them reciprocal is a Phase 9 polish item. All related ids resolve (validator).`, '');
lines.push('## Variant compatibility', '', '| Axis | Meaning | Nodes restricted by option | Owner\'s tractor |', '|---|---|---|---|', ...variantRows, '', 'The configuration rules are in `03-configuration-rules.md`. Only the clutch, cold-start, diff-lock and engine axes restrict nodes; chassis (standard / vineyard / industrial) and electrics do not yet, because no chassis-specific or 6 V/12 V-specific component has been documented.', '');
lines.push('## Supplier links', '', '| Supplier | References | Exact (819045) | Matches AGCO no. | Matches a book no. | Listed for FE35 | Check fit | Last checked |', '|---|---|---|---|---|---|---|---|', ...supplierRows, '', 'Links were live when captured (SRC-039, SRC-040). This container cannot open the supplier sites directly for a bulk re-check, so broken-link detection remains a manual task: open the Research Status page and spot-check. A reference is `exact` when the supplier quotes the original 819045 number (lift arms 180910M1, top and bottom hoses 827496M1 / 826988M1, clutch pedal 1861169M1, brake shoes 1810348M91, hydraulic pump camshaft bearing 1000251M1, levelling box 182642M94); `book-ref` now means a match with a TO35 number or a non-primary 819045 row.', '');
lines.push('## Diagrams', '', `${diagramList.length} drawn diagrams cover these scopes: ${diagramList.map((d) => '`' + d.scope + '`').join(', ')}.`, '', 'Spec §5.3 list:', '', '| Spec item | Hierarchy scope | Diagram |', '|---|---|---|', ...SPEC_DIAGRAMS.map(([n, id]) => `| ${n} | \`${id}\` | ${diagramScopes.has(id) ? 'yes' : 'no'} |`), '', `Assemblies without their own diagram (${assembliesNoDiagram.length}): ${list(assembliesNoDiagram)}. Most are small sub-assemblies whose parts appear in their parent's diagram.`, '');
lines.push('## 3D placement', '', `Model outline: ${size.x.toFixed(2)} m long, ${size.z.toFixed(2)} m wide, ${size.y.toFixed(2)} m high (workshop manual B.1: 117 × 64 × 54 in = 2.97 × 1.63 × 1.37 m; the model's height includes the exhaust stack and steering wheel). Front wheel centre at x = ${frontAxleX?.toFixed(3)} m against a 72 in (1.829 m) wheelbase.`, '',
  `Each modelled part's centre was checked against the region its system occupies on the real tractor. ${placementFlags.length ? 'Flagged: ' + placementFlags.join('; ') + '.' : 'No part sits outside its system\'s region.'} Shapes and internal positions remain approximate as listed in \`docs/model/README.md\`.`, '',
  `Components not represented in 3D (${notModelled.length}): ${list(notModelled)}.`, '');
lines.push('## Unresolved items', '', '- Owner\'s 23C engine number (stamped on the block above the dynamo): decides the lift pump (SJ37180E), injectors (SJ86046E), dipstick (SJ93988E), oil filter (SJ102045E) and gasket-set rows that 819045 splits by engine number.', '- Owner\'s serial number and prefix letters: still unknown, so the clutch and PTO axes stay owner-reported.', '- AGCO Parts Books site (parts.agcocorp.com): reachable, but its parts-book search reported "currently unavailable" on 2026-11-08; retry.', '- UK FE35 electrical equipment (Lucas) is not covered by the TO35 book, which lists Delco-Remy equipment.', '- Agriline engine and front-axle category pages could not be loaded (SRC-040); their references are missing.', '');
fs.writeFileSync(path.join(ROOT, 'docs', 'research', '08-completeness-report.md'), lines.join('\n') + '\n');
console.log(`Wrote docs/research/08-completeness-report.md: ${tot.total} items, ${notModelled.length} not in 3D, ${noNumber.length} without any number, ${placementFlags.length} placement flags`);
