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
  assert.equal(r.confirmed.engine, false, 'engine is provisional in the data file');
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
  assert.equal(core.displayStatus(index, 'lift-piston', r), 'partially-verified');
  assert.equal(core.displayStatus(index, 'core-plugs', r), 'unverified');
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
  assert.equal(Object.values(cov).reduce((a, c) => a + c.verified, 0), 0, 'nothing is verified yet');
});
