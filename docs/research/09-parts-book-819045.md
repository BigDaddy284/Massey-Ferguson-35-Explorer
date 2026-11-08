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

## Second pass: every applicable row on the 23C and chassis pages (2026-11-08)

The owner asked for everything in the book that fits the tractor. Each 819045 row on the 23C and chassis
pages was tested against the tractor (by a script that is not kept in the repository, then checked page by
page):

- **Left out:** rows for the A3.152 and 87 mm engines, vineyard, high-clearance, Multi-Power, single clutch,
  industrial and Finland applications; serial conditions that end before 79553 or start after 125067; engine
  conditions that end before SJ37181E or start after SJ93988E (the owner's engine lies between them, as the lift
  pump and dipstick records show). The later oil filter page (p92), the early lift pump (p99), the horizontal
  exhaust (p127 items 15 on) and option pages (diff lock, dual spool valve, hitches, stabilisers, pulley, jack,
  safety kits, wheel weights) were not used.
- **Kept with a note:** splits that fall inside 1958 or inside the owner's engine range, and rows whose footnote
  could not be matched automatically. These are listed on the record, never made primary, and say to check the
  plates.
- **Attached:** about 1,170 rows went onto 178 existing records as further 819045 rows ("Also in 819045" in the
  record panel). Parts were placed by what they are and by the figure (for example the steering box shafts,
  arms, seals and shims on `steering-box`; lift pump internals on `fuel-lift-pump`; drag-link sockets, caps and
  clamps on `drag-links`). Fasteners, washers, seals and pins were attached to the part they follow in the
  book's item order, which is how the book groups them. Rows that are not illustrated were left out.
- **New records:** `spigot-bearing` (828123M1, verified; also listed in the transmission), `front-axle-support`
  (the casting was modelled but filed under the sump), `hyd-pump-body` (the two pump bodies, also modelled
  before under the pump assembly), `heater-plug-wiring` (cold-climate only, variant dependent) and
  `wheel-brace` (wheel nut socket and handle, not in 3D).
- **Supplier grade:** Agriline's swinging drawbar quotes 872142M91, which is now a book row on the drawbar
  (p275 item 34), so that reference is graded `book-ref`.

No row from this pass sets an `oemPartNumber`: the original-number rules above are unchanged. The rows show what
the book lists with each part; a record only becomes verified from one primary row.

## Items still not cited

What is left on the pages used (counted the same way; most remaining items are for other engines or options,
or not illustrated):

| Page | Group | Not yet cited |
|---|---|---|
| 83 | Heater (battery, harness and switch rows for the heater kit) | 15 |
| 107 | Dual clutch (facings and rivets serviced only in kits) | 10 |
| 128 | Air intake (87 mm rows) | 17 |
| 152 | Electrical 23C (Lucas caps, clips, bolts) | 13 |
| 159 | Lighting (general hardware groups) | 36 |
| 163 | Hood (A3.152 and later hood rows) | 17 |
| 188 | Transmission (conversion kits) | 11 |
| 211 | Differential (not-serviced and Loctite rows) | 11 |
| 228 | Hydraulic pump (O-ring and seal kit rows marked E/F) | 21 |
| 243 | Links (alternative link assemblies) | 11 |
| 263 | Wheel weights (option) | 15 |

## Third pass: the centre housing shaft, heater kit and wheel brace (2026-11-08)

The five centre housing rows the second pass left unattached (p207 items 21-25: shaft 181439M93, bare shaft 22,
needle bearing 195513M1, coupling 880069M1 and pin 354416X1) are the PTO drive through the centre housing. Three
things agree: figure C-5 draws them as a splined shaft along the bottom of the housing with the bearing at its rear
end and the coupling at the front; the Ferguson TO35 parts book (SRC-041 p163) lists the same numbers as "Shaft
Assembly, Rear Drive", "Bearing, Needle" and "Coupling, Rear Drive" in its differential housing group; and the
workshop manual's PTO section (SRC-035 M.1 Fig. 1) describes the shaft carried at its front by a needle roller
bearing, with the needle bearing and retainer in the centre housing as a separate operation (M.5). They are now
the record `pto-rear-drive-shaft` (verified, 181439M93), and `pto-drive-shaft` keeps only the gearbox shaft
180429M1 with the TO35 rear drive rows moved across.

The same pass placed the three parts the first pass had records for but no 3D part: the wheel nut socket and
L-shaped tommy bar (p167 figure A-7, items 18-19) inside the tool box, and the heater plug resistor and warning
light (p83 figure H-15, items 13 and 12) on the instrument panel. The resistor and light were also made
cold-climate variant parts (`appliesTo coldStart: cold-climate`), like the heater plugs and their wiring: the
book lists them only under the heater kit.
