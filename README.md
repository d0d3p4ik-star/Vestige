# Forgotten Machines — Abandoned but Not Forgotten

An interactive museum of the machines humanity left on the Moon and Mars, built by **Team RealPugs** for the **2026 NASA Space Apps Challenge** (14–15 November 2026). It is aimed at students aged 10 and up and at anyone curious about space.

> They may have been abandoned by humanity, but they should never be forgotten.

## What is inside

- **Story tour**: two chapters (Lunokhod 1 on the Moon, Opportunity on Mars) with 3D globes to scale, 16 places, a signal-delay experiment, a distance-record chart and a quiz. Machines speak in the first person; every fact has a numbered citation next to it.
- **Mission archive** (`#/missions`): all 78 Moon records and 110 Mars records of the AZMTH catalogues, plus the 21 missions told on the site. Search, several filters at once, sorting and a match count. A record is marked “Still there” only when the catalogue says hardware reached the surface; orbiters are never shown as surface artefacts.
- **Mission pages** (`#/missions/<id>`, 21 missions): overview, story, timeline, impact (five categories and “What changed because of this mission?”), cost with scope and confidence level (no inflation adjustment without a published 2026 index), value, verdict, the abandoned artefact with coordinates (confirmed / approximate), an interactive 3D model where a verified one exists, and a bibliography grouped by document type.
- **References** (`#/references`): every source in one searchable list, filterable by mission, destination, agency, document type and year. Each entry has the exact title, author or organisation, year, document type, what it supports and a direct link.
- **Timeline**, **Research library** (eight scientific questions with the original papers), **About**, **NASA Space Apps Challenge**, **Credits and licences** (3D asset registry), **Open source** and **AI & SI disclosure** pages.
- **Laboratory intro** with “Enter the archive” and “Skip intro” (shown once per session; simplified on phones and when reduced motion is on). Add `?skipintro=1` to the address to skip it.
- **Three languages**: English (default), Russian, Kazakh. The choice is remembered. `?lang=ru` or `?lang=kk` opens a language directly.
- Works with keyboard and screen readers, has narration buttons, a pause for rotation, and a full no-WebGL fallback.

## Run it locally

The 3D models load only over HTTP, not from `file://`.

```bash
cd forgotten-machines
python -m http.server 8000
# open http://localhost:8000/
```

Any static host works (GitHub Pages, Netlify, a school server). Keep `index.html` and the `models/` folder together.

## Files

```
index.html                 the whole site: markup, styles, data and code
models/planets/            original globe models (Moon supplied by the team; Mars from NASA)
models/moon/               original LRO and Apollo Lunar Module models (NASA)
models/mars/               original Mars Odyssey, InSight, MER, Curiosity and Viking models (NASA)
models/optimized/…         compressed copies; the site loads these first and falls back to the originals
LICENSE, NOTICE            Apache-2.0 for the code; third-party terms in NOTICE
```

Model optimisation command used (originals are never overwritten):

```bash
gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 1024 --simplify false
```

(`--texture-size 4096` for the Moon globe, `2048` for Mars.)

## Where to edit content

All data lives in the `<script type="module">` at the end of `index.html`, in this order:

| Block | What it holds |
|---|---|
| `REF_LIST` | the central bibliography: `[id, missionIds, type, year, title, author, url, check, supports]` |
| `MISSIONS` (two blocks) | the 21 mission profiles with citations by reference id |
| `ARCHIVE_MOON`, `ARCHIVE_MARS`, `AZMTH_TOPICS` | the AZMTH catalogue records |
| `TOPICS` | the research library |
| `ASSET_REGISTRY`, `ORBITERS`, `SITE_MODELS` | 3D models: files, sources, licences and where each one is shown |
| `UI`, `KK`, `STR_KK`, `SITE_KK` | interface texts and the Kazakh version |
| `ASSETS`, `SETTINGS`, `SITES` | file paths, scene settings and the places on the globes |

Reference check codes: `v` — link checked on 14 Nov 2026; `a` — taken from the AZMTH research page (catalogue verified 2 Nov 2026); `u` — unavailable.

## Before you publish — team checklist

- [ ] **About page**: add real names, roles, verified short biographies and team photos (nothing is invented there now).
- [ ] **AI & SI disclosure**: add who reviewed which parts and any other AI tools the team actually used.
- [ ] **Open source page**: add the public GitHub repository link.
- [ ] **Moon globe model**: confirm its original source and licence (see NOTICE).
- [ ] **Emblem**: replace the placeholder “RP” emblem in the intro with the team’s emblem.
- [ ] **Photos (optional)**: put NASA or agency photos at `images/lunokhod1.jpg` and `images/opportunity.jpg` and write their credits in `ASSETS.photos`. Until then the cards show drawn schematics.

## Licence and data

The original code is released under the **Apache License 2.0** (see `LICENSE`). Third-party material keeps its own terms (see `NOTICE`): NASA 3D models follow the NASA media usage guidelines; catalogue data comes from azmth.space under CC BY 4.0; scientific publications are linked, not copied.

---

### Кратко по-русски

Откройте сайт через веб-сервер (`python -m http.server 8000`) — иначе браузер не загрузит 3D-модели. Язык по умолчанию — английский; русский и казахский переключаются вверху или в меню. Все тексты и данные — в конце `index.html` (таблица выше). Перед публикацией заполните пункты из списка «Before you publish».
