# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MF35 Explorer: a browser-based interactive 3D anatomy and parts catalogue for **one specific
tractor**, a 1958 Coventry-built Massey Ferguson 35 with the Standard 23C 4-cylinder diesel. It
must open locally in a normal browser. The planned stack is Three.js, HTML5, CSS3 and
JavaScript/TypeScript.

## Governing documents (read the relevant section before starting a phase)

- `docs/spec/PRODUCT_SPEC.md`: the owner's product specification (diesel-specific). **Takes
  precedence** where it differs from DESIGN.md.
- `docs/spec/DESIGN.md`: the earlier, broader design spec (also covers petrol/TVO). It is used for
  layout and UX intent.
- `docs/research/01–05`: Phase 1 findings. They override the spec's *assumed* scope lists where
  research contradicts them (for example, the 23C camshaft is chain-driven, not gear-driven).

Development follows the spec's roadmap (§15) **strictly in phase order**, one task at a time, with
research, build, test and verify before moving on. Current status: **Phase 1 complete; Phase 2
(application foundation) is next.**

## Commands

```bash
npm run validate        # or: node scripts/validate-data.mjs
```

There is no build, bundler or test framework yet. The validator has no dependencies (Node ≥ 18).
Run it after any edit to `data/*.json`. It exits 1 and lists every error.

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

How the pieces connect: the app resolves the active configuration as `ownerTractor`, falling
back to `defaultTarget` for each null axis. It filters the hierarchy by `appliesTo`. Any node
that depends on an axis the owner hasn't confirmed is shown as *variant dependent*. The rules
are in `docs/research/03-configuration-rules.md`.

## Non-negotiable accuracy rules

These are enforced by the validator where possible.

- Verification statuses are exactly `verified`, `partially-verified`, `unverified` and
  `variant-dependent`. An omitted status means `unverified`.
- `verified` requires at least one **accessed `primary`** source (AGCO parts book, service manual
  or operator book). None has been obtained yet, so nothing is verified.
- A status other than `unverified` must cite sources.
- OEM numbers quoted by suppliers or forums go in `supplierClaimedOem`, never in `oemPartNumber`,
  until checked against parts book 819045M4 (SRC-032).
- Never present missing data as confirmed in the UI. Show "not yet documented" instead.
- The Perkins 3.152/A3.152 is **not** 1958 equipment (introduced 1959, c. serial 165596).
- Do not assume live PTO. It depends on the dual-stage clutch, which is unknown for the owner's
  tractor.
- Do not apply US-built MF35 serial breaks to Coventry serials.
- Do not reproduce copyrighted AGCO diagrams or text. Diagrams and 3D assets must be original.
- Torque values from SRC-006 are suspect (main 40 Nm < con-rod 95 Nm). Don't display them until
  checked against the service manual.

## Conventions

- Ids are kebab-case and stable. Never derive an id from a supplier or OEM number.
- New facts: add or extend a source in `data/sources.json` (`extracted`, `conflicts`,
  `dateResearched`), cite it from the data, then validate.
- Record conflicting information rather than silently picking one value.
- UK English in user-facing text (tyre, colour, catalogue).
- 3D plan (Phase 3): an original procedural Three.js model, one mesh/group per hierarchy id.
  No suitable licensable separable MF35 model exists (see `docs/research/05-…`).
