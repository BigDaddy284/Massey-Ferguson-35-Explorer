// Tests for the parts-book references on hierarchy nodes: the Ferguson TO35 book (SRC-041, Phase 8)
// and the AGCO MF35 / 35X book 819045 (SRC-032), which supplies the original part numbers.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../app/js/core.js');

const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8'));
const index = core.indexHierarchy(read('hierarchy.json').root);
const sources = read('sources.json').sources;
const refs = [];
index.order.forEach((id) => (index.byId[id].node.partsBookReferences || []).forEach((r) => refs.push({ id, r })));
const to35 = refs.filter((x) => x.r.book === 'TO35');
const mf35 = refs.filter((x) => x.r.book === 'MF35');
const nodeOf = (id) => index.byId[id].node;

test('TO35 references cite the accessed TO35 book and record whether the number is also in 819045', () => {
  assert.ok(to35.length >= 450, `${to35.length} references`);
  const src = sources.find((s) => s.id === 'SRC-041');
  assert.ok(src && src.accessed && src.reliability === 'primary');
  for (const { id, r } of to35) {
    const n = nodeOf(id);
    assert.equal(r.source, 'SRC-041');
    assert.match(r.number, /^[0-9]{2,7}(M[0-9]{1,2}|X[0-9]{0,2})$/);
    assert.ok(['listed', 'possible'].includes(r.confidence));
    assert.ok(Number.isInteger(r.page) && r.page > 0);
    assert.ok(n.sources.includes('SRC-041'), `${id} cites SRC-041`);
    assert.equal(typeof r.inBook819045, 'boolean');
    assert.ok(!r.primary, 'a TO35 number is never the primary (original) number');
  }
  const found = to35.filter((x) => x.r.inBook819045).length;
  assert.ok(found >= 280 && found < to35.length, `${found} of ${to35.length} TO35 numbers found in 819045`);
});

test('819045 references give the original number: one primary per verified component, cited from SRC-032', () => {
  assert.ok(mf35.length >= 600, `${mf35.length} references`);
  const src = sources.find((s) => s.id === 'SRC-032');
  assert.ok(src && src.accessed && src.reliability === 'primary' && src.dateResearched);
  const primaries = {};
  for (const { id, r } of mf35) {
    const n = nodeOf(id);
    assert.equal(r.source, 'SRC-032');
    assert.match(r.number, /^[0-9A-Z][0-9A-Z\/.]{2,14}$/);
    assert.ok(Number.isInteger(r.page) && r.page > 0);
    assert.ok(n.sources.includes('SRC-032'), `${id} cites SRC-032`);
    if (r.primary) { primaries[id] = (primaries[id] || 0) + 1; assert.equal(n.oemPartNumber, r.number, `${id}: oemPartNumber is the primary row`); }
  }
  for (const [id, c] of Object.entries(primaries)) assert.equal(c, 1, `${id} has one primary`);
  index.order.forEach((id) => {
    const n = nodeOf(id);
    if (n.kind !== 'component') return;
    if (n.status === 'verified') assert.ok(n.oemPartNumber && primaries[id], `${id}: verified needs a primary 819045 number`);
    if (n.oemPartNumber) assert.ok(primaries[id], `${id}: oemPartNumber must come from 819045`);
    if (n.oemPartNumber && n.status !== 'variant-dependent') assert.equal(n.status, 'verified', `${id}: a settled original number means verified`);
  });
  const verified = index.order.filter((id) => nodeOf(id).status === 'verified');
  assert.ok(verified.length >= 120, `${verified.length} verified`);
});

test('key 23C engine, hydraulic, PTO and axle numbers read from 819045 are present and settled', () => {
  const oem = (id) => nodeOf(id).oemPartNumber;
  const qty = (id) => nodeOf(id).quantity;
  assert.equal(oem('crankshaft'), '827506M92');
  assert.equal(oem('engine-block'), '1884088M91');
  assert.equal(oem('camshaft'), '826088M1');
  assert.equal(oem('timing-chain'), '826094M1');
  assert.equal(oem('inlet-valve'), '826168M1'); assert.equal(qty('inlet-valve'), 4);
  assert.equal(oem('exhaust-valve'), '1884124M1');
  assert.equal(oem('pushrod'), '826087M1'); assert.equal(qty('pushrod'), 8);
  assert.equal(oem('water-pump'), '826119M91');
  assert.equal(oem('fuel-tank'), '890054M91');
  assert.equal(oem('injection-pump'), 'DPA3242108');
  assert.equal(oem('hyd-relief-valve'), '828927M91');
  assert.equal(oem('lift-piston'), '184443M91');
  assert.equal(oem('lift-arm-lh'), '180910M1'); assert.equal(oem('lift-arm-rh'), '180910M1');
  assert.equal(oem('pto-output-shaft'), '181204M92');
  assert.equal(oem('brake-drum'), '827707M1'); assert.equal(qty('brake-drum'), 2);
  assert.equal(oem('half-shaft'), '185393M91');
  assert.equal(oem('crown-wheel'), '1885317M91');
  assert.equal(oem('starter-motor'), '26133D');
  assert.equal(oem('front-axle-beam'), '183219M91');
  const prim = nodeOf('lift-cylinder').partsBookReferences.find((r) => r.primary);
  assert.equal(prim.number, '184442M1');
  assert.match(prim.condition, /65685/);
});

test('serial splits inside 1958 and engine-number splits are left unsettled, with every candidate kept', () => {
  for (const id of ['fuel-lift-pump', 'dipstick', 'injector', 'lift-rod-rh', 'front-badge', 'countershaft', 'release-fork']) {
    const n = nodeOf(id);
    assert.equal(n.oemPartNumber, null, `${id} has no settled number`);
    assert.notEqual(n.status, 'verified');
    assert.ok(n.partsBookReferences.filter((r) => r.book === 'MF35').length >= 2, `${id} lists its candidates`);
    assert.ok(n.partsBookNote, `${id} explains why`);
  }
  const pump = nodeOf('fuel-lift-pump').partsBookReferences.filter((r) => r.book === 'MF35').map((r) => r.number);
  assert.ok(pump.includes('826154M91') && pump.includes('1884857M91'));
  assert.equal(nodeOf('heater-plugs').status, 'variant-dependent', 'variant-dependent parts keep their status even with a number');
  assert.equal(nodeOf('heater-plugs').oemPartNumber, '829162M1');
});

test('TO35 grading and Heritage agreement are kept; TO35 supersessions are flagged as not in 819045', () => {
  const grade = (id, num) => nodeOf(id).partsBookReferences.find((r) => r.number === num);
  assert.equal(grade('crankshaft', '827506M92').confidence, 'listed');
  assert.equal(grade('gearbox-casing', '880309M91').confidence, 'possible');
  const drum = grade('brake-drum', '827707M1');
  assert.equal(drum.heritage, true);
  assert.equal(drum.inBook819045, true);
  assert.equal(grade('engine-block', '827483M91').inBook819045, false, '819045 lists 1884088M91 instead');
  assert.equal(grade('head-gasket', '827612M1').inBook819045, false);
});

test('parts-book numbers are searchable and counted in coverage', () => {
  const docs = core.buildSearchIndex(index, {}, null, read('suppliers.json'));
  const top = (q) => core.search(docs, q, 5).map((r) => r.doc.id);
  assert.equal(top('827506M92')[0], 'crankshaft');
  assert.equal(top('1884088M91')[0], 'engine-block');
  assert.ok(top('180910M1').includes('lift-arm-lh'));
  const cov = core.coverage(index, [], null, read('suppliers.json'));
  const total = Object.values(cov).reduce((n, c) => n + c.partsBook, 0);
  assert.equal(total, new Set(refs.map((x) => x.id)).size);
  const oem = Object.values(cov).reduce((n, c) => n + c.oem, 0);
  assert.ok(oem >= 120, `${oem} original numbers`);
  assert.ok(cov.engine.verified >= 35, `engine ${cov.engine.verified}`);
  assert.ok(cov.hydraulics.verified >= 20, `hydraulics ${cov.hydraulics.verified}`);
});
