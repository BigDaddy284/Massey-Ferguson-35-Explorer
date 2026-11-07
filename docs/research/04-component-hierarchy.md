# 04 — Initial component hierarchy

Data: [`data/hierarchy.json`](../../data/hierarchy.json). Validate with
`node scripts/validate-data.mjs`.

## Structure

`tractor > system > assembly > subassembly > component`. A system may hold components
directly where there is no meaningful assembly level.

Each node has a stable kebab-case `id`. The same id will name the 3D object (`modelReference`)
and the catalogue record. **Ids are permanent once a 3D object or diagram uses them.**
Supplier and OEM part numbers are attributes, never ids.

| System id | Covers | Notes from Phase 1 research |
|---|---|---|
| `engine` | Block, head and valve train, crank/pistons/rods, camshaft and timing, lubrication, flywheel, manifolds | Timing is **chain-driven** (SRC-008). Liner type in conflict |
| `fuel` | Tank, low-pressure circuit, CAV DPA injection, air intake | Air cleaner type unsourced |
| `cooling` | Radiator, hoses, water pump, fan, thermostat | Coolant heater is a cold-climate variant |
| `clutch` | Housing, single-stage **or** dual-stage assembly, release mechanism | Variant axis `clutch` |
| `transmission` | 3-speed box with high/low range (6F/2R), levers, selectors | Internals need the parts book |
| `rear-axle` | Centre housing, differential, trumpets, half shafts, hubs, shoe brakes | Diff lock variant |
| `pto` | Drive shaft, gears, engagement, output shaft, housing, seals | Live vs transmission follows the clutch |
| `hydraulics` | Pump (camshaft, cam blocks, pistons, valve chamber, strainer), lift cover (ram, rockshaft, lift arms), control mechanism (quadrant, draft spring, plunger, top-link bracket) | Post-65685 pump and 3 in ram apply to 1958 |
| `linkage` | Lower links, lift rods, levelling box, top link, check chains, pins, drawbar | Removable implement-side items flagged `removable` |
| `front-axle` | Beam, extensions, pivot, radius rods, stub axles, hubs, steering box and linkage | Steering box type unsourced |
| `electrical` | Starter, dynamo, regulator, battery, heater plugs, lamps, gauges, tractormeter | Voltage axis |
| `bodywork` | Tinwork, dash, serial plate, mudguards, seat, footplates | Badge branding changed during 1958 |
| `wheels` | Wheels, rims, nuts, tyres, valves | Sizes unsourced |

## Coverage at end of Phase 1

247 nodes: 74 partially verified, 10 variant dependent, 163 unverified, **0 verified**.
No OEM part number is verified yet. The `supplierClaimedOem` values on hydraulic pump parts
are leads to check against parts book 819045M4.

## Planned record fields (Phase 2/5)

Hierarchy nodes will gain the full component record from the product spec (§11). The fields
are `oemPartNumber`, `alternativePartNumbers`, `aftermarketReferences`, `quantity`, `description`,
`function`, `location`, `specifications`, `compatibility`, `suppliers[]`, `diagramReference`,
`relatedComponents[]` and fastener fields (thread, diameter, length, pitch, head, material).
Fasteners will be added under the assembly they secure. They will not go in a single global
fastener bin, so that each fastener stays tied to its location.

## Known corrections to the product spec's scope list

- *Timing gears*: the 23C camshaft is chain-driven (SRC-008). The scope list item is replaced by
  timing chain, tensioner and sprockets, plus an injection-pump drive still to be identified.
- *Cylinder liners*: listed, but wet vs dry is unresolved.
- *Thermostat "where fitted"*: 23C rebuild kits include one (SRC-018).
