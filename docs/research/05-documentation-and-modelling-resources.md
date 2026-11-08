# 05 — Documentation, suppliers and 3D modelling resources

## Original documentation

| Publication | Number | Availability (2026-11-07) | Use | Source |
|---|---|---|---|---|
| Parts book, FE35 / MF35 / MF35X | **819045M4** | In print as a genuine AGCO book, c. £136 (FarmingParts) | OEM numbers, quantities, exploded-diagram structure. **Most important document** | SRC-015, SRC-016 |
| Service manual, Ferguson 35 | 1448811M1 | Listed by AGCO; not checked for stock | Gearbox, hydraulics, PTO, axle, adjustments. Lacks the early dual-stage clutch | SRC-015 |
| Service supplement, Standard 4-cyl diesel | 690560M1 | Listed by AGCO; not checked | 23C engine data, torques, clearances | SRC-015 |
| Operator's instruction book, FE35 petrol/TVO/23C | 819046M1 | Sold as genuine reprint | Capacities, controls, maintenance | SRC-017 |
| 23C engine operator's manual | 819050M1 | Referenced by seller | Engine maintenance | SRC-017 |
| *Massey Ferguson 35 & 65 Models in Detail*, M. Thorne, 2014 | ISBN not yet recorded | Book in print / second hand | Production changes with serials | SRC-001 |

**Copyright:** these are AGCO/Herridge copyright. They may be used to *verify* facts. Diagrams
and text must not be reproduced. All app diagrams and 3D assets are to be original work.

**Recommendation to the owner:** buy parts book 819045M4 (and ideally 1448811M1 + 690560M1).

Update 2026-11-07 (SRC-037, AGCO publication catalogue 79017810B): for the FE 35 4-cyl diesel AGCO lists
operator manual **690274M2**, repair manual **819146M4**, parts book **819045M4** and microfiche 653116M91.
1448811M91 and parts book 651093M93 are listed against the US-built 35, so 819146M4 is the better candidate
for the Coventry workshop manual. Parts book 819045M4 is confirmed as the FE35 parts book for both engines.
Without it, OEM part numbers cannot be marked verified and Phase 5 will stall at "partially
verified".

## UK suppliers (initial survey)

| Supplier | URL | 23C-specific range | Notes |
|---|---|---|---|
| Anglo Agriparts | https://www.anglo-agriparts.com/ | Yes: dedicated FE35 categories, items tagged "23C Diesel" | Shows price ex/inc VAT and stock. Category tree mirrors our systems (SRC-018, SRC-019) |
| Agriline Products | https://agrilineproducts.com/ | Yes: "FE35 4cyl" range | Gives serial breaks and dimensions on listings (SRC-012) |
| Massey Tractor Parts / FarmingParts | https://masseytractorparts.com/ · https://farmingparts.com/ | Some | Sparex numbers, genuine AGCO books (SRC-013, SRC-016) |
| Reliable Aftermarket Parts (UK) | https://www.reliableaftermarketparts.co.uk/ | Some | Lists cross-references (SRC-020) |
| MF Parts | https://mfparts.co.uk/ | Not yet checked | Named in product spec |
| NC Tractor Spares | https://www.nctractorspares.co.uk/ | Not yet checked | Named in product spec |

Supplier facts (price, stock) change. Every supplier record must carry `dateChecked`, and an
exact match requires an OEM reference that matches the parts book (rule 7 in
[03-configuration-rules.md](03-configuration-rules.md)).

## 3D reference material

| Resource | Finding | Usable? |
|---|---|---|
| Free/commercial 3D models (CGTrader, Sketchfab, MakerWorld, RenderHub searches) | No MF35/FE35 model with separable mechanical components was found. CGTrader has an MF65 and a generic "Massey Ferguson tractor". MakerWorld has a 3D-print MF35 (page not readable, licence unknown) | **No.** None is a separable, licensable, internally detailed model. A single-mesh model is ruled out by the spec |
| 1:32 diecast models (Universal Hobbies FE35/MF35 1957 set) | Commercially available | Visual proportion and colour reference only |
| Original parts-book diagrams | Exploded views of every assembly | Reference for shapes and part order only; must not be traced or reproduced |
| Dimensions | **Not found** in any accessible source (wheelbase, track, heights, tyre sizes) | Needed. Parts book, service manual or tape measure on the owner's tractor |

### Recommended modelling approach (for Phase 3)

Build an **original, procedural/parametric model in Three.js**: each component is its own
mesh or group, named by its hierarchy `id`, generated from dimensioned primitives (lathe,
extrude, CSG-free composition). The reasons:

- It satisfies the "no single mesh" and "every component has a unique ID" rules directly.
- It avoids licensing problems with third-party models.
- Dimensions can be refined in data as better measurements arrive, without re-modelling.
- Exploded-view vectors can be stored per node alongside the hierarchy.

An optional later step is to replace high-visibility exterior parts (bonnet, grille,
mudguards, wheels) with hand-modelled glTF assets made in Blender from owner photographs. These
must keep the same ids.

Before Phase 3, collect at minimum: overall length, wheelbase, front/rear track, bonnet
height, rear tyre size, front tyre size, and photographs of all four sides of the owner's
tractor (or a confirmed 1958 diesel example).
