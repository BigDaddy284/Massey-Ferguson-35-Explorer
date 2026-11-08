// Tests for app/js/core.js against the real project data.
// Run: npm test   (single file: node --test tests/core.test.js)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../app/js/core.js');

const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8'));
const config = read('configurations.json');
const technical = read('technical.json');
const sources = read('sources.json').sources;
const index = core.indexHierarchy(read('hierarchy.json').root);
// A copy of the config with the clutch unknown, to test behaviour before the owner reports it.
const unknownClutch = { ...config, ownerTractor: { ...config.ownerTractor, clutch: null, pto: null } };

test('hierarchy index has unique ids, parents and paths', () => {
  assert.equal(index.rootId, 'mf35');
  assert.equal(index.byId['lift-piston'].parentId, 'lift-cover');
  assert.deepEqual(index.byId['lift-piston'].path, ['mf35', 'hydraulics', 'lift-cover', 'lift-piston']);
  assert.equal(core.systemOf(index, 'lift-piston').id, 'hydraulics');
});

test('unknown owner clutch falls back to default and is not confirmed', () => {
  const r = core.resolveConfiguration(unknownClutch);
  assert.equal(r.values.clutch, config.defaultTarget.clutch);
  assert.equal(r.confirmed.clutch, false);
  assert.equal(r.confirmed.engine, true, 'the fuel letter D on the serial plate confirms the 23C');
  assert.equal(core.resolveConfiguration({ ...config, ownerTractor: { ...config.ownerTractor, engineStatus: 'provisional' } }).confirmed.engine, false, 'a provisional engine is not confirmed');
});

test('PTO is derived from the clutch', () => {
  assert.equal(core.resolveConfiguration(config, { clutch: 'single-stage' }).values.pto, 'transmission-pto');
  assert.equal(core.resolveConfiguration(config, { clutch: 'dual-stage' }).values.pto, 'live-pto');
});

test('clutch-dependent parts are variant dependent until the clutch is confirmed', () => {
  const unknown = core.resolveConfiguration(unknownClutch);
  assert.equal(core.displayStatus(index, 'clutch-dual-pto-plate', unknown), 'variant-dependent');
  const single = core.resolveConfiguration(config, { clutch: 'single-stage' });
  assert.equal(core.applicability(index, 'clutch-dual-pto-plate', single).applies, false);
  assert.equal(core.applicability(index, 'clutch-single-plate', single).applies, true);
  assert.equal(core.applicability(index, 'clutch-single-plate', single).variant, false);
});

test("owner-reported dual clutch: live PTO, dual-clutch parts fitted, single-clutch parts not", () => {
  const r = core.resolveConfiguration(config);
  assert.equal(r.values.clutch, 'dual-stage');
  assert.equal(r.confirmed.clutch, true);
  assert.equal(r.values.pto, 'live-pto');
  assert.equal(core.applicability(index, 'clutch-dual-pto-plate', r).applies, true);
  assert.equal(core.applicability(index, 'clutch-dual-pto-plate', r).variant, false);
  assert.equal(core.applicability(index, 'clutch-single-plate', r).applies, false);
});

test('parts with no appliesTo are not variant dependent', () => {
  const r = core.resolveConfiguration(config);
  assert.equal(core.displayStatus(index, 'lift-piston', r), 'verified', 'lift piston 184443M91 is read from parts book 819045');
  assert.equal(core.displayStatus(index, 'core-plugs', r), 'partially-verified', 'core plugs are listed in the TO35 parts book (SRC-041)');
  assert.equal(core.displayStatus(index, 'serial-plate', r), 'partially-verified', 'serial plate is described in the workshop manual');
  assert.equal(core.displayStatus(index, 'crankshaft', r), 'verified', 'crankshaft 827506M92 is read from parts book 819045');
});

test('serial decoding: 1958 dual-clutch diesel', () => {
  const d = core.decodeSerial('SDM 105432', config, technical);
  assert.equal(d.prefix, 'SDM');
  assert.equal(d.number, 105432);
  assert.equal(d.year, 1958);
  assert.equal(d.inTargetYear, true);
  assert.deepEqual(d.axisValues, { chassis: 'standard', engine: 'std-23c-diesel', clutch: 'dual-stage' });
  assert.deepEqual(d.warnings, []);
});

test('serial decoding: year boundaries and warnings', () => {
  assert.equal(core.decodeSerial('79553', config, technical).year, 1958);
  assert.equal(core.decodeSerial('125067', config, technical).year, 1958);
  const y59 = core.decodeSerial('sdf-125068', config, technical);
  assert.equal(y59.year, 1959);
  assert.equal(y59.axisValues.clutch, 'single-stage');
  assert.ok(y59.warnings.some((w) => w.includes('1959')));
  assert.ok(core.decodeSerial('SNM 200000', config, technical).warnings.some((w) => w.includes('23C')));
  assert.ok(core.decodeSerial('hello', config, technical).warnings.length > 0);
});

test('search finds by name, partial, misspelling, synonym and supplier number', () => {
  const docs = core.buildSearchIndex(index, null, technical);
  const top = (q) => core.search(docs, q, 5).map((r) => r.doc.id);
  assert.equal(top('hydraulic pump')[0], 'hyd-pump');
  assert.ok(top('rocksh').includes('rockshaft'));
  assert.ok(top('crankshaf').includes('crankshaft'));
  assert.ok(top('crnakshaft').includes('crankshaft'), 'transposition tolerated');
  assert.ok(top('hydralic pump').includes('hyd-pump'), 'missing letter tolerated');
  assert.ok(top('tire').some((id) => id.includes('tyre')), 'US spelling maps to UK');
  assert.ok(top('184471M1').includes('hyd-valve-chamber'), 'supplier-claimed OEM number');
  assert.ok(top('184471 m1').includes('hyd-valve-chamber'), 'spaced part number');
  assert.deepEqual(core.search(docs, '', 5), []);
});

test('AGCO Heritage replacement references: searchable, sourced, never the OEM number', () => {
  const docs = core.buildSearchIndex(index, null, technical);
  const top = (q) => core.search(docs, q, 5).map((r) => r.doc.id);
  assert.ok(top('830972V92').includes('piston'), '23C piston kit number finds the piston');
  assert.ok(top('1884123V1').includes('inlet-valve'), '23C inlet valve number');
  assert.ok(top('883402V92').includes('hyd-relief-valve'), 'hydraulic relief valve number');
  const byId = Object.fromEntries(sources.map((s) => [s.id, s]));
  let count = 0;
  for (const id of index.order) {
    const n = index.byId[id].node;
    for (const r of n.replacementReferences || []) {
      count++;
      assert.ok(byId[r.source] && byId[r.source].accessed, `${id}: ${r.number} cites an accessed source`);
      assert.ok((n.sources || []).includes(r.source), `${id}: node cites ${r.source}`);
      if (n.oemPartNumber === r.number) assert.ok((n.partsBookReferences || []).some((b) => b.primary), `${id}: a replacement reference equal to the OEM number needs an 819045 primary`);
      assert.ok(['listed', 'possible'].includes(r.confidence), `${id}: confidence recorded`);
    }
  }
  assert.ok(count >= 140, `expected the Heritage references to be attached, got ${count}`);
  assert.equal(index.byId['piston'].node.oemPartNumber, '1884101M91', 'the piston number is read from parts book 819045 page 84');
  const cov = core.coverage(index);
  assert.ok(cov.engine.replacement >= 10 && cov.hydraulics.replacement >= 8, 'coverage counts nodes with replacement refs');
});

test('workshop-manual torques are searchable; withheld rows are not', () => {
  const docs = core.buildSearchIndex(index, null, technical);
  assert.ok(core.search(docs, 'connecting rod bolts torque', 10).some((r) => r.doc.kind === 'technical' && r.doc.sectionId === 'torques'));
  const withheld = { ...technical, sections: [{ id: 'x', title: 'X', rows: [{ label: 'Secret figure', value: '1', status: 'unverified', sources: [], display: false }] }] };
  const docs2 = core.buildSearchIndex(index, null, withheld);
  assert.equal(core.search(docs2, 'secret figure', 10).length, 0);
});

test('workshop manual corrections: Perkins letter is N, P is no longer decoded', () => {
  assert.equal(core.decodeSerial('SNM 170000', config, technical).axisValues.engine, 'perkins-3-152');
  assert.ok(core.decodeSerial('SPM 170000', config, technical).warnings.some((w) => w.includes('"P"')));
  const verifiedRows = technical.sections.flatMap((s) => s.rows).filter((r) => r.status === 'verified');
  assert.ok(verifiedRows.length > 0);
  const primary = new Set(sources.filter((s) => s.reliability === 'primary' && s.accessed).map((s) => s.id));
  for (const r of verifiedRows) assert.ok(r.sources.some((s) => primary.has(s)), r.label);
});

test('technical rows cite known sources', () => {
  const ids = new Set(sources.map((s) => s.id));
  for (const sec of technical.sections) for (const row of sec.rows) for (const s of row.sources) assert.ok(ids.has(s), s);
});

test('coverage counts every non-root node', () => {
  const cov = core.coverage(index);
  const total = Object.values(cov).reduce((a, c) => a + c.total, 0);
  assert.equal(total, index.order.length - 1);
  assert.ok(Object.values(cov).reduce((a, c) => a + c.verified, 0) >= 120, 'components with an 819045 number are verified');
});

test('coverage counts parts represented in 3D', () => {
  const cov = core.coverage(index, ['lift-piston', 'hyd-pump', 'not-a-real-id']);
  assert.equal(cov.hydraulics.model, 2);
  assert.equal(cov.engine.model, 0);
});

test('every hierarchy id used by the 3D model exists', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'app', 'js', 'model.js'), 'utf8');
  const ids = new Set();
  for (const m of src.matchAll(/(?:add|rod|bar|tube|helix|hexNut|part)\(\s*'([a-z0-9-]+)'/g)) ids.add(m[1]);
  for (const m of src.matchAll(/\?\s*'([a-z0-9]+-[a-z0-9-]+)'\s*:\s*'([a-z0-9]+-[a-z0-9-]+)'/g)) { ids.add(m[1]); ids.add(m[2]); }
  for (const m of src.matchAll(/\['([a-z0-9-]+)',\s*-?0\.\d+\]/g)) ids.add(m[1]);
  ['inlet-valve', 'exhaust-valve', 'inlet-valve-guide', 'exhaust-valve-guide'].forEach((id) => ids.add(id));
  const casings = src.match(/var CASINGS = \[([\s\S]*?)\];/)[1].match(/'([a-z0-9-]+)'/g).map((s) => s.slice(1, -1));
  casings.forEach((id) => ids.add(id));
  assert.ok(ids.size > 150, `found ${ids.size} ids`);
  const missingIds = [...ids].filter((id) => !index.byId[id]);
  assert.deepEqual(missingIds, []);
});

test('exploded-view directions and stacking axes name real hierarchy ids', () => {
  const THREE = require('../app/vendor/three/three.min.js');
  const model = require('../app/js/model.js');
  const built = model.build(THREE);
  const keys = [...Object.keys(model.EXPLODE), ...Object.keys(built.explodeAxis)];
  assert.ok(keys.length > 40, `found ${keys.length} entries`);
  assert.deepEqual(keys.filter((id) => !index.byId[id]), []);
  for (const [id, v] of Object.entries(model.EXPLODE)) {
    assert.ok(v.slice(0, 3).every((n) => typeof n === 'number' && Math.abs(n) <= 1.5), id);
    assert.ok(v.length === 3 || (v.length === 4 && v[3] === 'mirror'), id);
  }
});

test('Phase 5 records: every node explains itself and cross-references real parts', () => {
  let described = 0;
  for (const id of index.order) {
    const n = index.byId[id].node;
    for (const k of ['description', 'function', 'location']) assert.ok(typeof n[k] === 'string' && n[k].length > 10, `${id}: has ${k}`);
    if (n.description && n.function) described++;
    for (const r of n.related || []) {
      assert.ok(index.byId[r], `${id}: related id ${r} exists`);
      assert.notEqual(r, id, `${id}: does not relate to itself`);
    }
    if (n.specifications && Object.keys(n.specifications).length) assert.ok((n.sources || []).length, `${id}: specifications cite a source`);
  }
  assert.equal(described, index.order.length, 'every node has a description and function');
  assert.ok(index.byId['hyd-pump'].node.related.includes('hyd-control-valve'), 'pump links to its control valve');
  assert.ok(index.byId['pto-output-shaft'].node.related.includes('pto-gears'), 'PTO shaft links to its gears');
  assert.match(index.byId['clutch-dual'].node.function, /Half pedal/, 'dual clutch explains the two-stage pedal');
  const docs = core.buildSearchIndex(index, null, technical);
  const top = (q) => core.search(docs, q, 5).map((r) => r.doc.id);
  assert.ok(top('Ricardo Comet').includes('combustion-chamber-insert'), 'descriptions are searchable');
  assert.ok(top('levelling lever').includes('levelling-box'), 'locations/descriptions find the levelling box');
  const cov = core.coverage(index);
  assert.equal(Object.values(cov).reduce((a, c) => a + c.described, 0), index.order.length - 1, 'coverage counts described nodes');
});

test('Phase 9 glossary terms are searchable and link only to real records', () => {
  const docs = core.buildSearchIndex(index, null, technical);
  const hits = core.search(docs, 'live pto', 5);
  assert.ok(hits.some((r) => r.doc.kind === 'term' && r.doc.title === 'Live PTO'), 'glossary term found');
  assert.ok(core.search(docs, 'draft contrl', 5).some((r) => r.doc.kind === 'term'), 'misspelt term still found');
  assert.ok(technical.glossary.length >= 10);
  for (const g of technical.glossary) {
    for (const r of g.related) assert.ok(index.byId[r], `${g.term}: related ${r} exists`);
    assert.ok(!/\d{6}M\d/.test(g.text), `${g.term}: glossary text carries no part numbers`);
  }
});
