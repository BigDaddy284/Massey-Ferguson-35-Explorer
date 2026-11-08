// Tests for the Phase 7 UK supplier references (data/suppliers.json) and the
// core helpers that use them. Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../app/js/core.js');

const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8'));
const index = core.indexHierarchy(read('hierarchy.json').root);
const suppliers = read('suppliers.json');
const sources = read('sources.json').sources;

test('every reference points at a real part, a real UK supplier and an accessed source', () => {
  const supplierIds = new Set(suppliers.suppliers.map((s) => s.id));
  assert.ok(suppliers.references.length >= 200, `${suppliers.references.length} references`);
  for (const r of suppliers.references) {
    assert.ok(index.byId[r.node], `${r.node} exists`);
    assert.ok(supplierIds.has(r.supplier), `${r.supplier} is a registered supplier`);
    assert.match(r.url, /^https:\/\//);
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['exact', 'agco-ref', 'book-ref', 'listed-fit', 'check-fit'].includes(r.match), `${r.match} is an allowed grade`);
    const src = sources.find((s) => s.id === r.source);
    assert.ok(src && src.accessed && src.reliability === 'supplier', `${r.source} is an accessed supplier source`);
  }
  for (const s of suppliers.suppliers) assert.equal(s.country, 'UK');
});

test('exact, agco-ref and book-ref are only used where a quoted number really equals the recorded number', () => {
  for (const r of suppliers.references) {
    const n = index.byId[r.node].node;
    const q = (r.oemQuoted || []).map(core.normaliseNumber);
    const exact = !!n.oemPartNumber && q.includes(core.normaliseNumber(n.oemPartNumber));
    const nums = (n.replacementReferences || []).map((x) => core.normaliseNumber(x.number));
    const books = (n.partsBookReferences || []).map((x) => core.normaliseNumber(x.number));
    const hit = !exact && q.some((x) => nums.includes(x));
    const bookHit = !exact && !hit && q.some((x) => books.includes(x));
    assert.equal(r.match === 'exact', exact, `${r.node} / ${r.supplierPartNumber}: exact matches the evidence`);
    assert.equal(r.match === 'agco-ref', hit, `${r.node} / ${r.supplierPartNumber}: agco-ref matches the evidence`);
    assert.equal(r.match === 'book-ref', bookHit, `${r.node} / ${r.supplierPartNumber}: book-ref matches the evidence`);
    if (r.match === 'exact') assert.equal(core.normaliseNumber(r.matchedNumber), core.normaliseNumber(n.oemPartNumber));
  }
  assert.ok(suppliers.references.some((r) => r.match === 'agco-ref'), 'at least one AGCO-number match exists');
  assert.ok(suppliers.references.some((r) => r.match === 'exact' && r.node === 'lift-arm-lh'), 'the Anglo lift arm quotes the original number 180910M1');
  assert.equal(core.MATCH_ORDER.exact, 0);
  assert.ok(core.MATCH_ORDER['agco-ref'] < core.MATCH_ORDER['book-ref'] && core.MATCH_ORDER['book-ref'] < core.MATCH_ORDER['listed-fit']);
});

test('normaliseNumber treats the M and V suffix letters as the same number', () => {
  assert.equal(core.normaliseNumber('827707M5'), core.normaliseNumber('827707V5'));
  assert.equal(core.normaliseNumber('1884123M1'), core.normaliseNumber(' 1884123v1 '));
  assert.notEqual(core.normaliseNumber('830480M92'), core.normaliseNumber('830480V93'), 'a different revision suffix is a different number');
  assert.notEqual(core.normaliseNumber('180579M3'), core.normaliseNumber('180579M31'));
});

test('supplier part numbers and quoted OEM numbers are searchable', () => {
  const docs = core.buildSearchIndex(index, {}, null, suppliers);
  const top = (q) => core.search(docs, q, 5).map((r) => r.doc.id);
  assert.equal(top('A65600')[0], 'cylinder-head-assy', 'Anglo number finds the top gasket set');
  assert.ok(top('827707M5').includes('brake-drum'), 'quoted OEM number finds the brake drum');
  assert.ok(top('5666').includes('brake-drum'), 'Agriline number finds the brake drum');
  assert.ok(top('A67170').includes('lift-arm-lh'), 'lift arm by Anglo number');
});

test('coverage counts parts with UK purchase references by system', () => {
  const cov = core.coverage(index, [], null, suppliers);
  const total = Object.values(cov).reduce((n, c) => n + c.supplier, 0);
  assert.equal(total, Object.keys(core.supplierRefsByNode(suppliers)).length);
  assert.ok(cov.hydraulics.supplier >= 15, `hydraulics ${cov.hydraulics.supplier}`);
  assert.ok(cov.engine.supplier >= 25, `engine ${cov.engine.supplier}`);
  assert.equal(core.coverage(index, [], null, null).engine.supplier, 0, 'no suppliers, no counts');
});
