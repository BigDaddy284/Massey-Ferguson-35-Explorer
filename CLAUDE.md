# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MF35 Explorer: a browser-based interactive 3D anatomy and parts catalogue for **one specific
tractor**, a 1958 Coventry-built Massey Ferguson 35 with the Standard 23C 4-cylinder diesel. It
must open locally in a normal browser. The planned stack is Three.js, HTML5, CSS3 and
JavaScript/TypeScript.

## Governing documents (read the relevant section before starting a phase)

The owner's project CLAUDE.md is kept verbatim as `docs/spec/PRODUCT_SPEC.md` and imported here, so it loads in every session:

@docs/spec/PRODUCT_SPEC.md

- `docs/spec/PRODUCT_SPEC.md`: the owner's product specification (diesel-specific). **Takes
  precedence** where it differs from DESIGN.md.
- `docs/spec/DESIGN.md`: the earlier, broader design spec (also covers petrol/TVO). It is used for
  layout and UX intent.
- `docs/research/09-parts-book-819045.md`: how the AGCO 819045 parts book was read, its 23C page map and the
  rules that decided which row is a component's original number.
- `docs/research/06-agco-heritage-2008.md`: current AGCO supply numbers for 35/23C parts from the
  2008 Heritage catalogue (SRC-038), stored on nodes as `replacementReferences`.
- `docs/research/01–05`: Phase 1 findings. They override the spec's *assumed* scope lists where
  research contradicts them (for example, the 23C camshaft is chain-driven, not gear-driven).

Development follows the spec's roadmap (§15) **strictly in phase order**, one task at a time, with
research, build, test and verify before moving on. Current status: **Phase 9 (final polish) built: on-demand 3D rendering and a deferred model start, phone and tablet layouts (folding tractor banner, stacked tables, taller viewer), record quick links and folded reference lists, search "see all" into the catalogue, PTO and hydraulic power-flow diagrams and a glossary (`technical.json` `glossary`, searchable, validated). Phases 1–8 as before: 716 rows of the AGCO MF35/35X parts book 819045 (SRC-032) on 213 nodes, 135 original numbers, the completeness report (`npm run report`). Next: bring the 3D model's part shapes and positions into line with the workshop manual (SRC-035) and then with photographs of 1958 De Luxe tractors.**

## Commands

```bash
npm run validate        # check data/*.json (sources, statuses, ids, appliesTo)
npm run build           # validate, then regenerate app/data/mf35-data.js from data/*.json
npm test                # node:test suite for app/js/core.js (tests/*.test.js)
node --test tests/core.test.js   # single test file
npm run serve           # optional: http://localhost:8035 (python3); the app also works opened directly
npm run smoke           # Playwright check of every view at 1440/820/390 px: no page errors, no sideways scroll
npm run diagrams        # regenerate app/data/mf35-diagrams.js from the 3D model (needs Playwright + Chromium)
```

No dependencies, no bundler (Node >= 18). **After any edit to `data/*.json`, run `npm run build`.**
The app reads only the generated `app/data/mf35-data.js`, which is committed. Open
`app/index.html` directly in a browser. It must keep working from `file://`, so use classic
`<script>` tags only: no ES modules and no `fetch()` of local files.

## Architecture

The data is kept strictly separate from the UI and 3D code (spec §11):

- `data/sources.json`: research source register (`SRC-NNN`). Each source has a `reliability`
  grade (`primary` / `secondary-reference` / `supplier` / `community` / `aggregator`) and an
  `accessed` flag. Ids are never renumbered.
- `data/configurations.json`: variant axes (engine, clutch, pto, chassis, electrics, coldStart,
  diffLock), Coventry serial breaks, year-start serials, the `ownerTractor` profile (nulls =
  unknown) and the `defaultTarget` used for drawing.
- `data/hierarchy.json`: nested tree `tractor > system > assembly > subassembly > component`.
  The node `id` is the permanent key shared by the catalogue record, the 3D object name and
  diagram references. `appliesTo: {axis: [options]}` restricts a node to configurations (keys
  ANDed, values ORed).
  Phase 5 fields on every node: `description`, `function`, `location`, `failure` (plain-English
  explanations; they never change `status`) and `related` (hierarchy ids shown as "Connected parts"
  chips). `specifications` holds measured values only, each node citing the source it came from.

- `partsBookReferences` on hierarchy nodes come from two books, told apart by `book`:
  - `book:'TO35'` (Phase 8): `{number, description, qty, source:'SRC-041', page, pdfPage, confidence, note?, heritage?,
    inBook819045}` read from the page images of the Ferguson TO35 parts book (US-built TO35; its Standard Motors Diesel is
    the 23C). `confidence` is `listed` for engine pages and `possible` for chassis/electrical rows. `heritage` marks a
    number whose base digits also appear in the node's 2008 AGCO `replacementReferences`; `inBook819045` says whether the
    number appears anywhere in 819045 (false usually means 819045 lists a later supersession number).
  - `book:'MF35'`: `{number, description, qty, source:'SRC-032', page, item?, letters?, condition?, bookNote?, note?,
    primary?}` read from the owner's text copy of the AGCO MF35/35X parts book 819045 (kept in the private project
    library, never in the repo). `condition` carries the book's serial or engine-number footnote verbatim. Exactly one
    row per node may be `primary`: it sets `oemPartNumber` and `quantity`, and the node becomes `verified` (unless it is
    `variant-dependent`). A row was made primary only when it names the 23C (or no engine) and any serial condition
    covers the whole 1958 Coventry range 79553–125067; (J)/(N) "to service 829420M91" rows were preferred over the later
    (K)/(P) rows. Splits inside 1958 (e.g. 111443/111444, 107892/107893, 117267/117268) or on the 23C engine number
    (SJ…E, except the first few thousand engines) leave `oemPartNumber` null, every candidate listed, and a
    `partsBookNote` on the node saying why. `docs/research/09-parts-book-819045.md` records the method and the page map.
  The validator checks the book, the source per book, the number pattern, the page, one primary = `oemPartNumber`,
  and that every `verified` component has a primary. The mapping was produced by scripts kept outside the repo; edit the
  JSON directly for corrections.
- `scripts/completeness-report.mjs` (`npm run report`): writes `docs/research/08-completeness-report.md` (spec §16):
  totals and per-system coverage, fasteners, parts not in 3D, parts with no number, assemblies without diagrams,
  one-way related links, variant axis use, supplier grades, a 3D placement audit against the manual's layout, and
  unresolved items. Re-run it after data or model changes. The Research Status page shows a live summary.
- `data/technical.json`: Technical Information rows (value + status + sources; `display:false`
  rows are withheld) and the Identification guide (steps, serial prefix letter table), plus `glossary` (Phase 9: `{term, text, related[], sources[]}`,
  plain-English explanations with no status; the validator checks related ids and sources). The PTO and hydraulics
  power-flow diagrams are `FLOWS` in app.js: boxes are hierarchy ids and the wording repeats the cited explainer.
- `data/suppliers.json` (Phase 7): `suppliers` (UK suppliers, each citing a `supplier`-grade source) and
  `references` (`{node, supplier, title, supplierPartNumber, oemQuoted[], url, price{exVat,incVat,currency},
  stock, checked, match, fits, notes, source}`). `match` is `exact` (a quoted OEM number equals the node's
  `oemPartNumber` from 819045 once the M/V suffix letter is normalised, e.g. 827707M5 = 827707V5), `agco-ref`
  (equals one of the node's 2008 `replacementReferences`), `book-ref` (equals another `partsBookReferences`
  number: a TO35 number or a non-primary 819045 row), `listed-fit` (listed by the supplier for the FE35, fit is
  the supplier's claim) or `check-fit` (listed, but with a known reason to check; see `notes`).
  The validator enforces node/supplier existence, https URLs, the checked date, the grade list, and that
  `exact` / `agco-ref` / `book-ref` are used exactly when a quoted number matches. Prices and stock are as seen on `checked`.
- `app/js/core.js`: pure logic, loaded in the browser as `window.MF35Core` and through `require` in tests.
  It covers hierarchy indexing, configuration resolution, applicability, serial decoding, fuzzy search
  and coverage. Put anything testable here.
- Purchase options (Phase 7): the record panel's "Purchase options (UK)" section lists the node's references
  sorted exact → agco-ref → book-ref → listed-fit → check-fit (`core.MATCH_ORDER`) with price, stock, quoted OEM numbers (matched number highlighted),
  fitment, notes and the checked date; the catalogue has a "UK suppliers" column; Research Status has a
  "With UK purchase references" stat, a "UK refs" column and a "UK suppliers checked" table. Search covers
  supplier part numbers and quoted OEM numbers. `core.supplierRefsByNode`, `core.normaliseNumber`,
  `core.MATCH_LABELS`; `coverage(..., suppliers).supplier`.
- `app/js/app.js`: DOM/UI only. It uses hash routing (`#/anatomy/<id>`, `#/catalogue`, `#/technical/<section>`,
  `#/identification`, `#/tractor`, `#/research/<SRC-id>`), and the views are string-rendered. "My Tractor"
  entries are saved in `localStorage` (`mf35.owner.v1`) as overrides on `ownerTractor`. They only
  last per browser. Permanent facts go into `data/configurations.json`.
- `app/js/model.js`: the original procedural model (`window.MF35Model.build(THREE)`). Every mesh sits
  in a group named with a hierarchy id. Variant parts (both clutches, cold-climate items, diff lock)
  are all built; the viewer hides the ones not fitted. Proportions come from SRC-035 B.1; see
  `docs/model/README.md` for what is measured and what is approximate.
- `app/js/viewer.js`: Three.js scene, OrbitControls, picking, highlight, hide, isolate, X-ray
  (casing list in model.js), auto see-through for parts blocking the selection, camera presets.
  The anatomy view moves one persistent viewer element into each re-render (no WebGL re-creation).
  Without WebGL it falls back to the SVG schematic.
- Exploded views (Phase 4, viewer.js): `setExplode({scope, depth, t})` moves meshes from their
  stored home positions. Directions come from `EXPLODE` hints in model.js (metres at full explode,
  relative to the parent; `'mirror'` flips z for the LH side), otherwise radially from the parent's
  centre. Children sharing the parent's centre stack along `EXPLODE_AXIS`. LH/RH halves of a part
  split apart. Exploding one assembly ghosts the rest. Numbered callouts with leader lines and the
  exploded parts list use `explodeRefs()`. `#/exploded/<id>` opens an assembly exploded. The layout is
  a presentation choice, not a dismantling procedure.
- Drawn diagrams (Phase 6): `scripts/build-diagrams.mjs` drives headless Chromium, loads the app, and runs
  `scripts/diagram-gen.js` against the live viewer for each assembly in its `DIAGRAMS` list. The generator
  explodes the assembly (same `setExplode`/`explodeRefs` as the 3D view, so the numbers match), projects
  every mesh orthographically, and writes an SVG: silhouette loops filled per mesh in painter's order,
  crease lines above 32°, casings that stay in place drawn dashed and see-through, numbered callouts in the
  margins aimed at the nearest visible face. Output is committed as `app/data/mf35-diagrams.js`
  (`window.MF35_DIAGRAMS`, about 0.8 MB). **Regenerate it after any change to model.js or the explode
  hints.** The app shows them at `#/diagram/<id>[/<part>]`; `core.diagramRefs()` maps a part to its
  diagrams and item numbers; coverage counts `diagram`. Playwright is not a dependency of the app.
- `app/vendor/three/`: Three.js r147 (MIT), the last release with a classic `three.min.js` and
  `examples/js/OrbitControls.js`. Don't upgrade without replacing those with a non-module build.
- `window.MF35Explorer.viewer()` is a read-only handle for browser tests.

How the pieces connect: the app resolves the active configuration as `ownerTractor`, falling
back to `defaultTarget` for each null axis. It filters the hierarchy by `appliesTo`. A node is shown as *variant dependent* only if it
depends on an unconfirmed axis **and** excludes some in-scope option of that axis. Engine parts list
only the 23C, the sole in-scope engine, so they don't all become variant dependent. The rules
are in `docs/research/03-configuration-rules.md`.

## Non-negotiable accuracy rules

These are enforced by the validator where possible.

- Verification statuses are exactly `verified`, `partially-verified`, `unverified` and
  `variant-dependent`. An omitted status means `unverified`.
- `verified` requires at least one **accessed `primary`** source (AGCO parts book, service manual
  or operator book). Two have been read: the FE-35/MF35 workshop service manual scan (SRC-035), whose
  technical figures are `verified`, and the AGCO MF35/35X parts book 819045 (SRC-032). A hierarchy
  component is `verified` only when its `oemPartNumber` and `quantity` come from a `primary` 819045 row
  that applies to the whole 1958 Coventry serial range; otherwise it stays at most `partially-verified`.
- A status other than `unverified` must cite sources.
- OEM numbers quoted by suppliers or forums go in `supplierClaimedOem`, never in `oemPartNumber`.
  `oemPartNumber` is set only from a `primary` 819045 row (SRC-032).
- Supplier listings never set `oemPartNumber`. A supplier's quoted OEM number lives in `suppliers.json`
  `oemQuoted`; the UI shows it as the supplier's quote, highlighted only when it equals the original or an AGCO number.
- Numbers from the 2008 AGCO Heritage catalogue (SRC-038) go in `replacementReferences`
  (`{number, description, models, source, page, confidence}`), never in `oemPartNumber`: they are
  the numbers AGCO supplied the part under in 2008 and may supersede the 1958 number. `confidence`
  is `listed` when the row names the 23C / 35 diesel / FE35 or the 35 without an engine
  restriction, and `possible` when it depends on a US serial range or does not name the engine.
  The validator checks each one cites an accessed source and never repeats `oemPartNumber`.
- Never present missing data as confirmed in the UI. Show "not yet documented" instead.
- The Perkins 3.152/A3.152 is **not** 1958 equipment (introduced 1959, c. serial 165596).
- Live PTO depends on the dual-stage clutch. The owner reports dual-clutch behaviour
  and reports the clutch letter M on the serial plate (`clutchStatus: plate-letter-reported`). The full prefix and number are still unknown, so it stays labelled as owner-reported.
- Do not apply US-built MF35 serial breaks to Coventry serials.
- Do not reproduce copyrighted AGCO diagrams or text. Diagrams and 3D assets must be original.
- Torques come from the workshop manual (SRC-035 B.29–B.30) in lb ft. SRC-006's "Nm" figures mix
  units and must not be used.
- The FE-35 manual's engine code for the Perkins 3-A-152 is **N**, not P (SRC-035 B.1).

## Conventions

- Ids are kebab-case and stable. Never derive an id from a supplier or OEM number.
- New facts: add or extend a source in `data/sources.json` (`extracted`, `conflicts`,
  `dateResearched`), cite it from the data, then validate.
- Record conflicting information rather than silently picking one value.
- UK English in user-facing text (tyre, colour, catalogue).
- UI theme is blue / silver / black / grey (the owner's choice, which overrides the spec's "MF red accent").
  CSS tokens are in `app/css/app.css` `:root`. The tractor model itself keeps its red/grey livery.
- Missing values render as "Not yet documented". Supplier numbers render as "unverified" claims.
- 3D model: original procedural Three.js geometry, one group per hierarchy id (a test checks every
  id in model.js exists in hierarchy.json). No suitable licensable separable MF35 model exists
  (see `docs/research/05-…`). Coordinates: metres, x forward (rear axle at 0), y up, z right.
