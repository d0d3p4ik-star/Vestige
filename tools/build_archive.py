#!/usr/bin/env python3
"""Vestige archive builder: AZMTH Moon/Mars catalogues -> compact site data.

Replaces the starter collector (which downloaded every responsive size of every
image). This one saves ONE original per figure, together with the caption,
credit and source link printed on the AZMTH page.

    python3 tools/build_archive.py --cache /tmp/azmth-cache      # full run
    python3 tools/build_archive.py --cache /tmp/azmth-cache --offline   # re-parse only

Outputs (relative to the repository root):
    data/catalogs/*.json                 source dataset snapshots (CC BY 4.0)
    data/mission-index.json              one normalized record per catalogue page
    data/missions/<planet>/<slug>.json   compact page record, loaded on demand
    data/image-index.json                every image: file, credit, source, rights flag
    data/build-report.json               exact counts, failures, provenance notes
    data/manifest.json                   list of all generated files
    images/<planet>/<slug>/*.webp        resized copies (max 1280 px) + hero thumbnails

Nothing is invented: a field that the source does not provide is left out or null.
Needs Python 3.10+, beautifulsoup4, lxml and Pillow.
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import hashlib
import io
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, unquote, urljoin, urlparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup
from PIL import Image

BASE = "https://azmth.space"
UA = "VestigeResearchArchive/2.0 (student educational project; NASA Space Apps Challenge)"
ROOT = Path(__file__).resolve().parent.parent
SOCIAL = ("twitter.com", "x.com", "facebook.com", "reddit.com", "bsky.app", "wa.me", "t.me")
MAX_PX, THUMB_PX = 1280, 520


def fetch(url: str, timeout: int = 45, retries: int = 3) -> bytes:
    last = None
    for attempt in range(retries):
        try:
            with urlopen(Request(url, headers={"User-Agent": UA}), timeout=timeout) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001 - every failure is reported, none hidden
            last = e
            time.sleep(1 + attempt * 2)
    raise RuntimeError(f"{type(last).__name__}: {last}")


def text(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def tidy(s: str) -> str:
    s = re.sub(r"\s+", " ", s or "").strip()
    return re.sub(r"\s+([.,;:)])", r"\1", s)


def image_path(img) -> str | None:
    """Original file path behind a Next.js <img> (/_next/image?url=<path>&w=...)."""
    src = img.get("src") or ""
    if src.startswith("/_next/image"):
        q = parse_qs(urlparse(src).query)
        return unquote(q["url"][0]) if q.get("url") else None
    return src or None


LICENCE_PATTERNS = [
    (r"\bCC0\b", "CC0"),
    (r"\bCC[ -]BY[ -]SA[ -]?(\d\.\d)?", "CC BY-SA"),
    (r"\bCC[ -]BY[ -]NC[\w -]*", "CC BY-NC (non-commercial)"),
    (r"\bCC[ -]BY[ -]?(\d\.\d)?", "CC BY"),
    (r"public domain|\bPD\b", "Public domain"),
    (r"\bGFDL\b", "GFDL"),
]
TYPE_PATTERNS = [
    (r"artist'?s? (impression|concept|rendering|view)|illustration|painting", "artist impression"),
    (r"\brender(ing|ed)?\b|\bCGI\b|concept (art|image|design)|visuali[sz]ation", "rendering"),
    (r"mock-?up|replica|test article|engineering (model|unit)|full-scale model|scale model", "replica / test article"),
    (r"diagram|schematic|cutaway|drawing|blueprint|\bmap\b", "diagram / map"),
    (r"\bstamp\b|mission patch|crew patch|\blogo\b|insignia|emblem", "stamp / patch / emblem"),
    (r"mosaic|panorama|composite|false[- ]colou?r|colou?ri[sz]ed", "processed image"),
    (r"photograph|\bphoto\b|imaged by|pictured|selfie|HiRISE|LROC", "photograph"),
]


def stated_licence(credit: str) -> str | None:
    for pat, label in LICENCE_PATTERNS:
        m = re.search(pat, credit, flags=re.I)
        if m:
            ver = m.group(1) if m.lastindex else None
            return f"{label} {ver}" if ver else label
    return None


def image_type(caption: str) -> str:
    for pat, label in TYPE_PATTERNS:
        if re.search(pat, caption, flags=re.I):
            return label
    return "image type unverified"


def parse_page(html: str, page_url: str) -> dict:
    soup = BeautifulSoup(html, "lxml")
    main = soup.find("main") or soup
    for t in main.find_all(["script", "style", "svg", "noscript"]):
        t.decompose()
    out: dict = {}
    h1 = main.find("h1")
    out["title"] = text(h1)
    # line under the title: "Soviet Union · Lander · 1966 · The space race  Success"
    head = h1.find_parent("div") if h1 else None
    ps = head.find_all("p", recursive=False) if head else []
    if not ps and h1:
        ps = [p for p in h1.find_all_next("p", limit=2)]
    out["tagline"] = text(ps[0]) if ps else ""
    out["short_status"] = text(ps[1]) if len(ps) > 1 else ""

    # headline numbers (value + label pairs)
    stats = []
    for ul in main.find_all("ul", attrs={"role": "list"}):
        for li in ul.find_all("li", recursive=False):
            sp = li.find_all("span", recursive=False)
            if len(sp) == 2:
                stats.append([tidy(text(sp[0])), tidy(text(sp[1]))])
        if stats:
            break
    out["stats"] = stats

    sections = {}
    for h2 in main.find_all("h2"):
        name = re.sub(r"^\d+\s*", "", text(h2))
        sec = h2.find_parent("section")
        if sec is not None:
            sections[name] = sec

    # mission facts: label + value (+ the source of that fact)
    facts = []
    sec = sections.get("Mission facts")
    if sec:
        for div in sec.find_all("div"):
            p = div.find_all("p", recursive=False)
            if len(p) == 2 and not div.find("div"):
                a = p[1].find("a", attrs={"aria-label": "Source for this fact"})
                src = a.get("href") if a else None
                if a:
                    a.extract()
                facts.append({"label": text(p[0]), "value": tidy(text(p[1])), "source": src})
        site_p = next((p for p in sec.find_all("p") if text(p).startswith("Site:")), None)
        if site_p:
            a = site_p.find("a")
            src = a.get("href") if a else None
            raw = tidy(re.sub(r"\(\s*source\s*\)", "", text(site_p))[5:])
            m = re.match(r"\s*(-?\d+(?:\.\d+)?)\s*°?\s*([NS])\s*,\s*(-?\d+(?:\.\d+)?)\s*°?\s*([EW])", raw)
            if m:
                lat = float(m.group(1)) * (1 if m.group(2) == "N" else -1)
                lon = float(m.group(3)) * (1 if m.group(4) == "E" else -1)
                note = tidy(raw[m.end():].lstrip(" ·"))
                prec = "approximate" if re.search(r"approx|estimate|never confirmed|unconfirmed|uncertain|unknown|disputed|candidate|not (been )?(located|found|identified)|predicted|planned|target", note, re.I) else "as stated by source"
                out["coordinates"] = {"lat": lat, "lon": lon, "text": raw, "note": note, "precision": prec, "source": src}
            else:
                out["site_note"] = {"text": raw, "source": src}
    out["facts"] = facts

    timeline = []
    sec = sections.get("Mission timeline")
    if sec:
        for li in sec.find_all("li"):
            p = li.find_all("p") or [x for x in li.find_all("span", recursive=False) if text(x)]
            if len(p) >= 2:
                a = p[1].find("a", href=True)
                timeline.append([text(p[0]), tidy(text(p[1]))] + ([a["href"]] if a else []))
    out["timeline"] = timeline

    refs = []
    for name, sec in sections.items():
        if name.startswith("Sources"):
            for a in sec.find_all("a", href=True):
                host = urlparse(a["href"]).netloc.lower()
                if host and "azmth.space" not in host and not any(s in host for s in SOCIAL):
                    refs.append({"title": tidy(text(a)), "url": a["href"]})
    seen, uniq = set(), []
    for r in refs:
        if r["url"] not in seen:
            seen.add(r["url"])
            uniq.append(r)
    out["references"] = uniq

    m = re.search(r"verified on\s*([0-9]{1,2} [A-Z][a-z]+ [0-9]{4})", text(main))
    out["facts_checked"] = m.group(1) if m else None
    out["sections"] = [n for n in sections if not n.startswith("Found this useful")]

    # figures: one record per original image file
    images, seen_paths = [], set()
    for fig in main.find_all("figure"):
        cap_el = fig.find("figcaption")
        for img in fig.find_all("img"):
            path = image_path(img)
            if not path or path in seen_paths or path.startswith("data:"):
                continue
            seen_paths.add(path)
            alt = tidy(img.get("alt") or "")
            cap_full = tidy(text(cap_el)) if cap_el else alt
            link = cap_el.find("a", href=True) if cap_el else None
            credit = ""
            if cap_el:
                if link:
                    credit = tidy(text(link))
                m2 = re.search(r"Credit:\s*(.+?)\.?$", cap_full)
                if m2 and len(m2.group(1)) > len(credit):
                    credit = tidy(m2.group(1))
                if not credit and alt and cap_full.startswith(alt.rstrip(".")):
                    credit = tidy(cap_full[len(alt.rstrip(".")):].lstrip(". "))
            caption = alt or cap_full
            images.append({
                "source_image_url": urljoin(BASE, path),
                "caption": caption,
                "credit": credit or None,
                "original_url": link.get("href") if link else None,
                "stated_licence": stated_licence(credit) if credit else None,
                "image_type": image_type(caption),
                "width": int(img.get("width") or 0) or None,
                "height": int(img.get("height") or 0) or None,
                "source_page": page_url,
            })
    out["images"] = images
    return out


def save_image(blob: bytes, dest: Path, max_px: int) -> tuple[int, int]:
    im = Image.open(io.BytesIO(blob))
    im.load()
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "transparency" in im.info or im.mode in ("LA", "PA") else "RGB")
    im.thumbnail((max_px, max_px), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=74, method=5)
    return im.size


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", required=True, help="Folder for raw downloads (kept out of the repository)")
    ap.add_argument("--offline", action="store_true", help="Use the cache only; download nothing")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()
    cache = Path(args.cache)
    (cache / "pages").mkdir(parents=True, exist_ok=True)
    (cache / "img").mkdir(parents=True, exist_ok=True)
    data = ROOT / "data"
    started = datetime.now(timezone.utc).isoformat(timespec="seconds")
    errors: list[dict] = []

    def cached(url: str, path: Path) -> bytes | None:
        if path.exists() and path.stat().st_size:
            return path.read_bytes()
        if args.offline:
            return None
        blob = fetch(url)
        path.write_bytes(blob)
        time.sleep(0.12)
        return blob

    # 1. datasets + catalogue listings
    sources = {
        "moon_catalog": f"{BASE}/moon/missions", "mars_catalog": f"{BASE}/mars/missions",
        "moon_json": f"{BASE}/data/moon-missions.json", "mars_json": f"{BASE}/data/mars-missions.json",
        "moon_data": f"{BASE}/moon/data", "mars_data": f"{BASE}/mars/data",
    }
    blobs = {}
    for key, url in sources.items():
        try:
            blobs[key] = cached(url, cache / f"{key}.bin")
        except Exception as e:  # noqa: BLE001
            errors.append({"source": url, "error": str(e)})
            blobs[key] = None
    (data / "catalogs").mkdir(parents=True, exist_ok=True)
    moon_ds = json.loads(blobs["moon_json"].decode("utf-8-sig")) if blobs["moon_json"] else {"missions": []}
    mars_ds = json.loads(blobs["mars_json"].decode("utf-8-sig")) if blobs["mars_json"] else []
    if blobs["moon_json"]:
        (data / "catalogs/moon-missions.json").write_bytes(blobs["moon_json"])
    if blobs["mars_json"]:
        (data / "catalogs/mars-missions.json").write_bytes(blobs["mars_json"])
    moon_map = {m["slug"]: m for m in moon_ds["missions"]}
    mars_map = {m["slug"]: m for m in mars_ds}

    # 2. page inventory from the HTML catalogues (Moon: /moon/missions/* + /moon/artemis-N)
    inventory: list[tuple[str, str, str]] = []
    listing: dict = {}   # catalogue row text: [name, year, operator/nation, type label, status label, status sentence]
    for planet in ("moon", "mars"):
        html = (blobs[f"{planet}_catalog"] or b"").decode("utf-8", "replace")
        paths = dict.fromkeys(re.findall(rf'href="(/{planet}/missions/[a-z0-9-]+)"', html))
        if planet == "moon":
            paths.update(dict.fromkeys(sorted(set(re.findall(r'href="(/moon/artemis-\d+)"', html)))))
        for p in paths:
            inventory.append((planet, p.rsplit("/", 1)[-1], p))
        soup = BeautifulSoup(html, "lxml")
        for p in paths:
            a = soup.find("a", href=p)
            parts = [x for x in a.get_text("|", strip=True).split("|") if x.strip() not in ("", "·")] if a else []
            listing[(planet, p.rsplit("/", 1)[-1])] = parts
    discovered = {pl: sum(1 for i in inventory if i[0] == pl) for pl in ("moon", "mars")}

    # 3. pages
    def get_page(item):
        planet, slug, path = item
        try:
            return item, cached(BASE + path, cache / "pages" / f"{planet}__{slug}.html"), None
        except Exception as e:  # noqa: BLE001
            return item, None, str(e)

    pages = {}
    with cf.ThreadPoolExecutor(args.workers) as ex:
        for item, blob, err in ex.map(get_page, inventory):
            if blob:
                pages[item] = blob.decode("utf-8", "replace")
            else:
                errors.append({"source": BASE + item[2], "error": err or "not in cache (offline run)"})

    # 4. parse + normalize
    records, index, image_jobs = {}, [], []
    for item in inventory:
        planet, slug, path = item
        page_url = BASE + path
        cat = (moon_map if planet == "moon" else mars_map).get(slug, {})
        page = parse_page(pages[item], page_url) if item in pages else None
        tag = [t.strip() for t in (page["tagline"] if page else "").split("·")]
        year = cat.get("year")
        if year is None and page:
            # Mars dataset has no year column: use the year printed in the page header, else the first timeline year
            m = re.search(r"\b(1[89]\d\d|20\d\d)\b", page["tagline"]) or (re.search(r"\b(1[89]\d\d|20\d\d)\b", page["timeline"][0][0]) if page["timeline"] else None)
            year = int(m.group(1)) if m else None
        row = listing.get((planet, slug), [])
        if not cat and len(row) >= 6:
            # page listed in the HTML catalogue but absent from the JSON dataset (the Artemis pages)
            cat = {"name": row[0], "year": int(row[1]) if row[1].isdigit() else None, "operator": row[2],
                   "nation": "United States" if row[2] == "NASA" else None, "type_label": row[3],
                   "type": {"Crewed flyby": "crewed-flyby", "Crewed landing": "crewed-landing"}.get(row[3], "other"),
                   "outcome": row[4].lower().replace(" ", "-"), "status": row[5], "from_listing": True}
            year = cat["year"]
        if planet == "mars" and len(tag) == 5:
            cat = {**cat, "nation": tag[1]}
        name = cat.get("name") or (page["title"] if page else slug)
        rec = {
            "id": f"{planet}:{slug}", "planet": planet, "slug": slug, "name": name,
            "year": year,
            "nation": cat.get("nation"),
            "operator": cat.get("operator") or cat.get("entity"),
            "entry_kind": cat.get("entry_kind") or ("mission" if planet == "mars" else None),
            "mission_type": cat.get("type"), "type_label": cat.get("type_label"),
            "outcome": cat.get("outcome"),
            "short_status": cat.get("status") or (row[5] if len(row) >= 6 else None) or (page["short_status"] if page else None),
            "reached_surface": cat.get("reached_surface"),
            "has_coordinates": cat.get("has_coordinates"),
            "era": cat.get("era"),
            "in_dataset_json": bool(cat) and not cat.get("from_listing"),
            "source_url": page_url,
            "source_checked_date": cat.get("facts_checked") or (page["facts_checked"] if page else None),
        }
        if page:
            rec.update({
                "page_title": page["title"], "tagline": page["tagline"], "stats": page["stats"], "facts": page["facts"],
                "timeline": page["timeline"], "references": page["references"], "page_sections": page["sections"],
                "coordinates": page.get("coordinates"), "site_note": page.get("site_note"), "images": [],
            })
            # lead picture: the first one that is not a patch, stamp or emblem (if there is one)
            lead = next((i for i, im in enumerate(page["images"]) if im["image_type"] != "stamp / patch / emblem"), 0)
            for n, im in enumerate(page["images"], 1):
                stem = re.sub(r"[^a-z0-9-]+", "-", Path(urlparse(im["source_image_url"]).path).stem.lower()).strip("-")[:60] or f"image-{n}"
                im["file"] = f"images/{planet}/{slug}/{stem}.webp"
                im["rights_status"] = "VERIFY_BEFORE_PUBLICATION"
                if n - 1 == lead:
                    im["lead"] = True
                image_jobs.append((rec, im, n - 1 == lead))
        records[item] = rec

    # 5. images: one original per figure -> resized WebP (+ thumbnail of the first image)
    def get_image(job):
        rec, im, hero = job
        url = im["source_image_url"]
        key = hashlib.sha1(url.encode()).hexdigest()
        try:
            blob = cached(url, cache / "img" / key)
            if blob is None:
                return job, "not in cache (offline run)"
            im["sha256_original"] = hashlib.sha256(blob).hexdigest()
            dest = ROOT / im["file"]
            if dest.exists():                                  # already converted on an earlier run
                with Image.open(dest) as done:
                    im["width"], im["height"] = done.size
            else:
                im["width"], im["height"] = save_image(blob, dest, MAX_PX)
            if hero:
                thumb = im["file"].replace(".webp", ".thumb.webp")
                if not (ROOT / thumb).exists():
                    save_image(blob, ROOT / thumb, THUMB_PX)
                im["thumb"] = thumb
            return job, None
        except Exception as e:  # noqa: BLE001
            return job, str(e)

    saved = failed = 0
    image_index = []
    with cf.ThreadPoolExecutor(args.workers) as ex:
        for (rec, im, hero), err in ex.map(get_image, image_jobs):
            if err:
                failed += 1
                im["missing_local_asset"] = True
                im["download_error"] = err
                im["file"] = None
            else:
                saved += 1
            rec["images"].append(im)
            image_index.append({"mission_id": rec["id"], "mission_name": rec["name"], **im})

    # 6. write
    written = []

    def dump(rel: str, obj, indent=None):
        p = ROOT / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(obj, ensure_ascii=False, indent=indent, separators=None if indent else (",", ":")), encoding="utf-8")
        written.append(rel)

    for item in inventory:
        rec = records[item]
        dump(f"data/missions/{rec['planet']}/{rec['slug']}.json", rec)
        hero = next((i for i in rec.get("images", []) if i.get("file") and i.get("thumb")), None)
        index.append({k: rec.get(k) for k in ("id", "planet", "slug", "name", "year", "nation", "operator", "entry_kind", "mission_type", "outcome", "short_status", "reached_surface", "has_coordinates", "in_dataset_json", "source_url", "source_checked_date")} | {
            "coordinates": ({k: rec["coordinates"][k] for k in ("lat", "lon", "precision")} if rec.get("coordinates") else None),
            "image_count": sum(1 for i in rec.get("images", []) if i.get("file")),
            "thumb": hero.get("thumb") if hero else None,
            "reference_count": len(rec.get("references", [])),
            "page_downloaded": item in pages,
        })
    dump("data/mission-index.json", index, 1)
    dump("data/image-index.json", image_index, 1)

    learn = {pl: sorted(set(re.findall(rf'href="(/{pl}/learn/[a-z0-9-]+)"', (blobs[f"{pl}_catalog"] or b"").decode("utf-8", "replace")))) for pl in ("moon", "mars")}
    counts = {
        "moon_catalog_pages_discovered": discovered["moon"], "mars_catalog_pages_discovered": discovered["mars"],
        "moon_pages_downloaded": sum(1 for i in pages if i[0] == "moon"), "mars_pages_downloaded": sum(1 for i in pages if i[0] == "mars"),
        "moon_json_count": len(moon_ds["missions"]), "mars_json_entries_total": len(mars_ds),
        "mars_json_entries_not_in_mission_catalogue": sorted(set(mars_map) - {i[1] for i in inventory if i[0] == "mars"}),
        "moon_pages_not_in_json": sorted({i[1] for i in inventory if i[0] == "moon"} - set(moon_map)),
        "images_referenced": len(image_jobs), "local_images_saved": saved, "image_download_failures": failed,
        "missions_without_any_image": sorted(r["id"] for r in records.values() if not any(i.get("file") for i in r.get("images", []))),
        "images_with_credit": sum(1 for i in image_index if i.get("credit")), "images_without_credit": sum(1 for i in image_index if not i.get("credit")),
        "images_with_stated_licence": sum(1 for i in image_index if i.get("stated_licence")),
        "references_total": sum(len(r.get("references", [])) for r in records.values()),
        "records_with_coordinates": sum(1 for r in records.values() if r.get("coordinates")),
        "records_with_timeline": sum(1 for r in records.values() if r.get("timeline")),
        "source_errors": len(errors),
    }
    report = {
        "started_utc": started, "completed_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "sources": sources, "counts": counts, "errors": errors,
        "dataset_license": "CC BY 4.0 (catalogue datasets): https://creativecommons.org/licenses/by/4.0/",
        "learn_pages_listed_not_missions": learn,
        "notes": [
            "Page inventory comes from the HTML catalogues, not from the JSON files: Moon = /moon/missions/* plus the Artemis pages /moon/artemis-N; Mars = /mars/missions/*.",
            "Mars JSON rows that are not in the mission catalogue are explainers/findings from /mars/learn and are not shown as missions.",
            "Every image keeps the caption, credit and original link printed on its AZMTH page and is flagged VERIFY_BEFORE_PUBLICATION. 'stated_licence' only repeats what the credit line says; it is not a rights clearance. The dataset licence does not cover the photographs.",
            "Local images are resized copies (WebP, longest side up to 1280 px); thumbnails are 520 px.",
            "image_type is a keyword guess from the caption; when nothing matches it is 'image type unverified'.",
            "Coordinates are copied from the page's 'Site' line with their note; 'precision' is 'approximate' when the note says so, otherwise 'as stated by source'.",
        ],
    }
    dump("data/build-report.json", report, 1)
    files = sorted(written + [str(p.relative_to(ROOT)) for p in (ROOT / "images").rglob("*.webp") if "/team/" not in str(p)] + ["data/catalogs/moon-missions.json", "data/catalogs/mars-missions.json"])
    dump("data/manifest.json", {"generated_utc": report["completed_utc"], "generator": "tools/build_archive.py", "file_count": len(files) + 1, "files": files + ["data/manifest.json"]}, 1)
    print(json.dumps(counts, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
