// Tests for the Phase 8 TO35 parts-book references (partsBookReferences on hierarchy nodes).
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

test('parts-book references cite the accessed TO35 book and never pose as the FE35 original number', () => {
  assert.ok(refs.length >= 450, `${refs.length} references`);
  const src = sources.find((s) => s.id === 'SRC-041');
  assert.ok(src && src.accessed && src.reliability === 'primary');
  for (const { id, r } of refs) {
    const n = index.byId[id].node;
    assert.equal(r.source, 'SRC-041');
    assert.equal(r.book, 'TO35');
    assert.match(r.number, /^[0-9]{2,7}(M[0-9]{1,2}|X[0-9]{0,2})$/);
    assert.ok(['listed', 'possible'].includes(r.confidence));
    assert.ok(Number.isInteger(r.page) && r.page > 0);
    assert.ok(n.sources.includes('SRC-041'), `${id} cites SRC-041`);
    assert.notEqual(n.oemPartNumber, r.number);
    assert.notEqual(n.status, 'verified', `${id}: nothing is verified until 819045M4 is read`);
  }
});

test('key 23C engine, hydraulic and PTO numbers read from the page images are present', () => {
  const has = (id, num) => (index.byId[id].node.partsBookReferences || []).some((r) => r.number === num);
  assert.ok(has('crankshaft', '827506M92'));
  assert.ok(has('timing-chain', '826094M1'));
  assert.ok(has('flywheel', '184879M91'));
  assert.ok(has('inlet-valve', '826168M1'));
  assert.ok(has('exhaust-valve', '826169M1'));
  assert.ok(has('head-gasket', '827612M1'));
  assert.ok(has('injection-pump', '829703M91'));
  assert.ok(has('lift-arm-lh', '180910M1'));
  assert.ok(has('lift-piston', '184443M91'));
  assert.ok(has('lift-cover-gasket', '886549M2'));
  assert.ok(has('pto-output-shaft', '181204M92'));
  assert.ok(has('brake-drum', '827707M1'));
  const valves = index.byId['inlet-valve'].node.partsBookReferences.find((r) => r.number === '826168M1');
  assert.equal(valves.qty, 4);
});

test('engine pages are graded listed and US chassis pages possible; Heritage agreement is flagged', () => {
  const grade = (id, num) => index.byId[id].node.partsBookReferences.find((r) => r.number === num);
  assert.equal(grade('crankshaft', '827506M92').confidence, 'listed');
  assert.equal(grade('gearbox-casing', '880309M91').confidence, 'possible');
  assert.equal(grade('radiator', '828096M92').confidence, 'possible', 'the radiator is a tractor part even on an engine page');
  const drum = grade('brake-drum', '827707M1');
  assert.equal(drum.confidence, 'listed', 'a TO35 number that AGCO still listed for the 35 in 2008 counts as listed');
  assert.equal(drum.heritage, true);
});

test('parts-book numbers are searchable and counted in coverage', () => {
  const docs = core.buildSearchIndex(index, {}, null, read('suppliers.json'));
  const top = (q) => core.search(docs, q, 5).map((r) => r.doc.id);
  assert.equal(top('827506M92')[0], 'crankshaft');
  assert.ok(top('180910M1').includes('lift-arm-lh'));
  const cov = core.coverage(index, [], null, read('suppliers.json'));
  const total = Object.values(cov).reduce((n, c) => n + c.partsBook, 0);
  assert.equal(total, new Set(refs.map((x) => x.id)).size);
  assert.ok(cov.engine.partsBook >= 60, `engine ${cov.engine.partsBook}`);
  assert.ok(cov.hydraulics.partsBook >= 20, `hydraulics ${cov.hydraulics.partsBook}`);
});
