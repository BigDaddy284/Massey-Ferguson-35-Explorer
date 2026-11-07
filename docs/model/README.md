# 3D model notes (Phase 3)

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

## How it is used

- One group per hierarchy id. A part fitted in several places (four pistons, eight valves) is one
  group with several meshes.
- Variant parts are all built. The viewer hides any part the active configuration does not fit
  (for example the single-clutch parts on the owner's dual-clutch tractor). Removable front weights
  are hidden by default.
- Parts named as casings in `CASINGS` go see-through in X-ray mode, and automatically when the
  selected part is inside one.
