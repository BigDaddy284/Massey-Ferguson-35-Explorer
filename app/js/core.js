/*
 * MF35 Explorer core logic: pure functions, no DOM.
 * Loaded as a classic script in the browser (window.MF35Core) and with
 * require() in Node for tests. Keep it free of browser APIs.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MF35Core = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STATUS_LABELS = {
    'verified': 'Verified',
    'partially-verified': 'Partially verified',
    'unverified': 'Unverified',
    'variant-dependent': 'Variant dependent'
  };

  /* ---------- Hierarchy ---------- */

  /** Flatten the nested tree into an id -> node map with parent and path info. */
  function indexHierarchy(rootNode) {
    var byId = {};
    var order = [];
    (function walk(node, parent, depth, path) {
      var entry = {
        id: node.id,
        node: node,
        parentId: parent ? parent.id : null,
        depth: depth,
        path: path.concat(node.id),
        childIds: (node.children || []).map(function (c) { return c.id; })
      };
      byId[node.id] = entry;
      order.push(node.id);
      (node.children || []).forEach(function (c) { walk(c, node, depth + 1, entry.path); });
    })(rootNode, null, 0, []);
    return { byId: byId, order: order, rootId: rootNode.id };
  }

  /** The system (depth-1 ancestor) that a node belongs to. */
  function systemOf(index, id) {
    var e = index.byId[id];
    if (!e) return null;
    return e.path.length > 1 ? index.byId[e.path[1]] : null;
  }

  /** Effective status: omitted means unverified. */
  function statusOf(node) {
    return node.status || 'unverified';
  }

  /** All appliesTo constraints on a node and its ancestors, merged (AND across levels). */
  function inheritedAppliesTo(index, id) {
    var e = index.byId[id];
    var merged = {};
    e.path.forEach(function (pid) {
      var a = index.byId[pid].node.appliesTo;
      if (!a) return;
      Object.keys(a).forEach(function (axis) {
        merged[axis] = merged[axis] ? merged[axis].filter(function (o) { return a[axis].indexOf(o) !== -1; }) : a[axis].slice();
      });
    });
    return merged;
  }

  /* ---------- Configuration ---------- */

  var AXIS_KEYS = ['engine', 'clutch', 'pto', 'chassis', 'electrics', 'coldStart', 'diffLock'];

  /**
   * Resolve the active configuration.
   * Owner values (data file merged with any local overrides) take precedence;
   * null owner values fall back to defaultTarget and are flagged as assumed.
   * PTO is always derived from the clutch when the clutch is known.
   */
  function resolveConfiguration(config, overrides) {
    var owner = Object.assign({}, config.ownerTractor, overrides || {});
    var ptoAxis = config.variantAxes.filter(function (a) { return a.id === 'pto'; })[0];
    var values = {};
    var confirmed = {};
    AXIS_KEYS.forEach(function (axis) {
      var v = owner[axis];
      if (axis === 'pto' && owner.clutch && ptoAxis) {
        var derived = ptoAxis.options.filter(function (o) { return o.whenClutch === owner.clutch; })[0];
        if (derived) v = derived.id;
      }
      if (v !== null && v !== undefined && v !== '') {
        values[axis] = v;
        // engine and chassis in the data file are provisional/assumed, not confirmed
        confirmed[axis] = !(axis === 'engine' && owner.engineStatus === 'provisional' && !(overrides && overrides.engine)) &&
                          !(axis === 'chassis' && owner.chassisStatus === 'assumed' && !(overrides && overrides.chassis));
      } else {
        values[axis] = config.defaultTarget[axis];
        confirmed[axis] = false;
      }
    });
    var inScope = {};
    config.variantAxes.forEach(function (a) {
      inScope[a.id] = a.options.filter(function (o) { return !o.outOfScope; }).map(function (o) { return o.id; });
    });
    return { values: values, confirmed: confirmed, owner: owner, inScope: inScope };
  }

  /**
   * Applicability of a node in a resolved configuration.
   * Returns { applies: bool, variant: bool, axes: [...] }:
   *   applies  - fits the drawn configuration
   *   variant  - depends on an axis the owner has not confirmed
   */
  function applicability(index, id, resolved) {
    var constraints = inheritedAppliesTo(index, id);
    var axes = Object.keys(constraints);
    var applies = true;
    var variant = false;
    axes.forEach(function (axis) {
      if (constraints[axis].indexOf(resolved.values[axis]) === -1) applies = false;
      // An unconfirmed axis only makes a part variant dependent if the part
      // excludes some in-scope option of that axis. (Every engine part lists
      // only the 23C, the sole in-scope engine, so the provisional engine
      // does not turn the whole engine into "variant dependent".)
      var inScope = (resolved.inScope && resolved.inScope[axis]) || [];
      var excludesInScope = inScope.some(function (o) { return constraints[axis].indexOf(o) === -1; });
      if (!resolved.confirmed[axis] && excludesInScope) variant = true;
    });
    return { applies: applies, variant: variant, axes: axes };
  }

  /** Status to display, taking unconfirmed variants into account. */
  function displayStatus(index, id, resolved) {
    if (applicability(index, id, resolved).variant) return 'variant-dependent';
    return statusOf(index.byId[id].node);
  }

  /* ---------- Serial numbers ---------- */

  /**
   * Parse a tractor serial such as "SDM 105432", "sdm105432" or "105432".
   * Returns { prefix, number, letters: [{position, letter, meaning, axis, option}], year, inTargetYear, warnings }.
   */
  function decodeSerial(input, config, technical) {
    var result = { input: input, prefix: null, number: null, letters: [], year: null, inTargetYear: false, axisValues: {}, warnings: [] };
    var s = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    var m = s.match(/^([A-Z]{0,4})(\d{1,7})$/);
    if (!m) {
      result.warnings.push('Could not read that as a serial number. Expected letters followed by digits, for example SDM 105432.');
      return result;
    }
    result.prefix = m[1] || null;
    result.number = parseInt(m[2], 10);
    var table = (technical && technical.identification && technical.identification.prefixLetters) || [];
    if (result.prefix) {
      result.prefix.split('').forEach(function (letter, i) {
        var pos = i + 1;
        var hit = table.filter(function (r) { return r.position === pos && r.letter === letter; })[0];
        if (hit) {
          result.letters.push(hit);
          if (hit.option) result.axisValues[hit.axis] = hit.option;
        } else {
          result.letters.push({ position: pos, letter: letter, meaning: null, axis: null, option: null });
          result.warnings.push('Letter "' + letter + '" in position ' + pos + ' is not in the documented prefix table.');
        }
      });
      if (result.prefix.length !== 3) result.warnings.push('Most documented prefixes have three letters (chassis, fuel, clutch). Check the plate again.');
    }
    var years = (config.productionYears || []).slice().sort(function (a, b) { return a.firstSerial - b.firstSerial; });
    for (var i = 0; i < years.length; i++) {
      if (result.number >= years[i].firstSerial) result.year = years[i].year;
    }
    if (years.length && result.number < years[0].firstSerial) {
      result.year = null;
      result.warnings.push('This number is below the first documented Coventry serial (' + years[0].firstSerial + ').');
    }
    result.inTargetYear = result.year === 1958;
    if (result.year && result.year !== 1958) {
      result.warnings.push('This serial falls in the ' + result.year + ' range, not 1958 (79553–125067). Compatibility notes in this app assume a 1958 tractor.');
    }
    if (result.axisValues.engine && result.axisValues.engine !== 'std-23c-diesel') {
      result.warnings.push('The fuel letter does not indicate the Standard 23C diesel this app is built around.');
    }
    return result;
  }

  /* ---------- Search ---------- */

  function normalise(s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  // UK/US and trade synonyms so "tire", "fender" or "oil pan" still find records.
  var SYNONYMS = {
    tire: 'tyre', tires: 'tyres', fender: 'mudguard', fenders: 'mudguards', hood: 'bonnet',
    'pan': 'sump', wrist: 'gudgeon', sleeve: 'liner', sleeves: 'liners', generator: 'dynamo',
    gas: 'petrol', gasoline: 'petrol', transmission: 'gearbox', hitch: 'linkage',
    glow: 'heater', crank: 'crankshaft', diff: 'differential', conrod: 'connecting rod',
    headgasket: 'head gasket'
  };

  /** Optimal string alignment distance, capped for speed. */
  function editDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var d = [];
    for (var i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (var j = 0; j <= b.length; j++) { d[0][j] = j; }
    for (i = 1; i <= a.length; i++) {
      var rowMin = Infinity;
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        if (d[i][j] < rowMin) rowMin = d[i][j];
      }
      if (rowMin > max) return max + 1;
    }
    return d[a.length][b.length];
  }

  /**
   * Build a search index over hierarchy nodes and technical rows.
   * Each document: { kind, id, title, fields: [{text, weight}] }.
   */
  function buildSearchIndex(index, sourcesById, technical, suppliers) {
    var docs = [];
    var supByNode = supplierRefsByNode(suppliers);
    index.order.forEach(function (id) {
      var e = index.byId[id];
      var n = e.node;
      if (e.depth === 0) return;
      var pathNames = e.path.slice(1, -1).map(function (pid) { return index.byId[pid].node.name; }).join(' ');
      var fields = [
        { text: n.name, weight: 10 },
        { text: n.id.replace(/-/g, ' '), weight: 6 },
        { text: (n.supplierClaimedOem || []).join(' '), weight: 9, raw: (n.supplierClaimedOem || []) },
        { text: (n.oemPartNumber || ''), weight: 10, raw: n.oemPartNumber ? [n.oemPartNumber] : [] },
        { text: (n.replacementReferences || []).map(function (r) { return r.number; }).join(' '), weight: 9, raw: (n.replacementReferences || []).map(function (r) { return r.number; }) },
        { text: (n.replacementReferences || []).map(function (r) { return r.description; }).join(' '), weight: 2 },
        { text: (n.partsBookReferences || []).map(function (r) { return r.number; }).join(' '), weight: 9, raw: (n.partsBookReferences || []).map(function (r) { return r.number; }) },
        { text: (n.partsBookReferences || []).map(function (r) { return r.description; }).join(' '), weight: 2 },
        { text: pathNames, weight: 3 },
        { text: n.description || '', weight: 3 },
        { text: n.function || '', weight: 2 },
        { text: n.location || '', weight: 1 },
        { text: n.failure || '', weight: 1 },
        { text: n.specifications ? Object.keys(n.specifications).map(function (k) { return k + ' ' + n.specifications[k]; }).join(' ') : '', weight: 2 },
        { text: n.notes || '', weight: 2 },
        { text: n.kind, weight: 1 },
        { text: (supByNode[id] || []).map(function (r) { return r.supplierPartNumber; }).join(' '), weight: 8, raw: (supByNode[id] || []).map(function (r) { return r.supplierPartNumber; }) },
        { text: (supByNode[id] || []).map(function (r) { return (r.oemQuoted || []).join(' '); }).join(' '), weight: 6, raw: [].concat.apply([], (supByNode[id] || []).map(function (r) { return r.oemQuoted || []; })) },
        { text: (supByNode[id] || []).map(function (r) { return r.title; }).join(' '), weight: 2 }
      ];
      docs.push({ kind: 'component', id: id, title: n.name, fields: prep(fields) });
    });
    if (technical) {
      technical.sections.forEach(function (sec) {
        sec.rows.forEach(function (row, i) {
          if (row.display === false) return;
          docs.push({
            kind: 'technical', id: sec.id + ':' + i, sectionId: sec.id, title: row.label + ' (' + sec.title + ')',
            fields: prep([{ text: row.label, weight: 8 }, { text: sec.title, weight: 4 }, { text: row.value || '', weight: 3 }])
          });
        });
      });
    }
    return docs;

    function prep(fields) {
      return fields.filter(function (f) { return f.text; }).map(function (f) {
        var norm = normalise(f.text);
        return { weight: f.weight, norm: norm, tokens: norm.split(' '), compact: (f.raw || []).map(function (r) { return normalise(r).replace(/ /g, ''); }) };
      });
    }
  }

  /**
   * Search with partial matching and spelling tolerance.
   * Scoring per query token: exact token > prefix > substring > fuzzy (edit distance).
   * Every query token must match somewhere for a document to be returned.
   */
  function search(docs, query, limit) {
    var q = normalise(query);
    if (!q) return [];
    var qTokens = q.split(' ').map(function (t) { return SYNONYMS[t] ? normalise(SYNONYMS[t]) : t; }).join(' ').split(' ').filter(Boolean);
    var qCompact = q.replace(/ /g, '');
    var results = [];
    docs.forEach(function (doc) {
      var total = 0;
      var allMatched = true;
      // Part-number style query: compare compacted strings ("184473 m1" == "184473m1")
      var partHit = 0;
      doc.fields.forEach(function (f) {
        f.compact.forEach(function (c) {
          if (c === qCompact) partHit = Math.max(partHit, 100);
          else if (qCompact.length >= 4 && c.indexOf(qCompact) === 0) partHit = Math.max(partHit, 60);
        });
      });
      qTokens.forEach(function (qt) {
        var best = 0;
        doc.fields.forEach(function (f) {
          f.tokens.forEach(function (t) {
            var s = 0;
            if (t === qt) s = 1;
            else if (qt.length >= 2 && t.indexOf(qt) === 0) s = 0.8;
            else if (qt.length >= 3 && t.indexOf(qt) > 0) s = 0.5;
            else if (qt.length >= 4) {
              var max = qt.length >= 7 ? 2 : 1;
              var dist = editDistance(qt, t.slice(0, Math.max(qt.length, Math.min(t.length, qt.length + max))), max);
              var distFull = editDistance(qt, t, max);
              var dmin = Math.min(dist, distFull);
              if (dmin <= max) s = dmin === 1 ? 0.45 : 0.3;
            }
            if (s * f.weight > best) best = s * f.weight;
          });
        });
        if (best === 0) allMatched = false;
        total += best;
      });
      if ((allMatched && total > 0) || partHit) {
        results.push({ doc: doc, score: total + partHit });
      }
    });
    results.sort(function (a, b) { return b.score - a.score || a.doc.title.localeCompare(b.doc.title); });
    return results.slice(0, limit || 50);
  }

  /* ---------- Coverage ---------- */

  // modelledIds (optional): hierarchy ids that have their own 3D object.
  /**
   * Drawn diagrams (Phase 6) that show a part: the diagram where the part itself is a numbered
   * item (exact), or where an ancestor is the item it is drawn inside. Nearest first.
   */
  function diagramRefs(index, diagrams, id) {
    var e = index.byId[id];
    if (!e || !diagrams) return [];
    var out = [];
    Object.keys(diagrams).forEach(function (did) {
      var d = diagrams[did];
      var best = null;
      (d.items || []).forEach(function (it) {
        var pos = e.path.indexOf(it.id);
        if (pos === -1) return;
        if (!best || pos > best.pos) best = { diagram: did, title: d.title, n: it.n, item: it.id, exact: it.id === id, pos: pos };
      });
      if (best) out.push(best);
    });
    out.sort(function (a, b) { return (b.exact - a.exact) || (b.pos - a.pos); });
    return out.map(function (r) { return { diagram: r.diagram, title: r.title, n: r.n, item: r.item, exact: r.exact }; });
  }

  /** Group supplier references by hierarchy id: { id: [ref, ...] }. */
  function supplierRefsByNode(suppliers) {
    var out = {};
    ((suppliers && suppliers.references) || []).forEach(function (r) {
      (out[r.node] = out[r.node] || []).push(r);
    });
    return out;
  }

  /** Normalise an AGCO/MF number so 1884123M1 and 1884123V1 compare equal. */
  function normaliseNumber(x) {
    return String(x).toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/^(\d+)[MV](\d*)$/, '$1X$2');
  }

  var MATCH_LABELS = { 'exact': 'Exact match (819045)', 'agco-ref': 'Matches AGCO number', 'book-ref': 'Matches a parts-book number', 'listed-fit': 'Listed for the FE35', 'check-fit': 'Check fit' };
  var MATCH_ORDER = { 'exact': 0, 'agco-ref': 1, 'book-ref': 2, 'listed-fit': 3, 'check-fit': 4 };

  function coverage(index, modelledIds, diagrams, suppliers) {
    var supByNode = supplierRefsByNode(suppliers);
    var inModel = {};
    (modelledIds || []).forEach(function (id) { inModel[id] = true; });
    var bySystem = {};
    index.order.forEach(function (id) {
      var e = index.byId[id];
      if (e.depth === 0) return;
      var sys = e.path[1];
      var c = bySystem[sys] = bySystem[sys] || { total: 0, 'verified': 0, 'partially-verified': 0, 'unverified': 0, 'variant-dependent': 0, oem: 0, replacement: 0, partsBook: 0, described: 0, diagram: 0, model: 0, supplier: 0 };
      c.total++;
      if ((e.node.partsBookReferences || []).length) c.partsBook++;
      if ((supByNode[id] || []).length) c.supplier++;
      if (diagrams && diagramRefs(index, diagrams, id).length) c.diagram++;
      if (e.node.description && e.node.function) c.described++;
      c[statusOf(e.node)]++;
      if (e.node.oemPartNumber) c.oem++;
      if ((e.node.replacementReferences || []).length) c.replacement++;
      if (inModel[id]) c.model++;
    });
    return bySystem;
  }

  return {
    STATUS_LABELS: STATUS_LABELS,
    AXIS_KEYS: AXIS_KEYS,
    indexHierarchy: indexHierarchy,
    systemOf: systemOf,
    statusOf: statusOf,
    inheritedAppliesTo: inheritedAppliesTo,
    resolveConfiguration: resolveConfiguration,
    applicability: applicability,
    displayStatus: displayStatus,
    decodeSerial: decodeSerial,
    normalise: normalise,
    editDistance: editDistance,
    buildSearchIndex: buildSearchIndex,
    search: search,
    coverage: coverage,
    diagramRefs: diagramRefs,
    supplierRefsByNode: supplierRefsByNode,
    normaliseNumber: normaliseNumber,
    MATCH_LABELS: MATCH_LABELS,
    MATCH_ORDER: MATCH_ORDER
  };
});
