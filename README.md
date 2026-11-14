# VESTIGE — a museum of the missions to the Moon and Mars

> They may have been abandoned by humanity, but they should never be forgotten.

VESTIGE is an interactive digital museum built by **Team RealPugs** for the **2026 NASA Space Apps Challenge**. It keeps the memory of the machines humanity sent to the Moon and Mars and is aimed at school students aged 10 and up.

**Team RealPugs:** Amir Yermayan (Team Leader), Amir Abikenov (Programmer), Arsen Li (Video Editor), Arsen Sabayev (Partnerships & Programming). Official page: <https://www.spaceappschallenge.org/2026/find-a-team/realpugs/>

## What is inside

- **Laboratory intro**: opening doors with the RealPugs emblem and a central screen with a 3D Moon and Mars. Choosing a world opens its archive (`#/missions?planet=moon`, `#/missions?planet=mars`). Shown once per session; `?intro=1` shows it again, `?skipintro=1` skips it.
- **Mission archive** (`#/missions`): all 78 Moon pages and 110 Mars pages of the AZMTH catalogues. Search, filters by destination, record type, status, mission type, country, agency and year range, sorting and a match count. Programmes, instruments, artefacts, findings and analogues keep their own record type and are never shown as missions.
- **A page for every record** (`#/missions/<planet>/<slug>`): lead photo, compact facts with a source link per fact, key numbers, outcome / operational status / “reached the surface” / coordinates kept separate (coordinates carry “approximate” when the source says so), timeline, cost facts only when the record has them, photo gallery with credits, a short test, and the catalogue’s own source list.
- **21 story missions** (`#/missions/<id>`) keep their full trilingual profiles, citations and interactive 3D models, and now also show the archive photos.
- **Beyond the screen — our impact** (`#/impact`) and **About the team** (`#/about`): the library partnership with the National Library of the Republic of Kazakhstan in Almaty, the team and its real photo. No invented numbers.
- **Story tour**, **Timeline**, **Research library**, **References**, **Credits**, **Open source**, **AI & SI disclosure**.
- **Three languages**: English (default), Russian, Kazakh (`?lang=ru`, `?lang=kk`). Narration uses the device’s speech voices; when no Kazakh voice is installed the site says so.

## Archive data

`tools/build_archive.py` downloads the two AZMTH catalogues and every catalogue page once and writes compact data; `tools/sync_index.py` then regenerates the catalogue block inside `index.html` from `data/mission-index.json` (the single source for both catalogues).

| File | Content |
|---|---|
| `data/mission-index.json` | one normalized record per catalogue page (188) |
| `data/missions/<planet>/<slug>.json` | compact page record (facts, timeline, coordinates, images, references), loaded on demand |
| `data/image-index.json` | every image: local file, caption, credit, original link, stated licence, rights flag |
| `data/build-report.json` | exact counts and errors of the last build |
| `data/manifest.json` | list of all generated files |
| `data/catalogs/` | snapshots of the two source datasets (CC BY 4.0) |
| `images/<planet>/<slug>/` | resized WebP copies (longest side ≤ 1280 px) and 520 px thumbnails |

Last build: 188 of 188 pages, 931 images saved, 0 image failures, 0 source errors, 2548 references, 78 records with coordinates.

```bash
python3 tools/build_archive.py --cache /tmp/azmth-cache   # needs network access to azmth.space, plus beautifulsoup4, lxml, Pillow
python3 tools/sync_index.py
```

**Image rights.** The catalogue’s CC BY 4.0 licence covers the data, not the photographs. Every image keeps the credit and original link printed on its AZMTH page and is flagged `VERIFY_BEFORE_PUBLICATION` in `data/image-index.json`; `stated_licence` only repeats the credit line. Check the original before reusing an image.

## Run it locally

The 3D models load only over HTTP, not from `file://`.

```bash
python -m http.server 8000
# open http://localhost:8000/
```

Any static host works (GitHub Pages, Netlify, a school server). Keep `index.html` and the `models/` folder together.

## Files

```
index.html                 the whole site: markup, styles, story data and code
data/                      archive data (see “Archive data”)
images/                    archive images and images/team/ (emblem, team photo)
tools/                     archive builder and index sync
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

All data lives in the `<script type="module">` at the end of `index.html` (archive records live in `data/`), in this order:

| Block | What it holds |
|---|---|
| `REF_LIST` | the central bibliography: `[id, missionIds, type, year, title, author, url, check, supports]` |
| `MISSIONS` (two blocks) | the 21 mission profiles with citations by reference id |
| `ARCHIVE_MOON`, `ARCHIVE_MARS` | generated from `data/mission-index.json` by `tools/sync_index.py` — do not edit by hand |
| `AZMTH_TOPICS` | the AZMTH research topics |
| `TEAM`, `IMPACT_TEXT` | team members and the “Beyond the screen” texts |
| `TOPICS` | the research library |
| `ASSET_REGISTRY`, `ORBITERS`, `SITE_MODELS` | 3D models: files, sources, licences and where each one is shown |
| `UI`, `KK`, `STR_KK`, `SITE_KK` | interface texts and the Kazakh version |
| `ASSETS`, `SETTINGS`, `SITES` | file paths, scene settings and the places on the globes |

Reference check codes: `v` — link checked on 14 Nov 2026; `a` — taken from the AZMTH research page (catalogue verified 2 Nov 2026); `u` — unavailable.

## Before you publish — team checklist

- [ ] **Image rights**: review `data/image-index.json` (931 images, all flagged `VERIFY_BEFORE_PUBLICATION`) and remove any image whose original licence does not allow reuse.
- [ ] **3D models**: the `.glb` files are stored with Git LFS; make sure the host serves the real files, not LFS pointers.
- [ ] **Moon globe model**: confirm its original source and licence (see NOTICE).
- [ ] **Names**: check the English spelling of the team members’ names on the About page.
- [ ] **Kazakh narration**: test on the library computers; install a Kazakh system voice if none is present.

## Licence and data

The original code is released under the **Apache License 2.0** (see `LICENSE`). Third-party material keeps its own terms (see `NOTICE`): NASA 3D models follow the NASA media usage guidelines; catalogue data comes from azmth.space under CC BY 4.0; scientific publications are linked, not copied.

---

### Кратко по-русски

Откройте сайт через веб-сервер (`python -m http.server 8000`) — иначе браузер не загрузит 3D-модели. Язык по умолчанию — английский; русский и казахский переключаются вверху или в меню. Все тексты и данные — в конце `index.html` (таблица выше). Перед публикацией заполните пункты из списка «Before you publish».
