# 3D model notes (Phases 3 and 4)

The model in [`app/js/model.js`](../../app/js/model.js) is original procedural geometry built in
code. It is not traced from any AGCO drawing or taken from a third-party 3D asset.

## Measured from the workshop manual (SRC-035)

| Item | Value used | Source |
|---|---|---|
| Wheelbase | 72 in (1.829 m) | B.1 |
| Track | 48 in front, 52 in rear (normal setting) | B.1 |
| Tyres | 4.00-19 front, 10-28 rear (diameters estimated from size) | B.1 |
| Overall length / width / height | 117 / 64 / 54 in, used as a check on the outline | B.1 |
| Ground clearance | 12⅝ in under the centre, 21 in under the front axle | B.1 |
| Engine | 4 cylinders, 84.1 mm bore, 101.6 mm stroke; pistons 1 and 4 at TDC | B.29 |
| Clutch | Dual: 11 in + 9 in discs; single: 10 in disc | I.4 |
| PTO shaft | 1⅜ in, 6 splines | M.3 |
| Hydraulic pump | Four cylinders, two opposed valve chambers, in the sump between gearbox and final drive | L.5–L.6 |
| Lift linkage | Lift shaft and arms, lift rods (RH with levelling box), lower links on ball mountings, check chains, top link | L.5 |

## Approximate

These are placed by judgement and the owner's photo, not measured, and should be checked when the
parts book (819045M4) or the tractor itself is available:

- Exact shapes of all castings and tinwork (bonnet, grille, mudguards, centre housing).
- Positions of the battery, air cleaner and intake stack, injection pump, filters, starter, dynamo,
  pipes and wiring.
- Internal gear layout of the gearbox, PTO gears and differential (simplified cylinders).
- The forward extension of the sump carrying the front axle.

## Appearance pass (after Phase 4)

Shapes the owner's photograph and period views of the FE35 were used for, by eye:

- Bonnet lofted through cross-sections (rounded crown, slight taper and nose dip), separate
  louvred side panels, open cast-shield grille with a bar mesh and the triple-triangle badge,
  lamp pods either side.
- Clamshell mudguards: crowned sheet over the wheel, flat inner skirt, rolled outer edge, bracket
  to the axle housing. Dished pressed-steel rear wheel centres with six nuts and six rim clamps;
  six-bolt front wheels with hub caps; three-rib front tyres and bar-lug rear tyres.
- Dash cowl with a sloping instrument panel: chrome-bezelled ammeter, water temperature, oil
  pressure and tractormeter, key switch, serial plate. Three-spoke ribbed steering wheel.
- De Luxe cushion seat on a sprung pan with the coil spring; chequer-plate footplates and steps.
- Castings: centre housing with its top flange and nuts, flanged tapering axle housings with
  brake flanges, water-jacket side plates and port bosses on the engine, alloy rocker cover with
  filler cap, sump drain plug, DPA pump with outlet unions, starter with solenoid.
- Air cleaner moved to the left-hand side with its stack and pre-cleaner bowl beside the dash;
  exhaust stack with the silencer on the right (owner photo).
- Surface grain for cast iron, paint and rubber is generated in code (no texture files). The
  viewer builds a studio environment map in code for reflections.

None of this changes any measured dimension above. It is appearance, not evidence.

## How it is used

- One group per hierarchy id. A part fitted in several places (four pistons, eight valves) is one
  group with several meshes.
- Variant parts are all built. The viewer hides any part the active configuration does not fit
  (for example the single-clutch parts on the owner's dual-clutch tractor). Removable front weights
  are hidden by default.
- Parts named as casings in `CASINGS` go see-through in X-ray mode, and automatically when the
  selected part is inside one.

## Exploded views (Phase 4)

- `EXPLODE` in `model.js` gives, for selected hierarchy ids, how far the group moves away from its
  parent at full explosion (metres). `'mirror'` sends left-hand parts the opposite way in z.
- Groups without a hint move radially away from the parent's centre, with an extra push along the
  main axis scaled to the parent's size. Children that share the parent's centre (parts on one
  shaft or inside one housing) slide out one after another along `EXPLODE_AXIS` (default: up).
- The left- and right-hand halves of one part (both rear tyres, both lift arms) split apart.
- The whole layout is lifted if needed so nothing goes below the floor.
- These directions are chosen so the views are clear. They are not a dismantling order, and they
  are not taken from any AGCO exploded diagram.

## Drawn diagrams (Phase 6)

`npm run diagrams` regenerates `app/data/mf35-diagrams.js`: one SVG line drawing per assembly in the
`DIAGRAMS` list of `scripts/build-diagrams.mjs`, drawn from this model by `scripts/diagram-gen.js`.

How a drawing is made:

1. The assembly is exploded exactly as the 3D view explodes it (`viewer.setExplode`, depth chosen
   so that at most 40 items are numbered), so the item numbers are the same in both.
2. Every mesh is projected with an orthographic camera (direction per diagram: front-right-above,
   rear-right-above, or side) and its vertices are welded by screen position.
3. Faces are classed front- or back-facing. Edges between a front and a back face (or open edges on
   a front face) form the silhouette, which is chained into loops and filled with one tone per mesh
   (lit from above-front). Edges between two front faces meeting at more than 32° are drawn as
   crease lines. Meshes are drawn back to front, so nearer parts cover farther ones.
4. A casing that stays in place over the exploded parts (as in the 3D view) is drawn dashed with no
   fill, so the parts inside stay visible.
5. Each numbered item gets a label in the left or right margin and a leader to the nearest visible
   face of its geometry.

What the drawings are not: they inherit every simplification of the model (see above), they are a
presentation layout rather than a dismantling order, and they are not reproductions of any AGCO
illustration.
