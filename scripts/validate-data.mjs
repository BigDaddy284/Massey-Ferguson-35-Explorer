#!/usr/bin/env node
// Validates the research data in data/*.json.
// Usage: node scripts/validate-data.mjs        (exit code 1 on any error)
// Checks: unique stable IDs, allowed kinds and verification statuses,
// every cited source exists in the register, appliesTo uses known variant
// axes/options, no unverified source is used as the sole support for a
// "verified" status, and replacementReferences (current AGCO supply numbers)
// cite an accessed source and never repeat the oemPartNumber. Phase 7:
// suppliers.json references point at existing nodes and suppliers, use https
// URLs, carry a checked date and an allowed match grade, and `agco-ref` is only
// allowed when a quoted OEM number really equals one of the node's numbers.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = (f) => JSON.parse(readFileSync(join(root, 'data', f), 'utf8'));

const STATUSES = new Set(['verified', 'partially-verified', 'unverified', 'variant-dependent']);
const KINDS = new Set(['tractor', 'system', 'assembly', 'subassembly', 'component']);
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];
const err = (m) => errors.push(m);

const { sources } = load('sources.json');
const sourceById = new Map();
for (const s of sources) {
  if (sourceById.has(s.id)) err(`duplicate source id ${s.id}`);
  sourceById.set(s.id, s);
  if (s.accessed && !s.dateResearched) err(`${s.id}: accessed source needs dateResearched`);
}

const config = load('configurations.json');
const axes = new Map(config.variantAxes.map((a) => [a.id, new Set(a.options.map((o) => o.id))]));
for (const a of config.variantAxes) {
  for (const o of a.options) {
    if (!STATUSES.has(o.status)) err(`config ${a.id}.${o.id}: bad status ${o.status}`);
    for (const s of o.sources ?? []) if (!sourceById.has(s)) err(`config ${a.id}.${o.id}: unknown source ${s}`);
  }
}
for (const b of config.serialBreaks) for (const s of b.sources) if (!sourceById.has(s)) err(`${b.id}: unknown source ${s}`);
for (const [k, v] of Object.entries(config.defaultTarget)) {
  if (k.startsWith('$')) continue;
  if (!axes.has(k)) err(`defaultTarget: unknown axis ${k}`);
  else if (!axes.get(k).has(v)) err(`defaultTarget.${k}: unknown option ${v}`);
}

const { root: tree } = load('hierarchy.json');
const ids = new Set();
const relatedRefs = [];
const nodeNumbers = new Map();
const nodeBookNumbers = new Map();
const nodeOem = new Map();
const BOOKS = new Set(['TO35', 'MF35']);
const counts = { total: 0, byStatus: {} };
(function walk(node, path) {
  const where = [...path, node.id].join(' > ');
  if (!ID_RE.test(node.id)) err(`${where}: id must be kebab-case`);
  if (ids.has(node.id)) err(`${where}: duplicate id ${node.id}`);
  ids.add(node.id);
  nodeNumbers.set(node.id, (node.replacementReferences ?? []).map((r) => r.number));
  nodeOem.set(node.id, node.oemPartNumber ?? null);
  nodeBookNumbers.set(node.id, (node.partsBookReferences ?? []).map((r) => r.number));
  if (!KINDS.has(node.kind)) err(`${where}: bad kind ${node.kind}`);
  const status = node.status ?? 'unverified';
  if (!STATUSES.has(status)) err(`${where}: bad status ${status}`);
  for (const s of node.sources ?? []) if (!sourceById.has(s)) err(`${where}: unknown source ${s}`);
  if (status === 'verified') {
    const primary = (node.sources ?? []).some((s) => sourceById.get(s)?.reliability === 'primary' && sourceById.get(s)?.accessed);
    if (!primary) err(`${where}: 'verified' requires at least one accessed primary source`);
  }
  if (status !== 'unverified' && !(node.sources?.length) && node.kind !== 'tractor') {
    err(`${where}: status '${status}' needs sources`);
  }
  for (const k of ['description', 'function', 'location', 'failure']) {
    if (k in node && (typeof node[k] !== 'string' || !node[k].trim())) err(`${where}: ${k} must be a non-empty string`);
  }
  if ('specifications' in node) {
    if (typeof node.specifications !== 'object' || Array.isArray(node.specifications)) err(`${where}: specifications must be an object`);
    else for (const [k, v] of Object.entries(node.specifications)) if (typeof v !== 'string' || !v.trim()) err(`${where}: specifications.${k} must be a string`);
    if (Object.keys(node.specifications ?? {}).length && !(node.sources?.length)) err(`${where}: specifications need a cited source`);
  }
  if ('related' in node) {
    if (!Array.isArray(node.related)) err(`${where}: related must be an array of ids`);
    else for (const r of node.related) {
      if (r === node.id) err(`${where}: related must not include the node itself`);
      relatedRefs.push([where, r]);
    }
  }
  for (const [i, r] of (node.replacementReferences ?? []).entries()) {
    const w = `${where}: replacementReferences[${i}]`;
    if (!r.number || !/^[0-9A-Z]{5,12}$/.test(r.number)) err(`${w}: bad number ${r.number}`);
    if (!r.description) err(`${w}: needs a description`);
    if (!r.source || !sourceById.has(r.source)) err(`${w}: unknown source ${r.source}`);
    else if (!sourceById.get(r.source).accessed) err(`${w}: source ${r.source} has not been accessed`);
    if (r.confidence && !['listed', 'possible'].includes(r.confidence)) err(`${w}: bad confidence ${r.confidence}`);
    if (node.oemPartNumber && r.number === node.oemPartNumber && !(node.partsBookReferences ?? []).some((b) => b.primary)) err(`${w}: duplicates oemPartNumber without a primary parts-book reference`);
  }
  const primaries = (node.partsBookReferences ?? []).filter((r) => r.primary);
  if (primaries.length > 1) err(`${where}: only one parts-book reference may be primary`);
  if (primaries.length === 1 && (primaries[0].book !== 'MF35' || node.oemPartNumber !== primaries[0].number)) err(`${where}: the primary reference must be the 819045 row that gives oemPartNumber`);
  if (node.oemPartNumber && primaries.length !== 1) err(`${where}: oemPartNumber must come from a primary 819045 parts-book reference`);
  if (status === 'verified' && node.kind === 'component' && !node.oemPartNumber) err(`${where}: a verified component needs its original part number from the 819045 parts book`);
  if ('partsBookNote' in node && (typeof node.partsBookNote !== 'string' || !node.partsBookNote.trim())) err(`${where}: partsBookNote must be a non-empty string`);
  for (const [i, r] of (node.partsBookReferences ?? []).entries()) {
    const w = `${where}: partsBookReferences[${i}]`;
    const numRe = r.book === 'MF35' ? /^[0-9A-Z][0-9A-Z\/.]{2,14}$/ : /^[0-9]{2,7}(M[0-9]{1,2}|X[0-9]{0,2})$/;
    if (!r.number || !numRe.test(r.number)) err(`${w}: bad number ${r.number}`);
    if (!r.description) err(`${w}: needs a description`);
    if (!r.source || !sourceById.has(r.source)) err(`${w}: unknown source ${r.source}`);
    else {
      const src = sourceById.get(r.source);
      if (!src.accessed) err(`${w}: source ${r.source} has not been accessed`);
      if (src.reliability !== 'primary') err(`${w}: a parts-book reference must cite a primary source`);
    }
    if (!Number.isInteger(r.page) || r.page < 1) err(`${w}: page must be the printed page number`);
    if (!BOOKS.has(r.book)) err(`${w}: book must be one of ${[...BOOKS].join(', ')}`);
    if (r.book === 'MF35' && r.source !== 'SRC-032') err(`${w}: 819045 references cite SRC-032`);
    if (r.book === 'TO35' && r.source !== 'SRC-041') err(`${w}: TO35 references cite SRC-041`);
    if (r.book === 'TO35' && typeof r.inBook819045 !== 'boolean') err(`${w}: TO35 references record whether the number also appears in 819045 (inBook819045)`);
    if (!['listed', 'possible'].includes(r.confidence)) err(`${w}: bad confidence ${r.confidence}`);
    if (r.qty !== null && r.qty !== undefined && (!Number.isInteger(r.qty) || r.qty < 1)) err(`${w}: qty must be null or a positive integer`);
    if (!(node.sources ?? []).includes(r.source)) err(`${w}: node must list ${r.source} in sources`);
  }
  for (const [axis, opts] of Object.entries(node.appliesTo ?? {})) {
    if (!axes.has(axis)) err(`${where}: appliesTo unknown axis ${axis}`);
    else for (const o of opts) if (!axes.get(axis).has(o)) err(`${where}: appliesTo ${axis} unknown option ${o}`);
  }
  if (node.kind !== 'tractor') {
    counts.total++;
    if ((node.partsBookReferences ?? []).length) counts.partsBook = (counts.partsBook ?? 0) + 1;
    if (node.oemPartNumber) counts.oem = (counts.oem ?? 0) + 1;
    counts.byStatus[status] = (counts.byStatus[status] ?? 0) + 1;
  }
  for (const c of node.children ?? []) walk(c, [...path, node.id]);
})(tree, []);
for (const [where, r] of relatedRefs) if (!ids.has(r)) err(`${where}: related id ${r} does not exist`);

const technical = load('technical.json');
for (const sec of technical.sections) {
  if (sec.relatedNode && !ids.has(sec.relatedNode)) err(`technical ${sec.id}: unknown relatedNode ${sec.relatedNode}`);
  for (const row of sec.rows) {
    const where = `technical ${sec.id} / ${row.label}`;
    if (!STATUSES.has(row.status)) err(`${where}: bad status ${row.status}`);
    for (const s of row.sources) if (!sourceById.has(s)) err(`${where}: unknown source ${s}`);
    if (row.status !== 'unverified' && !row.sources.length) err(`${where}: status '${row.status}' needs sources`);
    if (row.status === 'verified' && !row.sources.some((s) => sourceById.get(s)?.reliability === 'primary' && sourceById.get(s)?.accessed)) err(`${where}: 'verified' requires an accessed primary source`);
  }
}
for (const st of technical.identification.steps) for (const s of st.sources) if (!sourceById.has(s)) err(`identification step: unknown source ${s}`);
// Phase 9 glossary: plain-English terms linked to records. Explanations only; they carry no status.
const terms = new Set();
for (const g of technical.glossary ?? []) {
  if (!g.term || !g.text) err(`glossary: entry needs term and text`);
  if (terms.has(g.term)) err(`glossary: duplicate term ${g.term}`);
  terms.add(g.term);
  for (const r of g.related ?? []) if (!ids.has(r)) err(`glossary ${g.term}: unknown related id ${r}`);
  for (const s of g.sources ?? []) if (!sourceById.has(s)) err(`glossary ${g.term}: unknown source ${s}`);
}

const sup = load('suppliers.json');
const MATCHES = new Set(['exact', 'agco-ref', 'book-ref', 'listed-fit', 'check-fit']);
const normNumber = (x) => String(x).toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/^(\d+)[MV](\d*)$/, '$1X$2');
const supplierIds = new Set();
for (const s of sup.suppliers) {
  if (!ID_RE.test(s.id)) err(`supplier ${s.id}: id must be kebab-case`);
  if (supplierIds.has(s.id)) err(`duplicate supplier id ${s.id}`);
  supplierIds.add(s.id);
  if (!/^https:\/\//.test(s.url ?? '')) err(`supplier ${s.id}: url must be https`);
  if (!sourceById.has(s.source)) err(`supplier ${s.id}: unknown source ${s.source}`);
}
const supCounts = { total: 0, byMatch: {} };
for (const [i, r] of sup.references.entries()) {
  const where = `suppliers.references[${i}] (${r.node} / ${r.supplierPartNumber})`;
  if (!ids.has(r.node)) err(`${where}: unknown node ${r.node}`);
  if (!supplierIds.has(r.supplier)) err(`${where}: unknown supplier ${r.supplier}`);
  if (!r.title || !r.supplierPartNumber) err(`${where}: needs title and supplierPartNumber`);
  if (!/^https:\/\//.test(r.url ?? '')) err(`${where}: url must be https`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.checked ?? '')) err(`${where}: checked must be an ISO date`);
  if (!MATCHES.has(r.match)) err(`${where}: bad match grade ${r.match}`);
  if (!sourceById.has(r.source) || !sourceById.get(r.source).accessed) err(`${where}: must cite an accessed source`);
  if (!Array.isArray(r.oemQuoted)) err(`${where}: oemQuoted must be an array`);
  if (r.price !== null && (typeof r.price !== 'object' || typeof r.price.exVat !== 'number' || r.price.currency !== 'GBP')) err(`${where}: price must be null or {exVat:number, incVat, currency:'GBP'}`);
  const oem = nodeOem.get(r.node);
  const exactHit = !!oem && (r.oemQuoted ?? []).some((q) => normNumber(q) === normNumber(oem));
  if (r.match === 'exact' && !exactHit) err(`${where}: 'exact' needs a quoted OEM number equal to the node's original (819045) number`);
  if (r.match !== 'exact' && exactHit) err(`${where}: quoted number equals the original part number, grade it 'exact'`);
  const nums = (nodeNumbers.get(r.node) ?? []).map(normNumber);
  const hit = !exactHit && (r.oemQuoted ?? []).some((q) => nums.includes(normNumber(q)));
  if (r.match === 'agco-ref' && !hit) err(`${where}: 'agco-ref' needs a quoted OEM number matching the node's AGCO/OEM numbers`);
  if (r.match !== 'agco-ref' && hit && r.match !== 'exact') err(`${where}: quoted number matches the node's AGCO number, grade it 'agco-ref'`);
  const bookNums = (nodeBookNumbers.get(r.node) ?? []).map(normNumber);
  const bookHit = !hit && !exactHit && (r.oemQuoted ?? []).some((q) => bookNums.includes(normNumber(q)));
  if (r.match === 'book-ref' && !bookHit) err(`${where}: 'book-ref' needs a quoted OEM number matching the node's parts-book numbers`);
  if (r.match !== 'book-ref' && r.match !== 'agco-ref' && r.match !== 'exact' && bookHit) err(`${where}: quoted number matches one of the node's parts-book numbers, grade it 'book-ref'`);
  supCounts.total++;
  supCounts.byMatch[r.match] = (supCounts.byMatch[r.match] ?? 0) + 1;
}

if (errors.length) {
  console.error(`Data validation FAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`OK: ${sources.length} sources, ${axes.size} variant axes, ${counts.total} hierarchy nodes`);
console.log('   by status:', JSON.stringify(counts.byStatus), `· ${counts.partsBook ?? 0} nodes with parts-book references · ${counts.oem ?? 0} original numbers from 819045`);
console.log(`   suppliers: ${sup.suppliers.length}, references: ${supCounts.total}`, JSON.stringify(supCounts.byMatch));
