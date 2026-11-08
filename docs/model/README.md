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
| Brakes | 14 × 2 in drums at the rear wheels, backplate on the outer end of each axle housing; pedals on the right on a combined brake cross shaft through the front of the transmission case; rod and yoke from each arm back to the rear brake lever (corrected in Phase 9 after the owner spotted the pedal linkage; the drums were previously inboard) | P.1–P.2, K.11, J.8 Fig. 12 |
| Fuel tank | 7½ gal, one long tank over the whole engine under the bonnet, front on the thermostat housing, rear on the battery carrier | B.2, E.101–E.103 |

## Checked against the workshop manual (Phase 9)

In Phase 9 every system was compared with the manual's figures and text (seven areas: engine, fuel
and cooling, clutch and gearbox, axle and PTO, hydraulics and linkage, steering and front axle,
electrical and body). These were corrected in the model. Page references are the manual's own.

| Area | Correction | Manual |
|---|---|---|
| Engine | Valves in mirrored pairs (E I, I E, E I, I E); 22 head set screws and nuts; rotor oil pump on the front main bearing housing driven from the crank, with the sump gauze strainer; relief valve in the filter head; oil filler on the left of the block, not the rocker cover; no external rocker oil pipe; breather run down the right side; starting-handle dog | C.101–C.102, C.112, Figs. 100–130 |
| Fuel | Long tank over the engine (was a short box at the dash); one main fuel filter at the rear left (twin filters were special order); lift pump under the pump head; pump drive as a gear housing on the side of the block; throttle linkage, stop control and hand throttle as their own parts; leak-off back to the filter | E.101–E.114, F.102 |
| Air | Oil-bath cleaner on the right towards the rear (was on the left), outlet into the rear of the inlet manifold, intake from behind the instrument panel; the left-hand stack and pre-cleaner removed | E.101, E.122–E.123 |
| Clutch and gearbox | Release fork on a cross shaft with the clutch pedal clamped to its left end; epicyclic high/low unit behind the rear wall (was spur gears); three selector rails; gear order and sizes; centre flange; reverse idler; tubular PTO shaft, retainer and gear pair for the dual clutch; gear levers 70 mm further back | I Fig. 4, J.1–J.10 |
| Axle and PTO | PTO in one straight line with no rear drop gear, sliding gear behind the pump; PTO lever on a cover plate on the left of the centre housing; differential lock pedal, shaft and coupler on the right; PTO guard over the shaft; differential bearings in the axle housings; pinion on the centreline; invented rear boss removed | K.1, K.10–K.11, M.1–M.3 |
| Hydraulics and linkage | Lift shaft moved ahead of the axle with the ram cylinder ahead of it and a longer ram arm; control spring in a rear extension of the lift cover, plunger to the top link; oil transfer pipe and cap; top link 25 in | L.5–L.25, Figs. 6–7, 25–29; L Data |
| Steering and front axle | Drop arms on the steering box; centre beam swept rearwards; radius rods to ball caps on the clutch housing (they were inside the sump); drag links clear of the air cleaner; front axle support bracket; column rake reduced | N.1, N Figs. 1 and 5, O.1–O.6 |
| Electrical and body | Second 6 V battery on the left rear axle housing, the other on the carrier under the rear of the bonnet; headlamps on brackets on the cowl sides (invented lamp wings removed); tail lamps on both mudguards and a plough lamp; De Luxe seat on a hinged bracket, not a coil spring; centre housing raised for 12⅝ in clearance; bonnet raised to clear the engine and tank | G.34–G.35, H.1–H.9, R.1–R.3, B.1 |

Left as they were, with the reason:

- **Exhaust:** the manual's standard exhaust runs under the right footplate, but the parts book lists a
  vertical silencer (890040M1) and the owner's photo shows an upright stack, so the stack stays. Its
  elbow now leaves the middle of the manifold as the manual shows.
- **Lift shaft position:** the manual's Fig. 7 puts it about 0.25–0.3 m ahead of the axle; the model uses
  0.15 m because the centre housing and gearbox lengths are not measured.
- **Drawbar:** the manual describes an adjustable cross drawbar on the lower links; the parts book rows
  (872149M1 with a clevis) fit the swinging drawbar that is modelled. Both are recorded.
- **Instrument panel, horn, kingpin angles (castor 5°, inclination 9°, camber 2°), neutral safety switch:**
  not changed; noted for a later pass.

## Checked against photographs (Phase 9)

The owner's photo and two photos of 1958 De Luxe tractors sent by the owner were used, by eye, for:
bonnet height (about 1.31 m, level with the lower rim of the steering wheel), steering-wheel height
(top about 1.42 m; B.1 gives 54 in overall height), the grille height, the upright exhaust stack
towards the front on the right, the air cleaner on the right at the rear of the engine, and solid
dished wheel centres.

## Approximate

These are placed by judgement and the owner's photo, not measured, and should be checked when the
tractor itself can be measured:

- Exact shapes of all castings and tinwork (bonnet, grille, mudguards, centre housing).
- Positions of the batteries, air cleaner, injection pump, filters, starter, dynamo, pipes and wiring.
- Internal gear sizes of the gearbox, PTO gears and differential (simplified cylinders).
- The front axle support bracket's shape.
- The fuel tank's depth (limited by the rocker cover, so the modelled volume is below 34 litres).

## Appearance pass (after Phase 4)

Shapes the owner's photograph and period views of the FE35 were used for, by eye:

- Bonnet lofted through cross-sections (rounded crown, slight taper and nose dip), separate
  louvred side panels, open cast-shield grille with a bar mesh and the triple-triangle badge.
- Clamshell mudguards: crowned sheet over the wheel, flat inner skirt, rolled outer edge, bracket
  to the axle housing. Dished pressed-steel rear wheel centres with six nuts and six rim clamps;
  six-bolt front wheels with hub caps; three-rib front tyres and bar-lug rear tyres.
- Dash cowl with a sloping instrument panel: chrome-bezelled ammeter, water temperature, oil
  pressure and tractormeter, key switch, serial plate. Three-spoke ribbed steering wheel.
- De Luxe cushion seat; chequer-plate footplates and steps.
- Castings: centre housing with its top flange and nuts, flanged tapering axle housings with
  brake flanges, water-jacket side plates and port bosses on the engine, alloy rocker cover with
  filler cap, sump drain plug, DPA pump with outlet unions, starter with solenoid.
- Exhaust stack with the silencer on the right (owner photo). (The air cleaner was moved to the left
  here; Phase 9 put it back on the right from the manual.)
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
