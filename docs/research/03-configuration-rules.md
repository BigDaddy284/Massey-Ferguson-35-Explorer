# 03 — Configuration and compatibility rules

Data: [`data/configurations.json`](../../data/configurations.json).

## Why this exists

1958 MF35s were not all identical (SRC-003, SRC-010, SRC-011). The owner's tractor
details (serial, clutch type) are unknown. So every component is tied to the
configurations it fits, and the app works out what to show from the owner's profile.
Correcting the engine or clutch must be a data edit, never a code change.

## Variant axes

| Axis | Options | Target scope |
|---|---|---|
| `engine` | `std-23c-diesel` · `std-petrol` · `std-tvo` · `perkins-3-152` | Only `std-23c-diesel` is in scope. The others are recorded so the app can say "this part is for a different engine" |
| `clutch` | `single-stage` (F) · `dual-stage` (M) | Both in scope; owner unknown |
| `pto` | `transmission-pto` · `live-pto` | **Derived from clutch**, never set on its own |
| `chassis` | `standard` (S) · `vineyard` (V) · `industrial` (J) | Standard assumed |
| `electrics` | `12v` · `6v` | 12 V working assumption, unverified |
| `coldStart` | `standard-uk` · `cold-climate` | Standard UK assumed |
| `diffLock` | `fitted` · `not-fitted` | Not fitted assumed until a 1958 fitment is confirmed |

## Rules

1. **Applicability.** A component with no `appliesTo` fits every in-scope configuration.
   `appliesTo: { axis: [options] }` means it fits only when the active value is in the list.
   Keys are ANDed together; values within one key are ORed.
2. **Unknown owner values.** If the owner's value for an axis the component depends on is
   `null`, show the component as **variant dependent**, not as fitted. The 3D model may draw
   the `defaultTarget` variant, but it must be labelled as such.
3. **Default target** (for drawing only): 23C, dual-stage clutch, live PTO, standard
   chassis, 12 V, UK cold start, no diff lock. Dual-stage is the default because it is the
   superset of PTO parts; it is not a claim about the owner's tractor.
4. **Serial breaks.** A part can carry `fromSerial` / `toSerial` (Coventry numbering). All
   1958 tractors (79553–125067) are after SB-001 (65685, hydraulic pump/ram change) and before
   SB-002 (165596, Perkins). Serial breaks from US-built MF35 numbering (for example SRC-014's
   230456/231715) must **not** be applied to Coventry serials.
5. **Owner serial entered.** When the owner enters a serial:
   - Check it falls within 79553–125067. Otherwise show its year from `productionYears`,
     with a warning.
   - Decode the prefix (chassis/fuel/clutch letters) into axis values and mark them
     "from serial prefix".
   - Apply serial breaks.
6. **Re-engined tractors.** A tractor in the 1958 range fitted with a Perkins 3-cylinder engine has
   been re-engined. Engine parts then follow `perkins-3-152`, but the catalogue keeps
   presenting the 23C as the original.
7. **Supplier compatibility.** A supplier listing for a generic "MF35" is a *possible
   alternative* unless the listing names the 23C (or FE35 4-cylinder diesel) **and** its OEM
   reference matches a parts-book number. Only then is it an *exact match*.
8. **Interchangeability.** Never infer that visually similar fasteners, or parts shared with
   the TO35/FE35/later 35, are interchangeable without a source. SRC-021 records a thread-form
   mismatch between UK and export 23C head bolts.

## Owner profile

`ownerTractor` in `configurations.json` holds what is known. Update it when the tractor is
inspected. The quickest checks that settle the most components are:

1. Serial plate prefix and number.
2. Clutch half-pedal test with the PTO engaged.
3. Count of cylinders and injectors (confirms 23C vs Perkins).
4. Battery arrangement and dynamo label (voltage).
5. Diff-lock pedal present or not.
