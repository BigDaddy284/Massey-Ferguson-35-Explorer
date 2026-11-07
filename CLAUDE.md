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
- `docs/research/06-agco-heritage-2008.md`: current AGCO supply numbers for 35/23C parts from the
  2008 Heritage catalogue (SRC-038), stored on nodes as `replacementReferences`.
- `docs/research/01–05`: Phase 1 findings. They override the spec's *assumed* scope lists where
  research contradicts them (for example, the 23C camshaft is chain-driven, not gear-driven).

Development follows the spec's roadmap (§15) **strictly in phase order**, one task at a time, with
research, build, test and verify before moving on. Current status: **Phase 4 (exploded views) built; Phase 5 (component catalogue) is next.**

## Commands

```bash
npm run validate        # check data/*.json (sources, statuses, ids, appliesTo)
npm run build           # validate, then regenerate app/data/mf35-data.js from data/*.json
npm test                # node:test suite for app/js/core.js (tests/*.test.js)
node --test tests/core.test.js   # single test file
npm run serve           # optional: http://localhost:8035 (python3); the app also works opened directly
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

- `data/technical.json`: Technical Information rows (value + status + sources; `display:false`
  rows are withheld) and the Identification guide (steps, serial prefix letter table).
- `app/js/core.js`: pure logic, loaded in the browser as `window.MF35Core` and through `require` in tests.
  It covers hierarchy indexing, configuration resolution, applicability, serial decoding, fuzzy search
  and coverage. Put anything testable here.
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
  or operator book). The only one read so far is the FE-35/MF35 workshop service manual scan
  (SRC-035). Technical figures it states are `verified`. Hierarchy components stay at most
  `partially-verified` until their part number and quantity are checked in parts book 819045M4.
- A status other than `unverified` must cite sources.
- OEM numbers quoted by suppliers or forums go in `supplierClaimedOem`, never in `oemPartNumber`,
  until checked against parts book 819045M4 (SRC-032).
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
