# Vestige — an interactive archive of the machines humanity sent to the Moon and Mars

*They may have been abandoned by humanity, but they should never be forgotten.*

A project by **Team RealPugs** for the 2026 NASA Space Apps Challenge — Amir Yermayan (team lead), Arsen Li (developer; reviewed all AI-assisted work and checked the sources), Amir Abiken (presentation and data collection), Arsen Sabayev (video editor).
Official team page: https://www.spaceappschallenge.org/2026/find-a-team/realpugs/

## What is inside

- **Intro** — the RealPugs Research Laboratory (the team’s design): access check, the doors open onto a control room. The central screen shows the live 3D Moon and Mars — choose a world to open its globe and catalogue. Side screens open About, Our impact, the NASA Space Apps Challenge page, the language switch, the quiz and the references. It can be replayed from the menu or the footer (`#/intro`); on phones and with reduced motion it opens without the door animation.
- **Choose a world** — two 3D globes. *Explore the Moon* / *Explore Mars* (`#/explore/moon`, `#/explore/mars`) zooms into one planet, shows real landing and impact sites as markers and opens that planet’s catalogue with filters.
- **Mission archive** (`#/missions`) — 147 Moon and 53 Mars records built from official catalogues (NASA NSSDCA lunar timeline and Mars chronology, NASA Science “Moon Missions”, the NASA/JPL table of Mars missions, ESA “Missions to Mars”), plus the missions to other worlds told in the story. One record is one launch. Launched, in-flight, planned and cancelled missions are separate groups. Filters: destination, category, mission class (orbital / landing / impact / flyby / crash), type, outcome, physical status, spacecraft status, country, agency, launch years, name search, sorting, reset and a match count.
- **Globe markers** — 57 landing and impact sites on the Moon (coordinates from the NASA NSSDCA “Table of Anthropogenic Impacts and Spacecraft on the Moon”, LROC and NSSDCA tables) and 11 on Mars (NASA/JPL mission pages; Zhurong from Liu et al., Nature Astronomy, 2022). Successful missions that never touched the surface are dots on inclined rings around the globe — 33 at the Moon and 15 at Mars (inner ring: orbiters; outer dashed ring: flybys and flights around and back). Pointing at any dot shows the year, the name and a short note on why the mission flew. Orbiters are never placed on the surface.
- **Significant missions with their own models** — Luna 9, Luna 16, Chang’e 4, Chandrayaan-3 and Tianwen-1/Zhurong have simplified schematic 3D models (on the globe and on their pages, clearly labelled as schematics) and pages with the story, why it matters, a timeline, where the hardware is now and official sources (NASA NSSDCA, ISRO, Chinese Academy of Sciences, NASA/UA HiRISE, Nature).
- **Mission pages** (`#/missions/<id>`) — a short intro, a compact facts panel, the 3D model with labelled parts (or a photo), a gallery of NASA Image Library photos with credits, pictures from the photo archive, and collapsible sections: story, timeline, science, historical significance, why it succeeded or failed, cost in the money of its time (only where a reliable figure exists), where it is now and its own bibliography.
- **Photo archive** — 513 pictures for 115 missions from the team’s archive (only pictures credited to NASA or other US government bodies, to ESA, or under an open licence). They appear on mission pages and in expanded catalogue rows and open in a full-screen viewer with the caption, credit, licence and a link to the original. Artist’s impressions are labelled.
- **Quiz** (`#/quiz`) — a game on its own page. Choose the Moon, Mars or everything; each round has 10 questions: story facts (pool of 39, answers shuffled, each with its source), launch years, who launched a mission, “which mission is in this picture” (from the archive, with distractors of a different type and decade) and one launch-order challenge. 20-second timer with points for speed, ×1.5 / ×2 streak multipliers, one 50/50 per round, keys 1–4, ranks, a personal best per mode, an answer review and “copy my result”. A language switch does not reset the round. The Wrap-up chapter shows a short invitation instead of the old inline quiz.
- **Our impact** — in the Wrap-up chapter (`#impact`; the old `#/team` address leads there): the cooperation with the National Library of the Republic of Kazakhstan in Almaty, the team photo, the four members and their roles, and a note that we publish no numbers we cannot prove.
- **Things to come back for** — badges for exploring (both globes, five mission pages, five archive pictures, the timeline, “Surprise me”, a quiz round, 9 of 10 correct), stored only in the browser; “Surprise me” buttons in the planet catalogue and the archive; “On this day” in the archive shows launch anniversaries for today or the next days.
- References, Timeline, Research library, Credits, Open source and AI disclosure pages. English, Russian and Kazakh, with narration.

## Run it locally

The 3D models load only over HTTP, not from `file://`.

```bash
cd vestige
python -m http.server 8000
# open http://localhost:8000/
```

Any static host works (GitHub Pages, Netlify, a school server). Keep `index.html` and the `models/` folder together.

## Files

```
index.html                 the whole site: markup, styles, data and code
models/planets/            original globe models (Moon: NASA SVS “Moon 3D Models for Web, AR, and Animation”; Mars: NASA/JPL “Planet Mars, 3D Model”)
models/moon/               original LRO and Apollo Lunar Module models (NASA)
models/mars/               original Mars Odyssey, InSight, MER, Curiosity and Viking models (NASA)
models/optimized/…         compressed copies; the site loads these first and falls back to the originals
img/                       team photo, RealPugs logo and favicon
img/archive/               archive pictures (WebP) with thumbnails
src/parts/, src/build.py     editable source parts; rebuild with: python3 src/build.py src/parts index.html
LICENSE, NOTICE            Apache-2.0 for the code; third-party terms in NOTICE
```

Model optimisation command used (originals are never overwritten):

```bash
gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 1024 --simplify false
```

(`--texture-size 4096` for the Moon globe, `2048` for Mars.)

## Sources and link checks

Every catalogue record links first to pages about that particular mission: NASA Science or NASA mission pages, the official pages of ESA, JAXA, ISRO, the Chinese Academy of Sciences and other agencies, NASA CLPS delivery pages, the NASA NSSDCA tables “Soviet Lunar Missions” and “Table of Anthropogenic Impacts and Spacecraft on the Moon”, and the matching entry (with page) in NASA’s book *Beyond Earth: A Chronicle of Deep Space Exploration, 1958–2016* (SP-2018-4041). The NSSDCA timeline pages are shown separately as catalogues. NSSDCA pages for individual spacecraft (`display.action`) currently return an error, so the site does not link to them.

All facts link to official sources first (NASA NSSDCA, NASA Science, NTRS, PDS, NASA/JPL, ESA, JAXA, ISRO, CNSA), then peer-reviewed papers. The AZMTH catalogue is no longer used. Check codes in the data: `v` — link checked on 14–15 Nov 2026; `n` — original document whose link could not be re-checked automatically; `u` — unavailable.

## Before you publish — team checklist

- [ ] **Open source page**: add the public GitHub repository link.
- [ ] **Archive pictures**: they were filtered by their credit line; open a few originals before publishing. The short English captions were compiled by the team from azmth.space pages — keep or remove them.

## Licence and data

The original code is released under the **Apache License 2.0** (see `LICENSE`). Third-party material keeps its own terms (see `NOTICE`): NASA 3D models follow the NASA media usage guidelines; mission data comes from NASA NSSDCA, NASA Science, NASA/JPL and ESA and is rewritten in our own words with links; archive pictures keep their own credits; scientific publications are linked, not copied.

---
