# 09 – Parts book 819045: how it was read

The AGCO / Massey-Ferguson parts book for the 35 and 35X, publication 819045, is the only source used to set
an `oemPartNumber`. Two copies of it have been read. Neither is in the repository, and no page image or text
from either is committed.

| Source | Copy | What it gives |
|---|---|---|
| SRC-032 | The owner's text PDF of the book (255 pages, printed pages 3–292) | Clean tables: item, part number, quantity, description, footnote letters and footnotes. All numbers and quantities are cited from this copy. |
| SRC-043 | The owner's scanned PDF of the printed book, Issue 1 (8/69), 424 pages | The same tables and page numbers, plus the exploded illustrations (grid figures such as H-5, J-15, M-11), the master, group, pictorial and numerical indexes, and the vineyard pages 280–293. Its OCR text is poor, so it is used to identify what an item is and where it fits, not to read numbers. |

## Rules for the original number

These are the rules recorded in `data/sources.json` (SRC-032) and enforced by `scripts/validate-data.mjs`:

- A row becomes the node's `primary` row, and so its `oemPartNumber` and `quantity`, only when it names the 23C
  or no engine, and any serial condition covers the whole 1958 Coventry range 79553–125067.
- (J)/(N) rows ("to service 829420M91") are preferred over the later (K)/(P) rows.
- Serial and engine-number splits inside 1958 are decided by the owner's plates (prefix SDM, a 23C engine
  number). The numbers themselves are never written into the repository.
- Composite sets (several different parts under one record), grade-selected parts and alternatives the book
  lists without a condition leave `oemPartNumber` empty, every row listed, and a `partsBookNote` saying why.
  Such records stay `partially-verified`.
- References from this book always cite SRC-032 and the printed page; the illustrated copy (SRC-043) is cited on
  the node's `sources` when its figure was used for identification or position.

## Page map (23C and chassis)

Cylinder block p72, cylinder head p79, heater p83, piston p84, camshaft, timing and cover p87, cover kit p88,
oil filter p91 (early) and p92 (from engine SJ102045E), injection pump drive p95, water pump p96, feed pump
p99/p100, start pilot p103 (cold-start kit), single clutch p104, dual clutch p107, radiator and fuel tank p111,
fuel lines and heater equipment p116, exhausts p124/p127, air intake p128, throttle controls p139, electrical
23C p152, lighting p156/p159, hood p163, wheels p167, front axle p168, steering and instrument panel p175,
seats p183/p184, selector p187, transmission p188, transmission case p196, PTO p204, centre housing p207,
differential p211/p212, differential lock p215/p216, rear axle housing p220, brakes p223/p224, parking
handbrake p227 (later models), hydraulic pump p228, lift cover p235, lift arms p240, links p243, levelling box
p247, wheel weights p263, drawbar p275. Pages 3–40 (A3.152) and 43–68 (87 mm) do not apply.

## What the illustrated copy added (2026-11-08)

The figures showed parts that the book lists for the 23C but that had no record yet. Eight records were
added, each with its 819045 rows and a 3D part:

| Record | 819045 | Status | Figure |
|---|---|---|---|
| `battery-platform` front battery platform, bracket and strap | p152 items 16–18, platform 827589M91 | verified | M-11 |
| `battery-mounting-lh` left-hand battery cradle and bands | p152 items 30–32, mounting 826976M92 | verified | M-11 |
| `fuel-tank-mountings` rear pads, plates and packings, front spring bolts | p111 items 4–18 | partially verified (set) | J-15 |
| `transmission-dipstick` | p207 item 17, 828810M91 | verified | C-5 |
| `centre-housing-side-cover` right-hand cover and gasket | p207 items 14–16, cover 181218M91 | verified | C-5 |
| `tool-box` clamped to a radius rod | p168 items 75–80, box 825633M91 | verified | A-9 inset |
| `steering-column-bearing` upper bearing parts | p175 items 51–56 | partially verified (set) | A-17 |
| `dashboard-supports` instrument panel bearer and brace | p175 item 64 | partially verified (two parts) | A-17 |

One finding ties two pages together: bracket 826780M91 is item 9 under the fuel tank (p111) and item 17 under
the front battery platform (p152). One bracket carries both the back of the tank and the front battery, as the
workshop manual describes (SRC-035 E.101).

What was not settled: the tool box figure does not show which radius rod it is on (the model uses the left), and
the positions of the side cover, dipstick and front tank mountings on their castings are placed by eye from the
figures.

## Items still not catalogued

A count of 819045 item numbers on each 23C and chassis page that no record cites yet, made by a script over the
SRC-032 text copy (the script is not kept in the repository; counts are approximate because some table rows
wrap). Most are fasteners, washers and seals, which the spec wants catalogued in time.

| Page | Group | Items | Not yet cited |
|---|---|---|---|
| 72 | Cylinder block, crankshaft, flywheel | 48 | 22 |
| 79 | Cylinder head | 72 | 28 |
| 83 | Heater | 28 | 20 |
| 87 | Camshaft, timing gear and cover | 33 | 9 |
| 88 | Cover kit | 17 | 11 |
| 91 / 92 | Oil filter (early / late) | 32 / 36 | 24 / 28 |
| 95 | Injection pump drive | 26 | 14 |
| 96 | Water pump | 24 | 12 |
| 99 / 100 | Feed (lift) pump internals | 25 / 19 | 25 / 19 |
| 104 / 107 | Single / dual clutch | 21 / 34 | 13 / 20 |
| 111 | Radiator and fuel tank | 47 | 22 |
| 116 | Fuel lines and heater equipment | 76 | 41 |
| 124 / 127 | Vertical / horizontal exhaust | 23 / 25 | 17 / 21 |
| 128 | Air intake | 42 | 32 |
| 139 | Throttle controls | 57 | 40 |
| 152 | Electrical 23C | 44 | 25 |
| 156 / 159 | Lighting | 48 / 56 | 48 / 54 |
| 163 | Hood and panels | 73 | 59 |
| 167 | Wheels and rims | 23 | 9 |
| 168 | Front axle and support | 77 | 51 |
| 175 | Steering and instrument panel | 84 | 56 |
| 187 / 188 | Selector / transmission | 30 / 66 | 12 / 37 |
| 196 | Transmission case | 54 | 34 |
| 204 | PTO | 31 | 12 |
| 207 | Centre housing | 36 | 25 |
| 211 / 215 / 216 | Differential, diff lock | 34 / 14 / 52 | 23 / 9 / 32 |
| 220 | Rear axle housing | 31 | 16 |
| 223 / 224 | Brakes, pedals and rods | 24 / 46 | 12 / 31 |
| 228 | Hydraulic pump | 79 | 60 |
| 235 / 240 | Lift cover / lift arms | 86 / 39 | 63 / 13 |
| 243 / 247 | Links / levelling box | 63 / 35 | 40 / 21 |
| 263 / 275 | Wheel weights / drawbar | 24 / 37 | 18 / 25 |

The figures for these pages are in SRC-043, so the next passes can work page by page: identify each item on the
figure, decide whether it is a part of its own or a fastener of an existing record, and add its rows.
