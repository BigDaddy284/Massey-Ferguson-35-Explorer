// Tests for the generated drawn diagrams (app/data/mf35-diagrams.js) against the hierarchy.
// Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../app/js/core.js');

const index = core.indexHierarchy(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'hierarchy.json'), 'utf8')).root);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'app', 'data', 'mf35-diagrams.js'), 'utf8'), sandbox);
const diagrams = sandbox.window.MF35_DIAGRAMS.diagrams;

test('every major assembly has a drawn diagram with numbered items', () => {
  const ids = Object.keys(diagrams);
  assert.ok(ids.length >= 17, `expected 17 diagrams, got ${ids.length}`);
  for (const id of ids) {
    const d = diagrams[id];
    assert.ok(index.byId[id], `${id}: diagram scope exists in the hierarchy`);
    assert.ok(d.title && d.svg.startsWith('<svg'), `${id}: has a title and SVG`);
    assert.ok(d.items.length >= 3 && d.items.length <= 40, `${id}: ${d.items.length} items, readable range`);
    d.items.forEach((it, i) => {
      assert.equal(it.n, i + 1, `${id}: numbering is contiguous`);
      assert.ok(index.byId[it.id], `${id}: item ${it.id} exists`);
      assert.ok(index.byId[it.id].path.includes(id), `${id}: item ${it.id} belongs to the assembly`);
      assert.ok(d.svg.includes(`class="dg-callout" data-id="${it.id}"`), `${id}: item ${it.n} has a callout`);
    });
    assert.ok(/<g data-id="[a-z0-9-]+"><path d="M/.test(d.svg), `${id}: parts are drawn as paths with ids`);
    assert.ok(!/<script|<image|href=/.test(d.svg), `${id}: SVG is plain shapes`);
  }
});

test('diagramRefs finds the nearest diagram and item for a part', () => {
  const piston = core.diagramRefs(index, diagrams, 'piston');
  assert.ok(piston.length && piston[0].diagram === 'crank-assy' && piston[0].exact, 'the piston is a numbered item in the crankshaft diagram');
  const rings = core.diagramRefs(index, diagrams, 'piston-rings');
  assert.ok(rings.length && rings[0].diagram === 'crank-assy', 'piston rings are found in the crankshaft diagram');
  const engineRef = piston.find((r) => r.diagram === 'engine');
  assert.ok(engineRef && !engineRef.exact && engineRef.item === 'crank-assy', 'the engine diagram shows the piston inside its group');
  assert.deepEqual(core.diagramRefs(index, diagrams, 'horn'), [], 'parts outside every diagram have no reference');
  const cov = core.coverage(index, [], diagrams);
  assert.ok(cov.engine.diagram >= 60 && cov.hydraulics.diagram >= 20, 'coverage counts parts shown in diagrams');
  assert.equal(cov.electrical.diagram, 0, 'no electrical diagram yet');
});
