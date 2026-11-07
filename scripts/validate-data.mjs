#!/usr/bin/env node
// Validates the research data in data/*.json.
// Usage: node scripts/validate-data.mjs        (exit code 1 on any error)
// Checks: unique stable IDs, allowed kinds and verification statuses,
// every cited source exists in the register, appliesTo uses known variant
// axes/options, and no unverified source is used as the sole support for a
// "verified" status.

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
const counts = { total: 0, byStatus: {} };
(function walk(node, path) {
  const where = [...path, node.id].join(' > ');
  if (!ID_RE.test(node.id)) err(`${where}: id must be kebab-case`);
  if (ids.has(node.id)) err(`${where}: duplicate id ${node.id}`);
  ids.add(node.id);
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
  for (const [axis, opts] of Object.entries(node.appliesTo ?? {})) {
    if (!axes.has(axis)) err(`${where}: appliesTo unknown axis ${axis}`);
    else for (const o of opts) if (!axes.get(axis).has(o)) err(`${where}: appliesTo ${axis} unknown option ${o}`);
  }
  if (node.kind !== 'tractor') {
    counts.total++;
    counts.byStatus[status] = (counts.byStatus[status] ?? 0) + 1;
  }
  for (const c of node.children ?? []) walk(c, [...path, node.id]);
})(tree, []);

if (errors.length) {
  console.error(`Data validation FAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`OK: ${sources.length} sources, ${axes.size} variant axes, ${counts.total} hierarchy nodes`);
console.log('   by status:', JSON.stringify(counts.byStatus));
