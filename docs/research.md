# Domain research — reference site study

**Method.** The reference site (hikvision.com/en) renders its content with JavaScript, so it was loaded in headless Chromium (Playwright). Navigation, headings, links and filter controls were pulled from the rendered DOM on 2026-09-27. Pages studied: home, products hub, the camera category, the product selector, a series landing page (Pro Series) and a product detail page (a 4 MP fixed bullet camera).

**What this document is for.** It covers the domain: information architecture, taxonomy, filter vocabulary and user journeys. Nothing visual, verbal or trademarked is carried into our build. Their technology brands map to our invented names in the last section.

---

## 1. Top-level IA (confirmed)

`Products · Solutions · Support · Technologies · Partners` are the primary nav. `Newsroom` and `About` live in the utility or footer layer, not the main bar. The footer groups these:

| Footer group | Items observed                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| About        | Company profile, investor relations, cybersecurity, trust center, compliance, sustainability, quality |
| Contact      | Contact us, FAQs                                                                                      |
| Newsroom     | Blog, latest news, success stories, video library                                                     |
| Partner      | Partner portal / installer app                                                                        |

**Our decision:** the main bar has _Products · Solutions · Technologies · Support · Partners_, and the header utilities have _Newsroom · About_. This keeps the main bar to 5 items at 1280px, with room for search and the CTA.

## 2. Product taxonomy (confirmed and extended)

The URL depth is `category / subcategory / series / product`. The **series** level is where marketing happens: a series page is a story (feature explainers with before/after imagery), then an embedded filterable list, then FAQs.

Categories on the products hub (21 in total). The ones relevant to us:

- **Cameras**: Network cameras (Value, Pro, Ultra, Deep-learning, Pan-tilt, Special, Panoramic, Wi-Fi), Wireless / solar / 4G cameras, PTZ (Value/Pro/Ultra/Special, dual-lens PTZ, analog PTZ), Analog HD cameras, Explosion-proof & anti-corrosion, Kits (PoE, Wi-Fi), Accessories (brackets, housings, junction boxes, power adaptors).
- **Recorders & storage**: NVRs, DVRs, hybrid storage, servers.
- **Networking**: switches, PoE, wireless bridges, fibre (their "transmission").
- **Video intercom**, **Alarms**, **Access control**, **Parking management**, **Display & control**, **Audio**, **Intelligent traffic (ITS)**, **Portable / body-worn**, **Premises distribution (cabling)**, **Sensing**, **Thermal**, **Radar**, **On-board vehicle**, **Security & industrial inspection**, **Fire safety**, **Software & servers**, plus a budget sub-brand.

**Observations that change our model:**

1. **Series cut across subcategories.** "Pro Series" exists under both network cameras and PTZ. We model `productSeries` with an optional `subcategory` reference, and the tier is its own enum. We do not nest series under a single parent.
2. **Products have variants.** A product page lists orderable models: lens options such as 2.8/4/6 mm, and regional or revision suffixes. **Each variant has its own lifecycle status** (for example, one revision discontinued while the new one is active). We add `variants[]` (`suffix`, `lensMm`, `status`) to `product`, while `status` stays on the parent for filtering.
3. **Accessories are a subcategory with compatibility.** They have a separate "Accessory selector" keyed by camera model. Stage 1 seeds accessories as a subcategory. A `compatibleWith[]` reference is added to the schema now so a Stage 3 selector needs no schema change.
4. **"Kits" are bundles.** They are modelled as products whose `bundleItems[]` reference other products. The field exists now and seed data uses it for two kits.

## 3. Filter vocabulary (from the live product selector)

| Facet              | Values observed                                                                                                                                                                    | Our UI type |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Form factor        | Box, Bullet, Cube, Dome, Fisheye, Mini PT, Panoramic Dome, PTZ Dome, Specialty, Turret                                                                                             | checkbox    |
| Resolution         | 2, 4, 5, 6, 8, 12, 16, 26, 32 MP                                                                                                                                                   | range (MP)  |
| Lens type          | Fixed, Manual varifocal, Motorized varifocal, Multi-lens                                                                                                                           | checkbox    |
| AI functions       | Perimeter protection (± strobe & audio), face capture, face recognition, hardhat, heat map, ANPR, metadata, multi-target detection, on/off-duty, people counting, queue management | checkbox    |
| Audio              | Built-in mic, dual-mic array, speaker, two-way audio                                                                                                                               | checkbox    |
| Active deterrence  | Audio alarm, white strobe, red/blue strobe                                                                                                                                         | checkbox    |
| Ingress            | IP54, IP66, IP67, IP68                                                                                                                                                             | checkbox    |
| Vandal             | IK08, IK10                                                                                                                                                                         | checkbox    |
| Supplemental light | IR, white light, hybrid (from series pages)                                                                                                                                        | checkbox    |
| Power              | PoE, 12 VDC, solar, 4G/cable-free                                                                                                                                                  | checkbox    |

**Additions to the brief's list:** `lensType`, `activeDeterrence`, and IP54/IP68/IK08 values. Resolution is modelled as a number (MP) so range filtering and sorting work.

## 4. Product detail anatomy (observed)

1. Breadcrumb (category › subcategory › series)
2. Model number as H1, then a descriptive name ("4 MP full-colour fixed bullet network camera")
3. 5–8 highlight bullets
4. Variant list with per-variant status
5. Primary CTAs: **Data sheet** and **Sales inquiry**
6. "Specification | Resources" tabs
7. **Spec groups (13):** Camera, Lens, Pixel density (DORI distances), Illuminator, Video, Audio, Network, Image, Interface, Event, Deep-learning function, General, Approval

**Our decision:** `fullSpecs[]` groups follow this 13-group order, so integrators find rows where they expect them. Seed data includes DORI distances (Detect/Observe/Recognise/Identify). They are the number specifiers compare most often, so they also appear in the compare table's key rows.

## 5. Solutions IA (confirmed, with a correction)

Solutions are organised along **three** axes, not two:

- **By industry**: Education, Energy (mining, oil & gas, power), Healthcare, Logistics, Manufacturing (chemical, automotive, food, electronics), Public transport, Safe city, Retail, Traffic, Buildings.
- **By function**: perimeter protection, access control, entrance/exit, time attendance, visitor management, people counting, remote audit, solar-powered security, thermography, speed measurement, violation detection, and more.
- **By scenario** (a physical place): schools, warehouses, factories, supermarkets, malls, parking lots, gas stations, substations, solar farms, bus stops.

Industry landing pages aggregate _functions_ and _scenarios_.

**Our decision:** the Stage 1 `solution` schema gets an `axis` field (`industry | function | scenario`), and `industry` stays a separate document so the Stage 2 mosaic and product cross-links work without migration.

## 6. Home page pattern (domain-level, not visual)

Rotating campaign hero → featured product lines → product catalogs → core technologies (4) → proof (case studies) → newsroom → corporate values. **Takeaway:** the reference leads with campaigns. Our brief leads with _capability_ (see clearly at night) and gets people to the product selector fast. That is the core differentiation of our IA.

## 7. Tools

- **Product selector**: faceted search across all categories, plus a free-text "ask about models, docs, firmware" box.
- **Compare**: slot-based ("Add product"). The reference offers 3 slots; **we offer 4** per the brief.
- **Accessory selector**, **System designer** (online design tool), **Downloads**: all Stage 3.

## 8. Audiences → primary journeys

| Audience               | Job                                                | Shortest path in our IA                                               |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| Integrator / installer | Find a model that fits the spec; get the datasheet | ⌘K model search → PDP → Datasheet (2 clicks)                          |
| Consultant / architect | Shortlist and compare, then specify                | Listing filters → Compare tray → `/products/compare?ids=` (shareable) |
| Distributor / partner  | Line-up overview by tier                           | Category → series tier chips                                          |
| Enterprise buyer       | Solution for my industry, ROI, talk to sales       | Home industries mosaic → (Stage 2) solution → Contact                 |
| End user               | Firmware, manuals                                  | PDP Downloads tab (Stage 1) → Support centre (Stage 3)                |

## 9. Trademark mapping (their name → our invented name)

| Capability                      | Reference trademark (do not use) | Dhonaadhi name |
| ------------------------------- | -------------------------------- | -------------- |
| Full-colour low light           | (reference brand)                | **LumaNight**  |
| Deep-learning detection         | (reference brand)                | **SentinelAI** |
| Edge analytics / on-camera AI   | (reference brand)                | **ClearEdge**  |
| Panoramic stitching             | (reference brand)                | **PanoSight**  |
| Solar / 4G cable-free           | (reference brand)                | **SunLink**    |
| Smart recording / AI search NVR | (reference brand)                | **VaultNVR**   |

Model numbers use our own scheme: `NX-{MP}{form}{lens/feature}`. For example, `NX-4K-D72` is a 4K dome with a 7.2 mm lens, and `NB-8M-B40L` is an 8 MP bullet with a 4 mm lens and LumaNight. It shares no prefixes with the reference.
