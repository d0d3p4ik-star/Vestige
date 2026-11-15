/* =====================================================================================
   7. РАЗДЕЛЫ САЙТА: заставка-лаборатория, выбор планеты и её каталог, страницы миссий,
      3D-просмотр, архив, источники, хронология, библиотека, команда, справочные страницы.
   Адреса разделов — через решётку: #/explore/moon, #/missions/apollo-11, #/references и т. д.
   ===================================================================================== */
const LT = o => o == null ? '' : typeof o === 'string' ? o : (o[state.lang] ?? o.en ?? o.ru ?? '');
const ui = (k, vars = {}) => LT(UI[k] ?? k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const langOf = text => /[А-Яа-яЁё]/.test(text) ? ' lang="ru"' : '';   // русские названия источников помечаем языком
const LOCALES = { en: 'en-US', ru: 'ru-RU', kk: 'kk-KZ' };
const MISSION = Object.fromEntries(MISSIONS.map(m => [m.id, m]));
const MISSION_BY_SITE = Object.fromEntries(MISSIONS.filter(m => m.site).map(m => [m.site, m]));
const COUNTRY = { USA: T('USA', 'США', 'АҚШ'), USSR: T('USSR', 'СССР', 'КСРО'), Russia: T('Russia', 'Россия', 'Ресей'), Europe: T('Europe (ESA)', 'Европа (ESA)', 'Еуропа (ESA)'), Japan: T('Japan', 'Япония', 'Жапония'), China: T('China', 'Китай', 'Қытай'), India: T('India', 'Индия', 'Үндістан'), Israel: T('Israel', 'Израиль', 'Израиль'), Korea: T('South Korea', 'Южная Корея', 'Оңтүстік Корея'), UAE: T('UAE', 'ОАЭ', 'БАӘ') };
const countryName = c => LT(COUNTRY[c]) || c;
const decadeLabel = d => ({ en: `${d}s`, ru: `${d}-е`, kk: `${d} жылдар` }[state.lang]);
const planetName = p => ui(p);
function plural(n, forms) {   // forms: { en: [one, many], ru: [один, два, пять], kk: [любое] }
  const f = LT(forms);
  if (state.lang === 'ru') { const a = n % 10, b = n % 100; return f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2]; }
  if (state.lang === 'en') return f[n === 1 ? 0 : 1];
  return f[0];
}
const firstSentences = (text, n = 2) => String(text || '').split(/(?<=[.!?])\s+(?=[A-ZА-ЯЁӘҒҚҢӨҰҮҺІ«“"0-9])/u).slice(0, n).join(' ');

/* ---------- Центральная база источников ---------- */
const REFS = [], REF = {};
for (const [id, missions, type, year, title, by, url, chk, sup] of REF_LIST) { const r = { id, missions: [...missions], type, year, title, by, url, chk, sup }; REFS.push(r); REF[id] = r; }
function agencyGroupOf(text) {
  const t = ` ${String(text).toLowerCase()} `, hits = [];
  if (/\bnasa\b|\bjpl\b|united states|\busa\b|lroc|usgs|hirise|planetary society|lunar and planetary|smithsonian|white house/.test(t)) hits.push('NASA');
  if (/ussr|soviet|okb|roscosmos|russia|lavochkin|iki\b/.test(t)) hits.push('USSR');
  if (/\besa\b|european|cnes|\bdlr\b|europe/.test(t)) hits.push('ESA');
  if (/cnsa|china/.test(t)) hits.push('China');
  if (/isro|india/.test(t)) hits.push('India');
  if (/jaxa|isas|japan|ispace/.test(t)) hits.push('Japan');
  return hits.length === 1 ? hits[0] : 'Other';
}
const missionGroup = m => m.country === 'USA' ? 'NASA' : m.country === 'USSR' ? 'USSR' : m.country === 'Europe' ? 'ESA' : agencyGroupOf(m.agency);
for (const r of REFS) {
  const ms = r.missions.map(id => MISSION[id]).filter(Boolean);
  r.planets = [...new Set(ms.map(m => m.planet))];
  r.groups = ms.length ? [...new Set(ms.map(missionGroup))] : ['General'];
}
const missionRefs = m => {
  const list = REFS.filter(r => r.missions.includes(m.id));
  if (PHOTOS[m.id] && !list.includes(REF['nasa-images'])) list.push(REF['nasa-images']);
  if (m.model) for (const id of ['nasa-3d', 'nasa-media']) if (!list.includes(REF[id])) list.push(REF[id]);
  return list;
};

/* ---------- Сноски: значок рядом с утверждением, по нажатию — список источников ---------- */
const CITE_ICON = '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M3 2.5h7l3 3v8H3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.5 8h5M5.5 10.5h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
function citeHTML(ids) {
  const refs = [...new Set(ids)].map(id => REF[id]).filter(Boolean);
  if (!refs.length) return '';
  const tip = refs.map(r => r.title).join(' · ');
  return `<button type="button" class="cite" data-cite="${esc(refs.map(r => r.id).join(','))}" title="${esc(tip)}" aria-label="${esc(ui('sourcesFor', { n: refs.length }))}" aria-haspopup="dialog">${CITE_ICON}</button>`;
}
const cites = ids => ids?.length ? `<span class="cites">${citeHTML(ids)}</span>` : '';
function renderCites(root = document) { $$('[data-refs]', root).forEach(el => { el.innerHTML = el.dataset.refs ? citeHTML(el.dataset.refs.split(',')) : ''; el.classList.add('cites'); }); }
const citePop = $('#cite-pop');
let citeOpener = null;
function openCite(btn) {
  const refs = btn.dataset.cite.split(',').map(id => REF[id]).filter(Boolean);
  citePop.innerHTML = `<p class="cite-pop-h">${esc(ui('sourcesFor', { n: refs.length }))}</p><ul>${refs.map(r => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener"${langOf(r.title)}>${esc(r.title)}</a><span${langOf(r.by)}>${esc(r.by)}${r.year ? ', ' + r.year : ''} · ${esc(LT(UI.refType[r.type]))}</span><span class="cite-pop-sup">${esc(LT(r.sup))}</span></li>`).join('')}</ul><button type="button" class="btn btn-sm cite-pop-x">${esc(ui('close'))}</button>`;
  citePop.hidden = false;
  const b = btn.getBoundingClientRect(), w = Math.min(360, window.innerWidth - 16);
  citePop.style.width = `${w}px`;
  const left = Math.max(8, Math.min(window.innerWidth - w - 8, b.left + b.width / 2 - w / 2));
  const below = b.bottom + 8 + citePop.offsetHeight < window.innerHeight;
  citePop.style.left = `${left}px`;
  citePop.style.top = `${below ? b.bottom + 6 : Math.max(8, b.top - citePop.offsetHeight - 6)}px`;
  citeOpener = btn; btn.setAttribute('aria-expanded', 'true');
  citePop.querySelector('a')?.focus();
}
function closeCite(returnFocus = true) {
  if (citePop.hidden) return;
  citePop.hidden = true;
  citeOpener?.setAttribute('aria-expanded', 'false');
  if (returnFocus && citeOpener?.isConnected) citeOpener.focus({ preventScroll: true });
  citeOpener = null;
}
on(document, 'click', e => {
  const btn = e.target.closest('.cite');
  if (btn) { e.preventDefault(); e.stopPropagation(); if (citeOpener === btn) closeCite(); else openCite(btn); return; }
  if (e.target.closest('.cite-pop-x')) { closeCite(); return; }
  if (!citePop.hidden && !citePop.contains(e.target)) closeCite(false);
}, true);
on(document, 'keydown', e => { if (e.key === 'Escape' && !citePop.hidden) { e.stopPropagation(); closeCite(); } }, true);
on(window, 'scroll', () => closeCite(false), { passive: true });
on(window, 'resize', () => closeCite(false));

/* ---------- Форматирование ---------- */
// казахские названия месяцев есть не во всех браузерах (Chrome показывает «M02»), поэтому пишем их сами
const KK_MONTHS = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
function fmtDate(s) {
  if (!s) return '—';
  const [y, mo, d] = String(s).split('-').map(Number);
  if (!mo) return String(y);
  if (state.lang === 'kk') return d ? `${y} ж. ${d} ${KK_MONTHS[mo - 1]}` : `${y} ж. ${KK_MONTHS[mo - 1]}`;
  return new Intl.DateTimeFormat(LOCALES[state.lang], d ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' } : { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, mo - 1, d || 1)));
}
function fmtMoney(amt, cur) {
  const big = amt >= 1e9, v = big ? amt / 1e9 : amt / 1e6;
  const n = v.toLocaleString(LOCALES[state.lang], { maximumFractionDigits: v < 10 ? 2 : 1 });
  const unit = { en: big ? 'billion' : 'million', ru: big ? 'млрд' : 'млн', kk: big ? 'млрд' : 'млн' }[state.lang];
  if (state.lang === 'en') return `${cur === 'EUR' ? '€' : '$'}${n} ${unit}`;
  return `${n} ${unit} ${cur === 'EUR' ? { ru: 'евро', kk: 'еуро' }[state.lang] : { ru: 'долларов', kk: 'доллар' }[state.lang]}`;
}
function fmtDuration(m) {
  const a = m.launch || m.arrive;
  if (!a) return '—';
  if (!m.end) return m.op === 'operational' ? `${ui('since')} ${fmtDate(a)} (${ui('ongoing')})` : '—';
  const d0 = Date.parse(a.length > 7 ? a : a + '-01'), d1 = Date.parse(m.end.length > 7 ? m.end : m.end + '-01'), days = Math.round((d1 - d0) / 864e5);
  if (days < 1) return ui('lessThanDay');
  if (days < 120) return `${days} ${ui('days')}`;
  return `${(days / 365.25).toLocaleString(LOCALES[state.lang], { maximumFractionDigits: 1 })} ${ui('years')}`;
}
const coordStr = (lat, lon) => `${num(Math.abs(lat), 2)}° ${t(lat >= 0 ? 'N' : 'S')}, ${num(Math.abs(lon), 2)}° ${t(lon >= 0 ? 'E' : 'W')}`;
const badge = (cls, text) => `<span class="badge ${cls}">${esc(text)}</span>`;
const opt = (v, label, sel) => `<option value="${esc(v)}"${String(v) === String(sel) ? ' selected' : ''}>${esc(label)}</option>`;

/* =====================================================================================
   Каталог миссий: записи из каталогов NASA (NSSDCA, NASA Science, NASA/JPL) + миссии с других миров
   ===================================================================================== */
const CRASH_IDS = new Set(['ranger-4']);   // попал в Луну, но уже неуправляемым
const WHERE_TO_PHYS = { surface: 'soft', orbit: 'orbit', flyby: 'flyby', returned: 'returned', never: 'never', unknown: 'unknown', planned: 'notyet', flight: 'flight', cancelled: 'cancelled' };
const physOf = (id, cls, outcome, where) => where === 'impact'
  ? (CRASH_IDS.has(id) || (['failure', 'partial'].includes(outcome) && ['lander', 'sample', 'rover'].includes(cls)) ? 'crash' : 'controlled')
  : WHERE_TO_PHYS[where] || 'unknown';
const opOf = (status, outcome) => status ? ({ op: 'operational', lost: 'lost', unk: 'unknown', ended: 'ended' }[status] || status)
  : outcome === 'planned' ? 'notyet' : outcome === 'cancelled' ? 'never' : outcome === 'inflight' ? 'operational' : 'ended';
const CLASS_OF = { orbiter: 'orbital', relay: 'orbital', 'crewed-orbit': 'orbital', lander: 'landing', rover: 'landing', sample: 'landing', 'crewed-landing': 'landing', impactor: 'impact', flyby: 'flyby', 'crewed-flyby': 'flyby', test: 'other' };
const SITE_OF = {};
for (const s of SITES) { const mid = s.mission || MISSION_BY_SITE[s.id]?.id; if (mid) SITE_OF[mid] = s.id; }
const RECORDS = [];
for (const [planet, rows] of [['moon', CATALOG_MOON], ['mars', CATALOG_MARS]]) {
  for (const [id, name, date, country, agency, cls, outcome, where, src = '', nssdc = null, status = null, note = null] of rows) {
    const m = MISSION[id];
    const rec = { id, planet, name, date, year: date ? Number(date.slice(0, 4)) : null, country, agency, cls, outcome, phys: physOf(id, cls, outcome, where), op: opOf(status, outcome), src, nssdc, note, mission: m || null, site: SITE_OF[id] || null };
    if (m) Object.assign(rec, { outcome: m.outcome, phys: m.phys, op: m.op });
    rec.cat = outcome === 'cancelled' ? 'cancelled' : outcome === 'planned' ? 'planned' : outcome === 'inflight' ? 'flight' : 'launched';
    RECORDS.push(rec);
  }
}
for (const m of MISSIONS.filter(x => !['moon', 'mars'].includes(x.planet))) {
  RECORDS.push({ id: m.id, planet: m.planet, name: null, date: m.launch, year: Number(m.launch.slice(0, 4)), country: m.country, agency: m.agency, cls: m.type, outcome: m.outcome, phys: m.phys, op: m.op, src: '', nssdc: null, note: null, mission: m, site: null, cat: 'launched' });
}
const REC = Object.fromEntries(RECORDS.map(r => [r.id, r]));
const REC_BY_SITE = Object.fromEntries(RECORDS.filter(r => r.site).map(r => [r.site, r]));
for (const r of RECORDS) { r.group = r.mission ? missionGroup(r.mission) : agencyGroupOf(`${r.agency} ${r.country}`); r.agencyKey = String(r.agency).split(/ \(| \/ /)[0]; r.klass = CLASS_OF[r.cls] || 'other'; }
const launched = planet => RECORDS.filter(r => r.planet === planet && r.year && r.cat !== 'planned' && r.cat !== 'cancelled');

// Названия записей каталога на русском и казахском (у миссий из рассказа — свои переводы)
const NAME_RULES = [[/^Luna (\d+)/, 'Луна-$1'], [/^Zond (\d+)/, 'Зонд-$1'], [/^Kosmos (\d+)/, 'Космос-$1'], [/^Apollo (\d+)/, 'Аполлон-$1'], [/^Surveyor (\d+)/, 'Сервейер-$1'],
  [/^Ranger (\d+)/, 'Рейнджер-$1'], [/^Pioneer (\d+)/, 'Пионер-$1'], [/^Pioneer P-(\d+)/, 'Пионер P-$1'], [/^Mariner (\d+)/, 'Маринер-$1'], [/^Mars (\d+)$/, 'Марс-$1'], [/^Mars (\d+) /, 'Марс-$1 '],
  [/^Phobos (\d)$/, 'Фобос-$1'], [/^Chandrayaan-(\d)/, 'Чандраян-$1'], [/^Tianwen-1 and the Zhurong rover/, 'Тяньвэнь-1 and «Чжужун»'], [/^Lunar Prospector/, 'Лунар Проспектор'], [/^Sputnik (\d+)/, 'Спутник-$1'], [/^Viking (\d)/, 'Викинг-$1'], [/^Chang’e (\d)/, 'Чанъэ-$1'], [/^Explorer (\d+)/, 'Эксплорер-$1'], [/^Lunar Orbiter (\d)/, 'Лунар Орбитер-$1']];
function recName(r) {
  if (r.mission) return LT(r.mission.name);
  if (state.lang === 'en') return r.name;
  if (/^Luna \(unnamed/.test(r.name)) return `${ui('unnamedLuna')}, ${fmtDate(r.date)}`;
  let name = r.name;
  for (const [re, to] of NAME_RULES) if (re.test(name)) { name = name.replace(re, to); break; }
  return name.replace(/\bYutu/g, 'Юйту').replace(/ and /g, state.lang === 'ru' ? ' и ' : ' және ');
}
const outcomeLabel = o => LT(UI.outcome[o]) || o;
const physLabel = p => LT(UI.phys[p]) || p;
const opLabel = o => LT(UI.op[o]) || o;
const clsLabel = c => LT(UI.cls[c]) || LT(UI.types[c]) || c;
// Страницы этой конкретной миссии (NASA Science, NASA, агентства, книга NASA «Beyond Earth», таблицы NSSDCA)
function missionLinks(r) {
  const name = r.name || (r.mission && r.mission.name.en) || r.id;
  return (MLINKS[r.id] || []).map(([k, a, b]) => {
    if (k === 'ref') return REF[a] ? { ...REF[a], mlink: true } : null;
    const o = { mlink: true, chk: 'v', type: 'doc', year: null };
    if (k === 's') Object.assign(o, { url: `https://science.nasa.gov/mission/${a}/`, title: `${name} — NASA Science`, by: 'NASA Science' });
    else if (k === 'n') Object.assign(o, { url: `https://www.nasa.gov/mission/${a}/`, title: `${name} — NASA`, by: 'NASA' });
    else if (k === 'b') Object.assign(o, { url: `${BE_PDF}#page=${b + BE_SHIFT}`, title: ui('beTitle', { n: a, p: b }), by: 'Siddiqi A. A., NASA History Office (SP-2018-4041)', year: 2018, type: 'history' });
    else if (k === 'r') Object.assign(o, { url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunarussr.html', title: ui('ruTable'), by: 'NASA NSSDCA', type: 'history' });
    else if (k === 'i') Object.assign(o, { url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html', title: ui('impTable'), by: 'NASA NSSDCA', type: 'data' });
    else if (k === 'c') Object.assign(o, { url: `https://science.nasa.gov/lunar-science/clps-deliveries/${a}/`, title: ui('clpsTitle', { name }), by: 'NASA Science' });
    else if (k === 'u') Object.assign(o, { url: a, title: `${name} — ${b}`, by: b });
    o.sup = UI.mlSup;
    return o;
  }).filter(Boolean);
}
function recSources(r) {
  const ids = [];
  for (const ch of r.src) { const ref = CATALOG_SRC[ch]?.[r.planet]; if (ref) ids.push(ref); }
  const site = r.site && SITE[r.site];
  if (site?.ref) ids.push(site.ref);
  else if (r.mission?.coords?.ref) ids.push(r.mission.coords.ref);
  return [...new Set(ids)].map(id => REF[id]).filter(Boolean);
}

/* ---------- Окно раздела ---------- */
const pageEl = $('#page'), pageBody = $('#page-body');
let pageOpener = null, viewer = null, pageRoute = null;
const ROUTES = {};
function parseRoute() {
  const h = location.hash;
  if (!h.startsWith('#/')) return null;
  const [name = 'missions', arg = null] = h.slice(2).split(/[/?]/).filter(Boolean).map(decodeURIComponent);
  return { name, arg };
}
function route() {
  const r = parseRoute();
  if (!r) {   // обычный якорь (#moon) или пустой адрес — рассказ
    closePage(false);
    if (state.explore) {
      exitExplore({ cut: true });
      const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'auto' });
    }
    return;
  }
  if (r.name === 'team') { closePage(false); if (state.explore) exitExplore({ cut: true }); history.replaceState(null, '', '#impact'); document.getElementById('impact')?.scrollIntoView({ behavior: 'auto' }); return; }
  if (r.name === 'intro') { history.replaceState(null, '', location.pathname + location.search); showLab({ replay: true }); return; }
  if (r.name === 'explore') {
    closePage(false);
    if (r.arg === 'moon' || r.arg === 'mars') enterExplore(r.arg);
    else { exitExplore(); window.scrollTo({ top: 0, behavior: 'auto' }); }
    return;
  }
  const render = ROUTES[r.name];
  if (!render) { history.replaceState(null, '', location.pathname + location.search); closePage(false); return; }
  openPage(r, render);
}
function openPage(r, render) {
  if (pageEl.hidden) pageOpener = document.activeElement;
  const same = pageRoute && pageRoute.name === r.name && pageRoute.arg === r.arg;
  pageRoute = r;
  closeCite(false);
  viewer?.dispose(); viewer = null;
  pageBody.innerHTML = render(r.arg) + footerHTML();
  renderCites(pageBody);
  pageEl.hidden = false;
  document.documentElement.classList.add('page-open');
  $('#main').inert = true; $('#explore').inert = true;
  if (state.selected && !state.explore) closeDossier(false);
  stopSpeech();
  stage?.pause?.(true);
  closeMenu();
  if (!same) pageEl.scrollTop = 0;
  pageBody.querySelectorAll('[data-viewer]').forEach(box => { viewer = new ModelViewer(box, box.dataset.viewer, box.dataset.scene); });
  wirePage(r);
  if (r.name === 'missions' && r.arg) bump('reader', 5, r.arg);
  if (r.name === 'timeline') award('timeline');
  if (r.name === 'quiz') (same ? qzRefresh : qzStart)();
  const h = pageBody.querySelector('h1');
  if (h && !same) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  document.title = `${h ? h.textContent : ''} — ${t('title')}`;
  pageEl.setAttribute('aria-label', h ? h.textContent : ui('missions'));
}
function closePage(clearHash = true) {
  if (pageEl.hidden) return;
  viewer?.dispose(); viewer = null;
  closeCite(false); stopSpeech();
  pageEl.hidden = true; pageBody.innerHTML = ''; pageRoute = null;
  clearInterval(qz.timer); qz.active = false;
  document.documentElement.classList.remove('page-open');
  $('#main').inert = !!state.explore; $('#explore').inert = false;
  stage?.pause?.(false);
  document.title = t('title');
  if (clearHash && location.hash.startsWith('#/')) history.pushState(null, '', state.explore ? `#/explore/${state.explore}` : location.pathname + location.search);
  if (pageOpener?.isConnected) pageOpener.focus({ preventScroll: true });
  pageOpener = null;
}
on(window, 'hashchange', route);
on($('#page-close'), 'click', () => closePage(true));
on(document, 'keydown', e => {
  if (e.key !== 'Escape' || document.fullscreenElement || !citePop.hidden) return;
  if (!pageEl.hidden) closePage(true);
  else if (state.explore && menuPanel.hidden) leaveExplore();
});

/* ---------- Меню ---------- */
const menuBtn = $('#menu-btn'), menuPanel = $('#menu-panel');
function closeMenu() { if (menuPanel.hidden) return; menuPanel.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
on(menuBtn, 'click', () => { const open = menuPanel.hidden; menuPanel.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); if (open) menuPanel.querySelector('a, button')?.focus(); });
on(document, 'click', e => { if (!menuPanel.hidden && !menuPanel.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });
on(document, 'keydown', e => { if (e.key === 'Escape' && !menuPanel.hidden) { closeMenu(); menuBtn.focus(); } });
function renderMenu() {
  const links = [['#/intro', 'replayIntro'], ['#/explore/moon', 'exploreMoon'], ['#/explore/mars', 'exploreMars'], ['#moon', 'tour'], ['#/missions', 'missions'], ['#/timeline', 'timeline'], ['#/research', 'research'], ['#/references', 'references'], ['#impact', 'impact'], ['#/quiz', 'quizTitle'], ['#/about', 'about'], ['#/challenge', 'challenge'], ['#/credits', 'credits'], ['#/open-source', 'openSource'], ['#/ai-disclosure', 'ai']];
  $('#menu-links').innerHTML = links.map(([href, k]) => `<a class="menu-link" href="${href}">${esc(ui(k))}</a>`).join('');
  $$('#menu-links a').forEach(a => on(a, 'click', closeMenu));
}

/* ---------- Подвал: официальная страница команды и оговорка ---------- */
function footerHTML() {
  return `<footer class="site-foot"><p><b>Vestige</b> — ${esc(ui('footTeam'))}. <a href="${esc(TEAM.official)}" target="_blank" rel="noopener">${esc(ui('officialTeam'))} ↗</a> · <a href="#impact">${esc(ui('impact'))}</a> · <a href="#/quiz">${esc(ui('quizTitle'))}</a> · <a href="#/credits">${esc(ui('credits'))}</a> · <a href="#/intro">${esc(ui('replayIntro'))}</a></p></footer>`;
}
function renderMainFooter() { const box = $('#main-foot'); if (box) box.innerHTML = footerHTML(); }

/* =====================================================================================
   Каталог: фильтры и список (общий для архива и для режима «Исследовать»)
   ===================================================================================== */
const freshFilters = () => ({ q: '', planet: '', cat: '', cls: '', klass: '', outcome: '', phys: '', op: '', country: '', agency: '', from: '', to: '', surface: false, sort: 'year' });
const CATS = ['launched', 'flight', 'planned', 'cancelled'];
function catalogHTML(prefix, st, fixedPlanet) {
  const pool = RECORDS.filter(r => !fixedPlanet || r.planet === fixedPlanet);
  const count = (key) => { const c = {}; for (const r of pool) c[r[key]] = (c[r[key]] || 0) + 1; return Object.keys(c).sort((a, b) => c[b] - c[a] || a.localeCompare(b)); };
  const sel = (name, label, values, labelFn) => `<label><span>${esc(label)}</span><select name="${name}">${opt('', ui('all'), st[name])}${values.map(v => opt(v, labelFn(v), st[name])).join('')}</select></label>`;
  return `<form class="filters" id="${prefix}-form" role="search" onsubmit="return false">
    <label class="f-wide"><span>${esc(ui('search'))}</span><input type="search" name="q" value="${esc(st.q)}" placeholder="${esc(ui('searchPh'))}" autocomplete="off"></label>
    ${fixedPlanet ? '' : sel('planet', ui('fPlanet'), ['moon', 'mars', 'other'], v => v === 'other' ? ui('otherWorlds') : planetName(v))}
    ${sel('cat', ui('fCategory'), CATS.filter(c => pool.some(r => r.cat === c)), v => ui(`cat_${v}`))}
    ${sel('klass', ui('fClass'), ['orbital', 'landing', 'impact', 'flyby', 'crash'], v => ui(`klass_${v}`))}
    <details class="f-more f-wide"${st.cls || st.outcome || st.phys || st.op || st.country || st.agency || st.from || st.to ? ' open' : ''}><summary>${esc(ui('moreFilters'))}</summary><div class="filters f-inner">
      ${sel('cls', ui('fType'), count('cls'), clsLabel)}
      ${sel('outcome', ui('fOutcome'), count('outcome'), outcomeLabel)}
      ${sel('phys', ui('fPhys'), count('phys'), physLabel)}
      ${sel('op', ui('fOp'), count('op'), opLabel)}
      ${sel('country', ui('fCountry'), count('country'), countryName)}
      ${sel('agency', ui('fAgency'), count('agencyKey'), v => v)}
      <label><span>${esc(ui('fYearFrom'))}</span><input type="number" name="from" inputmode="numeric" min="1950" max="2035" value="${esc(st.from)}"></label>
      <label><span>${esc(ui('fYearTo'))}</span><input type="number" name="to" inputmode="numeric" min="1950" max="2035" value="${esc(st.to)}"></label>
    </div></details>
    <label><span>${esc(ui('sortBy'))}</span><select name="sort">${opt('year', ui('sortYear'), st.sort)}${opt('yeard', ui('sortYearDesc'), st.sort)}${opt('name', ui('sortName'), st.sort)}</select></label>
    <label class="f-check"><input type="checkbox" name="surface"${st.surface ? ' checked' : ''}> <span>${esc(ui('fSurface'))}</span></label>
    <button type="reset" class="btn btn-sm">${esc(ui('resetFilters'))}</button>
  </form>
  <p class="count" id="${prefix}-count" aria-live="polite"></p>
  <div id="${prefix}-list" class="rec-list"></div>`;
}
const SURFACE = new Set(['soft', 'controlled', 'crash']);
function filterRecords(st, fixedPlanet) {
  const q = st.q.trim().toLowerCase(), from = Number(st.from) || 0, to = Number(st.to) || 9999;
  return RECORDS.filter(r => (!fixedPlanet || r.planet === fixedPlanet) &&
    (!st.planet || (st.planet === 'other' ? !['moon', 'mars'].includes(r.planet) : r.planet === st.planet)) &&
    (!st.cat || r.cat === st.cat) && (!st.cls || r.cls === st.cls) && (!st.outcome || r.outcome === st.outcome) && (!st.phys || r.phys === st.phys) &&
    (!st.op || r.op === st.op) && (!st.country || r.country === st.country) && (!st.agency || r.agencyKey === st.agency) &&
    (!st.klass || (st.klass === 'crash' ? r.phys === 'crash' : r.klass === st.klass)) && (!st.surface || SURFACE.has(r.phys)) &&
    ((!st.from && !st.to) || (r.year && r.year >= from && r.year <= to)) &&
    (!q || [recName(r), r.name, r.mission ? Object.values(r.mission.name).join(' ') : '', r.agency, r.country, countryName(r.country), r.year, clsLabel(r.cls), outcomeLabel(r.outcome), physLabel(r.phys), LT(r.note), r.nssdc].join(' ').toLowerCase().includes(q)));
}
function recRow(r, prefix) {
  const body = `${prefix}-b-${r.id}`;
  const site = r.site && SITE[r.site];
  const facts = [[ui('fLaunch'), fmtDate(r.date)], [ui('fCountry'), countryName(r.country)], [ui('fAgency'), r.agency], [ui('fType'), clsLabel(r.cls)], [ui('fOutcome'), outcomeLabel(r.outcome)], [ui('fPhys'), physLabel(r.phys)], [ui('fOp'), opLabel(r.op)]];
  if (site && !site.orbit) facts.push([ui('fCoords'), coordStr(site.lat, site.lon)]);
  if (r.nssdc && /^\d{4}-\d{3}/.test(r.nssdc)) facts.push([ui('nssdcId'), r.nssdc]);
  const ml = missionLinks(r), src = recSources(r).filter(x => !ml.some(y => y.url === x.url));   // без повторов
  return `<li class="rec${r.mission ? ' is-feat' : ''}" id="${prefix}-r-${esc(r.id)}" data-planet="${r.planet}">
    <button type="button" class="rec-head" aria-expanded="false" aria-controls="${body}">
      <span class="rec-year">${r.year ?? '—'}</span>
      <span class="rec-main"><span class="rec-name">${esc(recName(r))}</span><span class="rec-meta">${esc(countryName(r.country))} · ${esc(clsLabel(r.cls))}</span></span>
      <span class="rec-tags">${badge(`o-${r.outcome}`, outcomeLabel(r.outcome))}${SURFACE.has(r.phys) ? badge(`p-${r.phys}`, physLabel(r.phys)) : ''}${r.mission || PROFILES[r.id] ? badge('feat', ui('featured')) : ''}${site ? `<span class="pin" title="${esc(ui('onGlobe'))}"><span aria-hidden="true">●</span><span class="sr">${esc(ui('onGlobe'))}</span></span>` : ''}</span>
    </button>
    <div class="rec-body" id="${body}" hidden>
      <dl class="rec-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      ${r.note || DESC[r.id] ? `<p class="rec-note">${esc(LT(r.note || DESC[r.id]))}</p>` : ''}
      ${ARCHIVE_IMG[r.id] ? `<div class="rec-photos">${archiveGallery(r.id, 4)}${ARCHIVE_IMG[r.id].length > 4 ? `<a class="rec-more" href="#/missions/${esc(r.id)}">${esc(ui('photosAll', { n: ARCHIVE_IMG[r.id].length }))}</a>` : ''}</div>` : ''}
      <p class="rec-actions">${r.mission || PROFILES[r.id] ? `<a class="btn btn-sm btn-solid" href="#/missions/${esc(r.id)}">${esc(ui('openMission'))}</a>` : `<a class="btn btn-sm" href="#/missions/${esc(r.id)}">${esc(ui('openPage'))}</a>`}${site ? `<button type="button" class="btn btn-sm" data-show-site="${esc(site.id)}">${esc(ui('showOnGlobe'))}</button>` : ''}</p>
      ${ml.length ? `<p class="rec-src rec-ml"><b>${esc(ui('missionPages'))}:</b> ${ml.map(x => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)} ↗</a>`).join(' · ')}</p>` : ''}
      ${src.length ? `<p class="rec-src"><b>${esc(ui('catalogues'))}:</b> ${src.map(x => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a>`).join(' · ')}</p>` : ''}
    </div></li>`;
}
function paintCatalog(prefix, st, fixedPlanet) {
  const list = filterRecords(st, fixedPlanet);
  const name = r => recName(r);
  const by = { year: (a, b) => (a.year ?? 9999) - (b.year ?? 9999) || String(a.date).localeCompare(String(b.date)) || name(a).localeCompare(name(b)),
    yeard: (a, b) => (b.year ?? -1) - (a.year ?? -1) || String(b.date).localeCompare(String(a.date)),
    name: (a, b) => name(a).localeCompare(name(b), LOCALES[state.lang], { numeric: true }) }[st.sort] || ((a, b) => 0);
  const total = RECORDS.filter(r => !fixedPlanet || r.planet === fixedPlanet).length;
  $(`#${prefix}-count`).textContent = ui('matches', { n: list.length, total });
  const box = $(`#${prefix}-list`);
  if (!list.length) { box.innerHTML = `<p class="text-dim">${esc(ui('noMatches'))}</p>`; return; }
  box.innerHTML = CATS.map(cat => {
    const rows = list.filter(r => r.cat === cat).sort(by);
    if (!rows.length) return '';
    return `<section class="rec-group"><h3 class="rec-group-h">${esc(ui(`cat_${cat}`))} <span>${rows.length}</span></h3><ul class="rec-ul">${rows.map(r => recRow(r, prefix)).join('')}</ul></section>`;
  }).join('');
}
function toggleRec(li, open) {
  const head = li.querySelector('.rec-head'), body = li.querySelector('.rec-body');
  const willOpen = open ?? head.getAttribute('aria-expanded') !== 'true';
  head.setAttribute('aria-expanded', String(willOpen)); body.hidden = !willOpen;
  li.classList.toggle('is-open', willOpen);
}
function wireCatalog(prefix, st, fixedPlanet, root) {
  const form = $(`#${prefix}-form`, root); if (!form) return;
  let last = '';
  const read = () => { for (const el of form.elements) if (el.name) st[el.name] = el.type === 'checkbox' ? el.checked : el.value; const key = JSON.stringify(st); if (key === last) return; last = key; paintCatalog(prefix, st, fixedPlanet); };   // без изменений — не перерисовываем (иначе теряется щелчок после ввода)
  form.addEventListener('input', read); form.addEventListener('change', read);
  form.addEventListener('reset', () => setTimeout(() => { Object.assign(st, freshFilters()); last = ''; read(); }, 0));
  $(`#${prefix}-list`, root).addEventListener('click', e => {
    const head = e.target.closest('.rec-head');
    if (head) { toggleRec(head.closest('.rec')); return; }
    const show = e.target.closest('[data-show-site]');
    if (show) { e.preventDefault(); showSite(show.dataset.showSite); }
  });
  last = JSON.stringify(st); paintCatalog(prefix, st, fixedPlanet);
}

/* =====================================================================================
   Режим «Исследовать»: выбранная планета крупным планом, слева (или снизу) — её каталог
   ===================================================================================== */
const explorePanel = $('#explore');
const exploreState = { moon: freshFilters(), mars: freshFilters() };
let exploreFocus = null;   // точка, которую нужно показать сразу после входа в режим
const ACCENT = { moon: 'rgb(169 207 255)', mars: 'rgb(242 166 94)' };
function enterExplore(key) {
  if (!$('#lab').hidden) labFinish?.();
  if (state.selected && !state.explore) closeDossier(false);
  const was = state.explore;
  state.explore = key;
  document.documentElement.classList.add('exploring');
  document.documentElement.dataset.explore = key;
  if (!was) window.scrollTo({ top: 0, behavior: 'auto' });
  setWorld(key); award(key);
  document.documentElement.style.setProperty('--accent', ACCENT[key]);
  $$('[data-nav]').forEach(a => a.setAttribute('aria-current', 'false'));
  paintExplore();
  explorePanel.hidden = false;
  $('#main').inert = true;
  if (exploreFocus) { const id = exploreFocus; exploreFocus = null; setTimeout(() => exploreSelect(id, { from: 'link' }), reducedMotion.matches ? 0 : 700); }
  else if (was !== key) { const h = $('#explore-h'); h.tabIndex = -1; h.focus({ preventScroll: true }); explorePanel.scrollTop = 0; }
}
function exitExplore({ cut = false } = {}) {
  if (!state.explore) return;
  state.explore = null; state.selected = null;
  document.documentElement.classList.remove('exploring');
  delete document.documentElement.dataset.explore;
  explorePanel.hidden = true;
  $('#main').inert = false;
  setWorld('none');
  if (cut) stage?.exploreCut?.();
  lastAccentReset();
}
function lastAccentReset() { document.documentElement.style.removeProperty('--accent'); lastAccent = ''; onScroll(); }
function leaveExplore() {   // кнопка «Выбрать другой мир»
  history.pushState(null, '', location.pathname + location.search);
  exitExplore();
  window.scrollTo({ top: 0, behavior: 'auto' });
  $('#pick-moon')?.focus({ preventScroll: true });
}
on($('#explore-back'), 'click', leaveExplore);
function paintExplore() {
  const key = state.explore; if (!key) return;
  const n = launched(key).length, first = Math.min(...launched(key).map(r => r.year));
  const sites = SITES.filter(s => s.world === key).length;
  $('#explore-h').textContent = planetName(key === 'moon' ? 'moonTitle' : 'marsTitle');
  $('#explore-lede').innerHTML = `${esc(ui(key === 'moon' ? 'exMoonLede' : 'exMarsLede', { n, first, word: plural(n, UI.launchesWord), sites }))}${cites(key === 'moon' ? ['nssdc-lunar-timeline', 'nasa-moon-missions'] : ['nssdc-mars-chrono', 'jpl-mars-history', 'esa-mars-list'])}`;
  $('#explore-legend').innerHTML = `<li><i class="lg lg-site"></i>${esc(ui('lgSite'))}</li><li><i class="lg lg-impact"></i>${esc(ui('lgImpact'))}</li><li><i class="lg lg-orbit"></i>${esc(ui('lgOrbit'))}</li><li><i class="lg lg-ring"></i>${esc(ui('lgRing'))}</li><li><i class="lg lg-fly"></i>${esc(ui('lgFly'))}</li>`;
  $('#explore-back').lastElementChild.textContent = ui('chooseWorld');
  if (!$('#explore-surprise')) $('#explore-back').insertAdjacentHTML('afterend', ` <button type="button" class="btn btn-sm" id="explore-surprise"></button>`);
  $('#explore-surprise').textContent = ui('surprise'); $('#explore-surprise').onclick = () => surprise();
  const box = $('#explore-cat');
  box.innerHTML = catalogHTML(`ex-${key}`, exploreState[key], key);
  wireCatalog(`ex-${key}`, exploreState[key], key, box);
  renderCites(explorePanel);
}
// Выбрать запись по точке на глобусе (или по ссылке «Показать на глобусе»)
function exploreSelect(siteId, { from = 'globe' } = {}) {
  const rec = REC_BY_SITE[siteId], key = state.explore; if (!rec || !key) return;
  const prefix = `ex-${key}`;
  let li = document.getElementById(`${prefix}-r-${rec.id}`);
  if (!li) { Object.assign(exploreState[key], freshFilters()); paintExplore(); li = document.getElementById(`${prefix}-r-${rec.id}`); }
  if (!li) return;
  $$(`#${prefix}-list .rec.is-open`).forEach(x => { if (x !== li) toggleRec(x, false); });
  toggleRec(li, true);
  state.selected = siteId;
  stage?.focusSite?.(siteId);
  li.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  if (from !== 'globe') li.querySelector('.rec-head').focus({ preventScroll: true });
}
function showSite(siteId) {
  const site = SITE[siteId]; if (!site) return;
  if (state.explore === site.world && pageEl.hidden) { exploreSelect(siteId, { from: 'list' }); return; }
  exploreFocus = siteId;
  location.hash = `#/explore/${site.world}`;
}

/* =====================================================================================
   Страница миссии: сначала аппарат и его значение, подробности — в раскрывающихся разделах
   ===================================================================================== */
function statusBadges(m) {
  return [badge(`o-${m.outcome}`, `${ui('fOutcome')}: ${outcomeLabel(m.outcome)}`), badge('neutral', opLabel(m.op)), badge(`p-${m.phys}`, physLabel(m.phys))].join('');
}
const textWithRefs = ([text, refs]) => `${esc(LT(text))}${cites(refs)}`;
const imgUrl = (id, size) => `https://images-assets.nasa.gov/image/${encodeURIComponent(id)}/${encodeURIComponent(id)}~${size}.jpg`;
const imgPage = id => `https://images.nasa.gov/details/${encodeURIComponent(id)}`;
function photoFigure([id, size, kind, caption, credit], big = false) {
  const kindLabel = kind === 'art' ? ui('kindArt') : kind === 'mosaic' ? ui('kindMosaic') : ui('kindPhoto');
  return `<figure class="${big ? 'm-photo' : 'g-item'}${size === 'thumb' ? ' is-small' : ''}">
    <a href="${imgPage(id)}" target="_blank" rel="noopener" aria-label="${esc(`${LT(caption)} — ${ui('openOriginal')}`)}"><img src="${imgUrl(id, size)}" alt="${esc(LT(caption))}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-photo-fail></a>
    <figcaption>${esc(LT(caption))}<span class="g-credit">${kind === 'art' ? `<b class="kind-art">${esc(kindLabel)}</b> · ` : `${esc(kindLabel)} · `}${esc(ui('credit'))}: <span${langOf(credit)}>${esc(credit)}</span> · <a href="${imgPage(id)}" target="_blank" rel="noopener">NASA Image Library ↗</a></span></figcaption></figure>`;
}
ROUTES.missions = arg => arg ? missionPage(arg) : archivePage();
function missionPage(id) {
  const m = MISSION[id];
  if (!m) return PROFILES[id] && REC[id] ? profilePage(REC[id], PROFILES[id]) : REC[id] ? recordPage(REC[id]) : `<h1 class="page-h1">${esc(ui('missions'))}</h1><p>${esc(ui('noMatches'))}</p>`;
  const site = m.site ? SITE[m.site] : null, a = m.model ? ASSET[m.model] : null, rec = REC[m.id];
  const photos = PHOTOS[m.id] || [];
  const heroPhoto = !a ? photos.find(p => p[1] === 'medium' || p[1] === 'small') : null;
  const gallery = photos.filter(p => p !== heroPhoto);
  const lede = site ? firstSentences(L(site.text), 2) : firstSentences(LT(m.story) || LT(m.obj), 2);
  const list = MISSIONS.filter(x => x.planet === m.planet), i = list.indexOf(m), prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
  const coordsText = m.coords ? `${coordStr(m.coords.lat, m.coords.lon)} (${ui(m.coords.conf === 'confirmed' ? 'confConfirmed' : 'confApprox')})${cites([m.coords.ref])}` : esc(m.phys === 'orbit' ? ui('notApplicable') : ui('confUnknown'));
  const facts = [['fLaunch', esc(fmtDate(m.launch))], ['fArrive', esc(fmtDate(m.arrive))], ['fDuration', esc(fmtDuration(m))], ['fPhys', esc(physLabel(m.phys))], ['fOp', esc(opLabel(m.op))], ['fCoords', coordsText]];
  const labels = (MODEL_LABELS[a?.assetId] || []).length > 0;
  const visual = a
    ? `<div class="viewer-wrap" data-viewer="${a.assetId}" data-scene="${a.modelType === 'orbiter' ? 'orbit' : 'surface'}" role="group" aria-label="${esc(`${ui('sec3d')}: ${LT(a.spacecraftName)}`)}">
         <div class="viewer"><div class="viewer-stage"></div><div class="viewer-tags" aria-hidden="true"></div><p class="viewer-status" role="status">${esc(ui('vLoading'))}</p></div>
         <div class="viewer-ui"><button type="button" class="btn btn-sm" data-v="reset">${esc(ui('vReset'))}</button>${labels ? `<button type="button" class="btn btn-sm" data-v="labels" aria-pressed="true">${esc(ui('vLabels'))}</button>` : ''}<button type="button" class="btn btn-sm" data-v="full">${esc(ui('vFull'))}</button></div>
         <p class="viewer-note">${a.isRepresentativeModel ? `<b class="accent">${esc(ui('vRep'))}.</b> ` : ''}${esc(ui('vHelp'))} ${esc(ui('vSource'))}: ${esc(LT(a.source))}${a.sourceRef ? cites([a.sourceRef, 'nasa-media']) : ''}</p>
       </div>`
    : heroPhoto ? photoFigure(heroPhoto, true) : '';
  const IMP_SCI = [['sci', 'impSci'], ['tech', 'impTech']], IMP_HIST = [['hist', 'impHist'], ['edu', 'impEdu'], ['fut', 'impFut']];
  const impCards = keys => `<div class="impact">${keys.map(([k, label]) => `<div class="impact-card"><h3>${esc(ui(label))}</h3><p>${m.imp[k] ? textWithRefs(m.imp[k]) : `<span class="text-dim">${esc(ui('noDoc'))}</span>`}</p></div>`).join('')}</div>`;
  const costRows = m.cost.length ? `<div class="table-wrap"><table class="data"><thead><tr><th scope="col">${esc(ui('costOriginal'))}</th><th scope="col">${esc(ui('costScope'))}</th><th scope="col">${esc(ui('costConf'))}</th><th scope="col">${esc(ui('costSource'))}</th></tr></thead><tbody>${m.cost.map(c => `<tr><td class="num"><b>${esc(fmtMoney(c.amt, c.cur))}</b><br><span class="text-dim">${esc(LT(c.yr))}</span></td><td>${esc(LT(c.scope))}</td><td>${esc(ui({ audited: 'confAudited', official: 'confOfficial', estimate: 'confEstimate', historical: 'confHistorical' }[c.conf]))}</td><td><a href="${esc(REF[c.ref].url)}" target="_blank" rel="noopener">${esc(REF[c.ref].by)}${REF[c.ref].year ? ', ' + REF[c.ref].year : ''}</a></td></tr>`).join('')}</tbody></table></div>`
    : '';   // если надёжных данных о стоимости нет, раздел не показываем
  const refs = missionRefs(m);
  if (REC[m.id]) for (const x of missionLinks(REC[m.id])) if (!refs.some(y => y.url === x.url)) refs.unshift(x);
  const groups = UI.refGroupsOrder.map(type => {
    const items = refs.filter(r => r.type === type);
    return items.length ? `<h3 class="ref-group">${esc(LT(UI.refType[type]))}</h3><ul class="refs">${items.map(refItem).join('')}</ul>` : '';
  }).join('');
  const acc = (key, title, body, open = false) => `<details class="acc" id="acc-${key}"${open ? ' open' : ''}><summary><span>${esc(title)}</span></summary><div class="acc-body">${body}</div></details>`;
  const storyBody = `${site ? `<p>${esc(L(site.text))}${cites(m.art[1])}</p>${site.science ? `<p><b class="accent">${esc(t('science'))}</b> ${esc(L(site.science))}${cites(m.imp.sci?.[1])}</p>` : ''}` : ''}${m.story ? `<p>${esc(LT(m.story))}${cites(m.tl.map(x => x[2]).slice(0, 2))}</p>` : ''}<p><b class="accent">${esc(ui('fObjective'))}.</b> ${esc(LT(m.obj))}</p>`;
  return `<article class="mission" data-planet="${esc(m.planet)}">
  <nav class="crumbs" aria-label="${esc(ui('missions'))}"><a href="#/missions">${esc(ui('missions'))}</a> <span aria-hidden="true">/</span> ${['moon', 'mars'].includes(m.planet) ? `<a href="#/explore/${m.planet}">${esc(planetName(m.planet))}</a>` : esc(planetName(m.planet))}</nav>
  <section class="m-hero${visual ? '' : ' no-visual'}" data-speak>
    <div class="m-hero-text">
      <p class="m-kicker">${esc(m.agency)} · ${esc(countryName(m.country))} · ${esc(clsLabel(rec?.cls || m.type))}</p>
      <h1 class="page-h1">${esc(LT(m.name))}</h1>
      <p class="m-lede">${esc(lede)}</p>
      <div class="badges no-say">${statusBadges(m)}</div>
      <dl class="m-facts no-say">${facts.map(([k, v]) => `<div><dt>${esc(ui(k))}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <p class="m-actions no-say"><button type="button" class="btn btn-sm speak-page" data-speak-root="m-speak" aria-pressed="false"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z" fill="currentColor"/><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span data-str="listen">${esc(t('listen'))}</span></button>${site ? `<button type="button" class="btn btn-sm" data-show-site="${esc(site.id)}">${esc(ui('showOnGlobe'))}</button>` : m.orbiter ? `<a class="btn btn-sm" href="#/explore/${m.planet}">${esc(ui('showInOrbit'))}</a>` : ''}</p>
    </div>
    ${visual ? `<div class="m-hero-visual">${visual}</div>` : ''}
  </section>
  ${gallery.length ? `<section class="m-gallery" aria-labelledby="g-h"><h2 id="g-h" class="sec-h">${esc(ui('secGallery'))}</h2><div class="gallery">${gallery.map(p => photoFigure(p)).join('')}</div></section>` : ''}
  ${ARCHIVE_IMG[m.id] ? `<section class="m-gallery" aria-labelledby="ga-h"><h2 id="ga-h" class="sec-h">${esc(ui('secArchive'))} <span class="text-dim text-[1rem]">${ARCHIVE_IMG[m.id].length}</span></h2>${archiveGallery(m.id)}</section>` : ''}
  <div class="m-sections">
    <div id="m-speak" hidden></div>
    ${acc('story', ui('secStory'), storyBody, true)}
    ${acc('timeline', ui('secTimeline'), `<ol class="tl">${m.tl.map(([d, txt, ref]) => `<li><time>${esc(fmtDate(d))}</time><span>${esc(LT(txt))}${cites([ref])}</span></li>`).join('')}</ol>`)}
    ${acc('science', ui('secScience'), `${impCards(IMP_SCI)}<p class="mt-4"><b class="accent">${esc(ui('secValue'))}.</b> ${textWithRefs(m.val)}</p>`)}
    ${acc('legacy', ui('secLegacy'), `${impCards(IMP_HIST)}<div class="changed"><h3>${esc(ui('secChanged'))}</h3><p>${textWithRefs(m.chg)}</p></div>`)}
    ${acc('verdict', ui('secVerdict'), `<dl class="verdict">${[['verOk', 'ok'], ['verNo', 'no'], ['verTop', 'top'], ['verWhy', 'why']].map(([k, f]) => `<div><dt>${esc(ui(k))}</dt><dd>${esc(LT(m.ver[f]))}</dd></div>`).join('')}</dl><p class="mt-2 text-[0.8125rem] text-dim">${esc(ui('verNote'))}</p>`)}
    ${m.cost.length ? acc('cost', ui('secCost'), `${costRows}${m.costNote ? `<p class="mt-3 text-[0.875rem]">${esc(LT(m.costNote))}${cites([m.costNoteRef])}</p>` : ''}<p class="mt-3 text-[0.8125rem] text-dim">${esc(ui('costMethod'))}</p>`) : ''}
    ${acc('place', ui('secArtifact'), `<p>${textWithRefs(m.art)}</p>${!m.cost.length && m.costNote ? `<p class="mt-3">${esc(LT(m.costNote))}${cites([m.costNoteRef])}</p>` : ''}<dl class="facts-dl"><div><dt>${esc(ui('fPhys'))}</dt><dd>${esc(physLabel(m.phys))}</dd></div><div><dt>${esc(ui('fOp'))}</dt><dd>${esc(opLabel(m.op))}</dd></div><div><dt>${esc(ui('fCoords'))}</dt><dd>${coordsText}${m.coords?.note ? ` <span class="text-dim">${esc(LT(m.coords.note))}</span>` : ''}</dd></div></dl>`)}
    ${acc('refs', `${ui('secRefs')} (${refs.length})`, `<p class="text-[0.875rem] text-dim"><a href="#/references" data-refs-filter="${esc(m.id)}">${esc(ui('allRefs'))}</a></p>${groups}`)}
  </div>
  <nav class="pager" aria-label="${esc(ui('missions'))}"><a class="btn" href="#/missions/${prev.id}">← ${esc(LT(prev.name))}</a><a class="btn" href="#/missions/${next.id}">${esc(LT(next.name))} →</a></nav>
</article>`;
}
// Страница значимой миссии: упрощённая 3D-модель, история, значение, хронология, источники
function profilePage(r, P) {
  const site = r.site && SITE[r.site];
  const facts = [[ui('fLaunch'), fmtDate(r.date)], [ui('fCountry'), countryName(r.country)], [ui('fAgency'), r.agency], [ui('fType'), clsLabel(r.cls)], [ui('fPhys'), physLabel(r.phys)], [ui('fOp'), opLabel(r.op)]];
  if (site && !site.orbit) facts.push([ui('fCoords'), coordStr(site.lat, site.lon)]);
  const refs = [...missionLinks(r), ...[...new Set(P.refs)].map(id => REF[id]).filter(Boolean)].filter((x, i, a) => a.findIndex(y => y.url === x.url) === i);
  const acc = (key, title, body, open = false) => `<details class="acc" id="acc-${key}"${open ? ' open' : ''}><summary><span>${esc(title)}</span></summary><div class="acc-body">${body}</div></details>`;
  const labels = (PROC_LABELS[P.model] || []).length > 0;
  return `<article class="mission" data-planet="${esc(r.planet)}">
  <nav class="crumbs" aria-label="${esc(ui('missions'))}"><a href="#/missions">${esc(ui('missions'))}</a> <span aria-hidden="true">/</span> <a href="#/explore/${r.planet}">${esc(planetName(r.planet))}</a></nav>
  <section class="m-hero" data-speak>
    <div class="m-hero-text">
      <p class="m-kicker">${esc(r.agency)} · ${esc(countryName(r.country))} · ${esc(clsLabel(r.cls))}</p>
      <h1 class="page-h1">${esc(recName(r))}</h1>
      <p class="m-lede">${esc(LT(P.lede))}${cites([P.refs[0]])}</p>
      <div class="badges no-say">${badge(`o-${r.outcome}`, `${ui('fOutcome')}: ${outcomeLabel(r.outcome)}`)}${badge(`p-${r.phys}`, physLabel(r.phys))}</div>
      <dl class="m-facts no-say">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <p class="m-actions no-say"><button type="button" class="btn btn-sm speak-page" aria-pressed="false"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z" fill="currentColor"/><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span data-str="listen">${esc(t('listen'))}</span></button>${site ? `<button type="button" class="btn btn-sm" data-show-site="${esc(site.id)}">${esc(ui('showOnGlobe'))}</button>` : ''}</p>
    </div>
    <div class="m-hero-visual"><div class="viewer-wrap" data-viewer="proc:${esc(P.model)}" data-scene="surface" data-planet="${esc(r.planet)}" role="group" aria-label="${esc(ui('sec3d'))}">
      <div class="viewer"><div class="viewer-stage"></div><div class="viewer-tags" aria-hidden="true"></div><p class="viewer-status" role="status">${esc(ui('vLoading'))}</p></div>
      <div class="viewer-ui"><button type="button" class="btn btn-sm" data-v="reset">${esc(ui('vReset'))}</button>${labels ? `<button type="button" class="btn btn-sm" data-v="labels" aria-pressed="true">${esc(ui('vLabels'))}</button>` : ''}<button type="button" class="btn btn-sm" data-v="full">${esc(ui('vFull'))}</button></div>
      <p class="viewer-note"><b class="accent">${esc(ui('vSchematic'))}.</b> ${esc(ui('vHelp'))}</p>
    </div></div>
  </section>
  ${ARCHIVE_IMG[r.id] ? `<section class="m-gallery" aria-labelledby="ga-h"><h2 id="ga-h" class="sec-h">${esc(ui('secArchive'))} <span class="text-dim text-[1rem]">${ARCHIVE_IMG[r.id].length}</span></h2>${archiveGallery(r.id)}</section>` : ''}
  <div class="m-sections">
    ${acc('story', ui('secStory'), P.story.map(x => `<p>${esc(LT(x))}</p>`).join('') + `<p class="mt-2">${cites(P.refs)}</p>`, true)}
    ${acc('why', ui('secWhy'), `<p>${esc(LT(P.why))}${cites(P.refs.slice(0, 2))}</p>`, true)}
    ${acc('timeline', ui('secTimeline'), `<ol class="tl">${P.tl.map(([d, txt, ref]) => `<li><time>${esc(fmtDate(d))}</time><span>${esc(LT(txt))}${cites([ref])}</span></li>`).join('')}</ol>`)}
    ${acc('place', ui('secArtifact'), `<p>${esc(LT(P.now))}${site?.ref ? cites([site.ref]) : ''}</p>`)}
    ${acc('refs', `${ui('secRefs')} (${refs.length})`, `<ul class="refs">${refs.map(refItem).join('')}</ul>`)}
  </div>
</article>`;
}
// Короткая страница записи каталога (для миссий без подробного рассказа)
function recordPage(r) {
  const site = r.site && SITE[r.site], src = recSources(r);
  const facts = [[ui('fLaunch'), fmtDate(r.date)], [ui('fCountry'), countryName(r.country)], [ui('fAgency'), r.agency], [ui('fType'), clsLabel(r.cls)], [ui('fOutcome'), outcomeLabel(r.outcome)], [ui('fPhys'), physLabel(r.phys)], [ui('fOp'), opLabel(r.op)]];
  if (site && !site.orbit) facts.push([ui('fCoords'), coordStr(site.lat, site.lon)]);
  if (r.nssdc && /^\d{4}-\d{3}/.test(r.nssdc)) facts.push([ui('nssdcId'), r.nssdc]);
  return `<article class="mission" data-planet="${esc(r.planet)}">
  <nav class="crumbs" aria-label="${esc(ui('missions'))}"><a href="#/missions">${esc(ui('missions'))}</a> <span aria-hidden="true">/</span> <a href="#/explore/${r.planet}">${esc(planetName(r.planet))}</a></nav>
  <p class="m-kicker">${esc(r.agency)} · ${esc(countryName(r.country))} · ${esc(clsLabel(r.cls))}</p>
  <h1 class="page-h1">${esc(recName(r))}</h1>
  <div class="badges mt-3 flex flex-wrap gap-1.5">${badge(`o-${r.outcome}`, outcomeLabel(r.outcome))}${badge(`p-${r.phys}`, physLabel(r.phys))}</div>
  ${r.note ? `<p class="m-lede">${esc(LT(r.note))}</p>` : ''}
  <dl class="m-facts" style="max-width:46rem">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  ${site ? `<p class="m-actions"><button type="button" class="btn btn-sm" data-show-site="${esc(site.id)}">${esc(ui('showOnGlobe'))}</button></p>` : ''}
  ${ARCHIVE_IMG[r.id] ? `<h2 class="sec-h">${esc(ui('secArchive'))} <span class="text-dim text-[1rem]">${ARCHIVE_IMG[r.id].length}</span></h2>${archiveGallery(r.id)}` : ''}
  <h2 class="sec-h">${esc(ui('sources'))}</h2><ul class="refs">${[...missionLinks(r), ...src].filter((x, i, a) => a.findIndex(y => y.url === x.url) === i).map(refItem).join('')}</ul>
  <p class="mt-4 text-[0.8125rem] text-dim">${esc(ui('archNote'))}</p>
</article>`;
}
function refItem(r) {
  const chk = r.chk === 'v' ? ui('chkV') : r.chk === 'n' ? ui('chkN') : ui('chkU');
  return `<li id="ref-${esc(r.id)}"><a class="ref-title"${langOf(r.title)} href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>
    <span class="ref-meta"><span${langOf(r.by)}>${esc(r.by)}</span> · ${r.year ?? esc(ui('nd'))} · ${esc(LT(UI.refType[r.type]))}</span>
    <span class="ref-sup"><b>${esc(ui('supports'))}:</b> ${esc(LT(r.sup))}</span>
    <span class="ref-chk">${esc(chk)}</span></li>`;
}

/* =====================================================================================
   3D-просмотр модели: вращение, приближение, полный экран, подписи частей аппарата
   ===================================================================================== */
class ModelViewer {
  constructor(box, assetId, scene) {
    this.box = box; this.sceneKind = scene; this.disposed = false;
    this.proc = assetId.startsWith('proc:') ? assetId.slice(5) : null;   // упрощённая модель, построенная кодом
    this.asset = this.proc ? { assetId, planet: box.dataset.planet || 'moon' } : ASSET[assetId];
    this.status = box.querySelector('.viewer-status');
    this.tags = [];
    this.init().catch(err => { console.warn('[3D viewer]', err); this.setStatus(ui('vFail')); });
  }
  setStatus(text) { if (this.status) { this.status.textContent = text; this.status.hidden = !text; } }
  async init() {
    const st = await stageReady;                     // 3D-сцена страницы могла ещё не запуститься
    if (this.disposed) return;
    if (!st) { this.setStatus(ui('vNoGL')); return; }
    const { THREE } = st.debug;
    const [{ OrbitControls }, { RoomEnvironment }] = await Promise.all([import('three/addons/controls/OrbitControls.js'), import('three/addons/environments/RoomEnvironment.js')]);
    if (this.disposed) return;
    const holder = this.box.querySelector('.viewer-stage');
    const renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    holder.append(renderer.domElement);
    const scene = this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; pmrem.dispose();
    scene.environment = this.envTex;
    const camera = this.camera = new THREE.PerspectiveCamera(35, 1, 0.05, 400);
    const own = this.own = [];                       // всё, что создал просмотр (модель общая — её не освобождаем)
    const keep = o => { own.push(o); return o; };
    const isMars = this.asset.planet === 'mars';
    const sun = new THREE.DirectionalLight(0xfff4e6, 2.6); sun.position.set(-4, 6, 5); scene.add(sun);
    if (this.sceneKind === 'orbit') {
      scene.background = new THREE.Color(0x000000); scene.environmentIntensity = 0.5;
      const pos = new Float32Array(1500 * 3), r = prng(7);
      for (let i = 0; i < 1500; i++) { const z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z); pos.set([s * Math.cos(a) * 150, z * 150, s * Math.sin(a) * 150], i * 3); }
      const g = keep(new THREE.BufferGeometry()); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(g, keep(new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false }))));
      const planet = new THREE.Mesh(keep(new THREE.SphereGeometry(40, 96, 64)), keep(new THREE.MeshStandardMaterial({ color: isMars ? 0xb5643c : 0x8d8a85, roughness: 1, metalness: 0 })));
      planet.position.set(0, -44, -18); scene.add(planet);
    } else {
      scene.background = new THREE.Color(isMars ? 0x7c5a45 : 0x000000); scene.environmentIntensity = 0.6;
      scene.fog = new THREE.Fog(isMars ? 0x7c5a45 : 0x000000, 14, 40);
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const g2 = c.getContext('2d'), r = prng(11), base = isMars ? [176, 108, 70] : [128, 126, 122];
      g2.fillStyle = `rgb(${base})`; g2.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2600; i++) { const k = 0.75 + r() * 0.5; g2.fillStyle = `rgba(${base.map(v => Math.round(v * k))},0.55)`; g2.fillRect(r() * 256, r() * 256, 1 + r() * 3, 1 + r() * 3); }
      const tex = keep(new THREE.CanvasTexture(c)); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(10, 10); tex.colorSpace = THREE.SRGBColorSpace;
      const ground = new THREE.Mesh(keep(new THREE.CircleGeometry(60, 64)), keep(new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 })));
      ground.rotation.x = -Math.PI / 2; scene.add(ground);
      const sh = document.createElement('canvas'); sh.width = sh.height = 128;
      const sg = sh.getContext('2d'), grad = sg.createRadialGradient(64, 64, 4, 64, 64, 64); grad.addColorStop(0, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = grad; sg.fillRect(0, 0, 128, 128);
      const shadow = new THREE.Mesh(keep(new THREE.PlaneGeometry(3.2, 3.2)), keep(new THREE.MeshBasicMaterial({ map: keep(new THREE.CanvasTexture(sh)), transparent: true, depthWrite: false })));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; scene.add(shadow);
      scene.add(new THREE.HemisphereLight(isMars ? 0xffd9b8 : 0xbfc8d8, isMars ? 0x4a2c1c : 0x222222, 0.7));
    }
    const model = this.proc ? st.buildHardware(this.proc) : (await st.loadAsset(this.asset.assetId)).scene.clone(true);
    if (this.disposed || !model) { if (!model) this.setStatus(ui('vFail')); return; }
    const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    const fit = this.fit = new THREE.Group(), k = 2 / Math.max(size.x, size.y, size.z, 1e-6);
    model.position.set(-center.x, this.sceneKind === 'orbit' ? -center.y : -box.min.y, -center.z);
    fit.add(model); fit.scale.setScalar(k); scene.add(fit);
    const h = this.sceneKind === 'orbit' ? 0 : size.y * k / 2;
    this.home = { pos: new THREE.Vector3(2.6, h + 1.2, 3.4), target: new THREE.Vector3(0, h, 0) };
    camera.position.copy(this.home.pos);
    const controls = this.controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(this.home.target); controls.enableDamping = true; controls.enablePan = false;
    controls.minDistance = 1.6; controls.maxDistance = 12;
    if (this.sceneKind !== 'orbit') controls.maxPolarAngle = Math.PI * 0.49;
    controls.update();
    // подписи частей: точки заданы в координатах модели, вписанной в куб 2×2×2 (низ — на уровне грунта)
    const layer = this.box.querySelector('.viewer-tags'), center3 = new THREE.Vector3(0, h, 0);
    scene.updateMatrixWorld(true);
    for (const [x, y, z, text] of (this.proc ? PROC_LABELS[this.proc] : MODEL_LABELS[this.asset.assetId]) || []) {
      const el = document.createElement('span'); el.className = 'vtag'; el.textContent = LT(text); layer.append(el);
      const p = this.proc ? model.localToWorld(new THREE.Vector3(x, y, z)) : new THREE.Vector3(x, y, z);   // у упрощённых моделей точки заданы в координатах модели
      this.tags.push({ el, p, out: p.clone().sub(center3).normalize() });
    }
    this.showTags = true;
    if (new URLSearchParams(location.search).has('debug3d')) this.debugGrid(THREE);
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(holder); this.resize();
    this.setStatus('');
    const tmp = new THREE.Vector3(), dir = new THREE.Vector3();
    const loop = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      controls.update(); renderer.render(scene, camera);
      if (!this.tags.length) return;
      const w = holder.clientWidth, hh = holder.clientHeight;
      camera.getWorldDirection(dir);
      for (const tg of this.tags) {
        tmp.copy(tg.p).project(camera);
        const visible = this.showTags && tmp.z < 1;
        tg.el.style.opacity = visible ? (tg.out.dot(dir) > 0.35 ? '0.28' : '1') : '0';   // точка на дальней стороне — бледнее
        tg.el.style.transform = `translate3d(${((tmp.x + 1) / 2 * w).toFixed(1)}px, ${((1 - tmp.y) / 2 * hh).toFixed(1)}px, 0)`;
      }
    };
    loop();
    this.box.querySelector('[data-v="reset"]')?.addEventListener('click', () => this.reset());
    this.box.querySelector('[data-v="labels"]')?.addEventListener('click', e => { this.showTags = !this.showTags; e.currentTarget.setAttribute('aria-pressed', String(this.showTags)); });
    this.box.querySelector('[data-v="full"]')?.addEventListener('click', () => this.fullscreen());
    this.onFs = () => this.resize(); document.addEventListener('fullscreenchange', this.onFs);
    window.vestige.viewer = this;
  }
  debugGrid(THREE) {   // ?debug3d — сетка для подбора точек подписей
    const mat = new THREE.LineBasicMaterial({ color: 0x00ffff, depthTest: false, transparent: true, opacity: 0.55 }), pts = [];
    for (let v = -1; v <= 1.0001; v += 0.25) { pts.push(v, 0, 0, v, 2, 0, -1, v + 1, 0, 1, v + 1, 0); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(g, mat); lines.renderOrder = 10;
    if (this.sceneKind === 'orbit') lines.position.y = -1;
    const side = lines.clone(); side.rotation.y = Math.PI / 2;
    this.scene.add(lines, side, new THREE.AxesHelper(1.5));
    this.setView = (x, y, z, fov = 14) => { this.camera.fov = fov; this.camera.updateProjectionMatrix(); this.camera.position.set(x, y, z); this.controls.target.set(0, this.sceneKind === 'orbit' ? 0 : 1, 0); this.controls.update(); };
    this.debugLines = [lines, side];
  }
  resize() {
    if (!this.renderer) return;
    const el = this.box.querySelector('.viewer-stage'), w = el.clientWidth || 300, h = el.clientHeight || 240;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  reset() { if (!this.controls) return; this.camera.position.copy(this.home.pos); this.controls.target.copy(this.home.target); this.controls.update(); }
  fullscreen() {
    const el = this.box;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect(); this.controls?.dispose();
    if (this.onFs) document.removeEventListener('fullscreenchange', this.onFs);
    for (const o of this.own || []) o.dispose?.();
    this.debugLines?.forEach(l => { l.geometry.dispose(); l.material.dispose(); });
    this.envTex?.dispose();
    if (this.renderer) { this.renderer.dispose(); this.renderer.forceContextLoss?.(); this.renderer.domElement.remove(); }
    if (window.vestige.viewer === this) window.vestige.viewer = null;
  }
}

/* =====================================================================================
   Архив миссий (все планеты) — тот же каталог, что и в режиме «Исследовать»
   ===================================================================================== */
const archState = freshFilters();
// «В этот день»: запуски, которые пришлись на сегодняшнее число (или ближайшее в следующие 30 дней)
function onThisDayHTML() {
  const now = new Date(), pad = n => String(n).padStart(2, '0');
  const list = RECORDS.filter(r => r.cat === 'launched' && /^\d{4}-\d{2}-\d{2}$/.test(String(r.date)));
  for (let k = 0; k < 30; k++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k), key = `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const hits = list.filter(r => r.date.slice(5) === key).sort((a, b) => a.year - b.year);
    if (!hits.length) continue;
    const day = state.lang === 'kk' ? `${d.getDate()} ${KK_MONTHS[d.getMonth()]}` : new Intl.DateTimeFormat(LOCALES[state.lang], { day: 'numeric', month: 'long' }).format(d);
    return `<aside class="otd" aria-labelledby="otd-h"><h2 id="otd-h" class="otd-h">${esc(ui(k === 0 ? 'otdToday' : k === 1 ? 'otdTomorrow' : 'otdSoon', { date: day }))}</h2><ul>${hits.slice(0, 4).map(r => `<li><a href="#/missions/${esc(r.id)}">${esc(recName(r))}</a> <span>${esc(ui('otdLine', { year: r.year, ago: d.getFullYear() - r.year, word: plural(d.getFullYear() - r.year, UI.yearsAgo), agency: r.agency }))}</span></li>`).join('')}</ul></aside>`;
  }
  return '';
}
function archivePage() {
  const moon = launched('moon').length, mars = launched('mars').length;
  return `<h1 class="page-h1">${esc(ui('archTitle'))}</h1>
  <p class="lead">${esc(ui('archIntro'))}</p>
  <p class="text-[0.875rem] text-dim">${esc(ui('archCounts', { moon, mars }))}${cites(['nssdc-lunar-timeline', 'nasa-moon-missions', 'nssdc-mars-chrono', 'jpl-mars-history', 'esa-mars-list'])}</p>
  <p class="explore-links"><a class="btn btn-sm" href="#/explore/moon">${esc(ui('exploreMoon'))}</a> <a class="btn btn-sm" href="#/explore/mars">${esc(ui('exploreMars'))}</a> <button type="button" class="btn btn-sm" data-surprise>${esc(ui('surprise'))}</button></p>
  ${onThisDayHTML()}
  ${catalogHTML('arch', archState, null)}
  <p class="mt-6 text-[0.8125rem] text-dim">${esc(ui('archNote'))}</p>`;
}

/* ---------- Источники ---------- */
const refsState = { q: '', mission: '', planet: '', group: '', type: '', from: '', to: '' };
ROUTES.references = () => {
  const s = refsState, ms = MISSIONS.slice().sort((a, b) => LT(a.name).localeCompare(LT(b.name)));
  return `<h1 class="page-h1">${esc(ui('refsTitle'))}</h1><p class="lead">${esc(ui('refsIntro'))}</p>
  <form class="filters" id="refs-form" role="search" onsubmit="return false">
    <label class="f-wide"><span>${esc(ui('search'))}</span><input type="search" name="q" value="${esc(s.q)}" autocomplete="off"></label>
    <label><span>${esc(ui('fMission'))}</span><select name="mission">${opt('', ui('all'), s.mission)}${ms.map(m => opt(m.id, LT(m.name), s.mission)).join('')}</select></label>
    <label><span>${esc(ui('fPlanet'))}</span><select name="planet">${opt('', ui('all'), s.planet)}${['moon', 'mars', 'venus', 'titan', 'comet'].map(p => opt(p, planetName(p), s.planet)).join('')}</select></label>
    <label><span>${esc(ui('fAgency'))}</span><select name="group">${opt('', ui('all'), s.group)}${Object.keys(UI.agencyGroup).map(g => opt(g, LT(UI.agencyGroup[g]), s.group)).join('')}</select></label>
    <label><span>${esc(ui('fDocType'))}</span><select name="type">${opt('', ui('all'), s.type)}${UI.refGroupsOrder.map(k => opt(k, LT(UI.refType[k]), s.type)).join('')}</select></label>
    <label><span>${esc(ui('fYearFrom'))}</span><input type="number" name="from" inputmode="numeric" min="1950" max="2030" value="${esc(s.from)}"></label>
    <label><span>${esc(ui('fYearTo'))}</span><input type="number" name="to" inputmode="numeric" min="1950" max="2030" value="${esc(s.to)}"></label>
    <button type="reset" class="btn btn-sm">${esc(ui('resetFilters'))}</button>
  </form>
  <p class="count" id="refs-count" aria-live="polite"></p>
  <ul class="refs refs-all" id="refs-list"></ul>`;
};
function paintRefs() {
  const s = refsState, q = s.q.trim().toLowerCase(), from = Number(s.from) || 0, to = Number(s.to) || 9999;
  const list = REFS.filter(r => (!s.mission || r.missions.includes(s.mission)) && (!s.planet || r.planets.includes(s.planet)) && (!s.group || r.groups.includes(s.group)) && (!s.type || r.type === s.type) &&
    ((!s.from && !s.to) || (r.year && r.year >= from && r.year <= to)) &&
    (!q || [r.title, r.by, r.year, LT(r.sup), ...r.missions.map(id => LT(MISSION[id]?.name))].join(' ').toLowerCase().includes(q)));
  $('#refs-count').textContent = ui('refsCount', { n: list.length, total: REFS.length });
  $('#refs-list').innerHTML = list.map(r => refItem(r).replace('</li>', `${r.missions.length ? `<span class="ref-ms">${r.missions.map(id => `<a href="#/missions/${id}">${esc(LT(MISSION[id].name))}</a>`).join(' ')}</span>` : ''}</li>`)).join('');
}
function wireFilters(formId, st, paint) {
  const form = $(formId); if (!form) return;
  let last = '';
  const read = () => { for (const el of form.elements) if (el.name) st[el.name] = el.type === 'checkbox' ? el.checked : el.value; const key = JSON.stringify(st); if (key === last) return; last = key; paint(); };
  form.addEventListener('input', read); form.addEventListener('change', read);
  form.addEventListener('reset', () => setTimeout(read, 0));
  paint();
}

/* ---------- Хронология ---------- */
const tlState = { planet: '', group: '', decade: '', outcome: '' };
ROUTES.timeline = () => {
  const s = tlState, recs = RECORDS.filter(r => r.year), decades = [...new Set(recs.map(r => Math.floor(r.year / 10) * 10))].sort();
  return `<h1 class="page-h1">${esc(ui('tlTitle'))}</h1><p class="lead">${esc(ui('tlIntro'))}</p>
  <form class="filters" id="tl-form" onsubmit="return false">
    <label><span>${esc(ui('fPlanet'))}</span><select name="planet">${opt('', ui('all'), s.planet)}${opt('moon', ui('moon'), s.planet)}${opt('mars', ui('mars'), s.planet)}${opt('other', ui('otherWorlds'), s.planet)}</select></label>
    <label><span>${esc(ui('fCountryAgency'))}</span><select name="group">${opt('', ui('all'), s.group)}${['NASA', 'USSR', 'ESA', 'China', 'India', 'Japan', 'Other'].map(g => opt(g, LT(UI.agencyGroup[g]), s.group)).join('')}</select></label>
    <label><span>${esc(ui('fDecade'))}</span><select name="decade">${opt('', ui('all'), s.decade)}${decades.map(d => opt(String(d), decadeLabel(d), s.decade)).join('')}</select></label>
    <label><span>${esc(ui('fOutcome'))}</span><select name="outcome">${opt('', ui('all'), s.outcome)}${['success', 'partial', 'failure', 'undetermined', 'inflight'].map(k => opt(k, outcomeLabel(k), s.outcome)).join('')}</select></label>
    <button type="reset" class="btn btn-sm">${esc(ui('resetFilters'))}</button>
  </form><p class="count" id="tl-count" aria-live="polite"></p><div id="tl-list" class="tl-big"></div>`;
};
function paintTimeline() {
  const s = tlState;
  const all = RECORDS.filter(r => r.year);
  const list = all.filter(r => (!s.planet || (s.planet === 'other' ? !['moon', 'mars'].includes(r.planet) : r.planet === s.planet)) && (!s.group || r.group === s.group) && (!s.decade || Math.floor(r.year / 10) * 10 === Number(s.decade)) && (!s.outcome || r.outcome === s.outcome))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  $('#tl-count').textContent = ui('matches', { n: list.length, total: all.length });
  let html = '', dec = null;
  for (const r of list) {
    const d = Math.floor(r.year / 10) * 10;
    if (d !== dec) { if (dec !== null) html += '</ol>'; html += `<h2 class="tl-dec">${esc(decadeLabel(d))}</h2><ol class="tl tl-wide">`; dec = d; }
    const links = r.mission ? INFLUENCE.filter(x => x[0] === r.id).map(([, to, ref]) => `<a href="#/missions/${to}">→ ${esc(LT(MISSION[to].name))}</a>${cites([ref])}`).join(' ') : '';
    const name = r.mission ? `<a href="#/missions/${r.id}">${esc(recName(r))}</a>` : esc(recName(r));
    html += `<li class="${r.mission ? 'is-feat' : ''}"><time>${r.year}</time><span><b>${name}</b> <span class="text-dim">· ${esc(planetName(r.planet))} · ${esc(countryName(r.country))} · ${esc(clsLabel(r.cls))}</span> ${badge(`o-${r.outcome}`, outcomeLabel(r.outcome))}${links ? `<br><span class="tl-links">${esc(ui('influenced'))}: ${links}</span>` : ''}</span></li>`;
  }
  if (dec !== null) html += '</ol>';
  $('#tl-list').innerHTML = html || `<p class="text-dim">${esc(ui('noMatches'))}</p>`;
  renderCites($('#tl-list'));
}

/* ---------- Библиотека исследований ---------- */
ROUTES.research = () => {
  const topicRefs = tp => [...new Set([...tp.disc.flatMap(d => d[1]), ...(tp.extraRefs || [])])].map(id => REF[id]).filter(Boolean);
  return `<h1 class="page-h1">${esc(ui('resTitle'))}</h1><p class="lead">${esc(ui('resIntro'))}</p>
  <nav class="toc" aria-label="${esc(ui('resTitle'))}">${TOPICS.map(tp => `<a href="#topic-${tp.id}" data-jump="topic-${tp.id}">${esc(LT(tp.title))}</a>`).join('')}</nav>
  ${TOPICS.map(tp => {
    const refs = topicRefs(tp), pubs = refs.filter(r => r.type === 'paper'), other = refs.filter(r => r.type !== 'paper');
    return `<article class="topic" id="topic-${tp.id}"><h2 class="sec-h">${esc(LT(tp.title))}</h2>
      <dl class="facts-dl"><div><dt>${esc(ui('rQuestion'))}</dt><dd>${esc(LT(tp.q))}</dd></div><div><dt>${esc(ui('rBackground'))}</dt><dd>${esc(LT(tp.bg))}</dd></div>
      <div><dt>${esc(ui('rMissions'))}</dt><dd>${tp.missions.map(id => `<a class="chip-link" href="#/missions/${id}">${esc(LT(MISSION[id].name))}</a>`).join(' ')}</dd></div></dl>
      ${tp.disc.length ? `<h3 class="sub-h">${esc(ui('rDiscoveries'))}</h3><ul class="bullets">${tp.disc.map(d => `<li>${textWithRefs(d)}</li>`).join('')}</ul>` : ''}
      <dl class="facts-dl"><div><dt>${esc(ui('rNow'))}</dt><dd>${esc(LT(tp.now))}</dd></div><div><dt>${esc(ui('rOpen'))}</dt><dd>${esc(LT(tp.open))}</dd></div></dl>
      ${pubs.length ? `<h3 class="sub-h">${esc(ui('rPubs'))}</h3><ul class="refs">${pubs.map(refItem).join('')}</ul>` : ''}
      ${other.length ? `<h3 class="sub-h">${esc(ui('rAgency'))}</h3><ul class="refs">${other.map(refItem).join('')}</ul>` : ''}</article>`;
  }).join('')}`;
};

/* =====================================================================================
   Команда и справочные страницы
   ===================================================================================== */
const P = (...paras) => paras.map(p => `<p>${p}</p>`).join('');
const initials = name => name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
ROUTES.team = () => `<h1 class="page-h1">${esc(ui('teamTitle'))}</h1>
  <p class="lead">${esc(ui('teamLede'))}</p>
  <div class="team-top">
    <figure class="team-photo"><img src="${esc(TEAM.photo)}" alt="${esc(ui('teamPhotoAlt'))}" width="960" height="1280" loading="lazy" decoding="async"><figcaption>${esc(ui('teamPhotoCap'))}</figcaption></figure>
    <div>
      <ul class="team-grid">${TEAM.members.map(mb => `<li class="member"><span class="avatar" aria-hidden="true">${esc(initials(mb.name))}</span><span class="member-name">${esc(mb.name)}</span><span class="member-role">${esc(mb.role ? LT(mb.role) : ui('teamMember'))}</span></li>`).join('')}</ul>
      <h2 class="sec-h">${esc(ui('teamGoalH'))}</h2>
      <div class="prose">${P(esc(ui('teamGoal1')), esc(ui('teamGoal2')))}</div>
      <h2 class="sec-h">${esc(ui('teamUseH'))}</h2>
      <div class="prose">${P(esc(ui('teamUse1')), esc(ui('teamUse2')))}</div>
      <p class="mt-6"><a class="btn btn-solid" href="${esc(TEAM.official)}" target="_blank" rel="noopener">${esc(ui('officialTeam'))} ↗</a></p>
    </div>
  </div>`;
ROUTES.about = () => `<h1 class="page-h1">${esc(ui('about'))}</h1>
  <p class="lead">${esc(ui('motto'))}</p>
  <div class="prose">${P(esc(ui('aboutP1')), esc(ui('aboutP2')), esc(ui('aboutP3')), esc(ui('teamUse1')))}</div>
  <h2 class="sec-h">${esc(ui('team'))}</h2>
  <p>${TEAM.members.map(mb => `<b>${esc(mb.name)}</b>`).join(', ')} — <a href="#impact">${esc(ui('teamTitle'))}</a></p>
  <p class="mt-4"><a class="btn btn-solid" href="${esc(TEAM.official)}" target="_blank" rel="noopener">${esc(ui('officialTeam'))} ↗</a></p>`;
ROUTES.challenge = () => `<h1 class="page-h1">${esc(ui('challenge'))}</h1>
  <div class="prose">${P(`${esc(ui('chP1'))}${cites(['spaceapps2026', 'spaceapps-faq'])}`, esc(ui('chP2')), esc(ui('chP3')))}</div>
  <p class="explore-links"><a class="btn" href="https://www.spaceappschallenge.org/2026/" target="_blank" rel="noopener">spaceappschallenge.org ↗</a> <a class="btn" href="${esc(TEAM.official)}" target="_blank" rel="noopener">${esc(ui('officialTeam'))} ↗</a></p>`;
ROUTES.credits = () => {
  const photoRows = Object.entries(PHOTOS).flatMap(([mid, ps]) => ps.map(([id, , kind, cap, credit]) => `<li><a href="${imgPage(id)}" target="_blank" rel="noopener">${esc(id)}</a> — ${esc(LT(cap))} <span class="text-dim">(${esc(LT(MISSION[mid].name))}; ${esc(kind === 'art' ? ui('kindArt') : kind === 'mosaic' ? ui('kindMosaic') : ui('kindPhoto'))}; ${esc(ui('credit'))}: <span${langOf(credit)}>${esc(credit)}</span>)</span></li>`)).join('');
  return `<h1 class="page-h1">${esc(ui('credits'))}</h1>
  <h2 class="sec-h">${esc(ui('crModels'))}</h2>
  <div class="table-wrap"><table class="data"><thead><tr><th scope="col">${esc(ui('crAsset'))}</th><th scope="col">${esc(ui('crWhere'))}</th><th scope="col">${esc(ui('crVariant'))}</th><th scope="col">${esc(ui('crSource'))}</th><th scope="col">${esc(ui('crFiles'))}</th></tr></thead><tbody>
  ${ASSET_REGISTRY.map(a => `<tr><td><b>${esc(LT(a.spacecraftName))}</b><br><code>${esc(a.assetId)}</code></td><td>${esc(ui(a.modelType === 'orbiter' ? 'crOrbit' : a.modelType === 'planet' ? 'crGlobe' : 'crSurface'))}${a.associatedMissionIds.length ? '<br>' + a.associatedMissionIds.map(id => `<a href="#/missions/${id}">${esc(LT(MISSION[id].name))}</a>`).join(', ') : ''}${a.isRepresentativeModel ? `<br><span class="badge neutral">${esc(ui('crRep'))}</span>` : ''}</td><td>${esc(LT(a.verifiedVariant))}</td><td>${esc(LT(a.source))}${a.sourceRef ? cites([a.sourceRef]) : ''}<br><span class="text-dim">${esc(LT(a.license))}</span><br><span class="text-dim">${esc(a.credits)}</span></td><td><code>${esc(a.filePath)}</code> (${(a.fileSize / 1048576).toFixed(1)} MiB)<br>→ <code>${esc(a.optimizedFilePath)}</code> (${(a.optimizedSize / 1048576).toFixed(1)} MiB)</td></tr>`).join('')}</tbody></table></div>
  <p class="text-[0.8125rem] text-dim">${esc(ui('crOptimised'))}</p>
  <h2 class="sec-h">${esc(ui('crPhotos'))}</h2>
  <p>${esc(ui('crPhotosNote'))}${cites(['nasa-images', 'nasa-media'])}</p>
  <ul class="bullets credits-photos">${photoRows}</ul>
  <h2 class="sec-h">${esc(ui('crArchive'))}</h2>
  <p>${esc(ui('crArchiveNote', { n: Object.values(ARCHIVE_IMG).reduce((s, l) => s + l.length, 0), m: Object.keys(ARCHIVE_IMG).length }))}</p>
  <h2 class="sec-h">${esc(ui('crData'))}</h2>
  <ul class="bullets"><li>${esc(ui('crCatalogues'))}${cites(['nssdc-lunar-timeline', 'nasa-moon-missions', 'nssdc-mars-chrono', 'jpl-mars-history', 'esa-mars-list'])}</li>
  <li>${esc(ui('crCoords'))}${cites(['lroc-938', 'nssdc-apollo-sites', 'nssdc-surveyor', 'nssdc-ussr-moon'])}</li>
  <li>${esc(LT(NASA_LICENSE))}${cites(['nasa-media'])}</li>
  <li>${esc(ui('crSchemes'))}</li><li>${esc(ui('crTeamPhoto'))}</li></ul>
  <h2 class="sec-h">${esc(ui('crLibs'))}</h2>
  <ul class="bullets"><li>Tektur, Geologica — SIL Open Font License 1.1 (Google Fonts)</li><li>three.js 0.187.0 — MIT License</li><li>Tailwind CSS 4 (browser build) — MIT License</li><li>gltf-transform 4.5.1 — MIT License (${esc(ui('crOffline'))})</li></ul>`;
};
ROUTES['open-source'] = () => `<h1 class="page-h1">${esc(ui('openSource'))}</h1>
  <div class="prose">${P(esc(ui('osP1')), esc(ui('osP2')))}</div>
  <p class="notice">${esc(ui('osRepo'))}</p>
  <p><a class="btn" href="#/credits">${esc(ui('credits'))}</a></p>`;
ROUTES['ai-disclosure'] = () => {
  const rows = [['aiCode', 'aiCodeT'], ['aiText', 'aiTextT'], ['aiTrans', 'aiTransT'], ['aiResearch', 'aiResearchT'], ['aiImages', 'aiImagesT'], ['aiImgGen', 'aiImgGenT']];
  return `<h1 class="page-h1">${esc(ui('ai'))}</h1>
  <p class="lead">${esc(ui('aiTool'))}</p>
  <div class="table-wrap"><table class="data"><thead><tr><th scope="col">${esc(ui('aiPurpose'))}</th><th scope="col">${esc(ui('aiWhat'))}</th></tr></thead><tbody>${rows.map(([a, b]) => `<tr><td>${esc(ui(a))}</td><td>${esc(ui(b))}</td></tr>`).join('')}</tbody></table></div>
  <h2 class="sec-h">${esc(ui('aiReview'))}</h2>
  <p class="notice">${esc(ui('aiReviewNote'))}</p>`;
};

/* ---------- Действия на странице после отрисовки ---------- */
function wirePage(r) {
  if (r.name === 'missions' && !r.arg) wireCatalog('arch', archState, null, pageBody);
  if (r.name === 'references') wireFilters('#refs-form', refsState, paintRefs);
  if (r.name === 'timeline') wireFilters('#tl-form', tlState, paintTimeline);
  pageBody.querySelectorAll('[data-surprise]').forEach(b => b.addEventListener('click', () => surprise()));
  pageBody.querySelectorAll('[data-refs-filter]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); Object.assign(refsState, { q: '', mission: a.dataset.refsFilter, planet: '', group: '', type: '', from: '', to: '' }); location.hash = '#/references'; }));
  pageBody.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.jump)?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }); }));
  pageBody.querySelectorAll('.mission [data-show-site]').forEach(b => b.addEventListener('click', () => showSite(b.dataset.showSite)));
  pageBody.querySelectorAll('img[data-photo-fail]').forEach(img => {
    const fail = () => { const fig = img.closest('figure'), gal = fig?.closest('.m-gallery'); fig?.remove(); if (gal && !gal.querySelector('figure')) gal.remove(); };
    if (img.complete && img.naturalWidth === 0) fail(); else img.addEventListener('error', fail, { once: true });
  });
  const sp = pageBody.querySelector('.speak-page');
  if (sp) {
    if (!('speechSynthesis' in window)) sp.hidden = true;
    sp.addEventListener('click', () => {
      // читаем вступление и историю миссии
      const tmp = document.createElement('div');
      tmp.append(...[pageBody.querySelector('.m-hero-text h1'), pageBody.querySelector('.m-lede'), pageBody.querySelector('#acc-story .acc-body'), pageBody.querySelector('#acc-why .acc-body')].filter(Boolean).map(n => n.cloneNode(true)));
      speakFrom(sp, tmp);
    });
  }
}

/* =====================================================================================
   Заставка: лаборатория RealPugs. Двери открываются, камера въезжает к большому экрану,
   на котором — живая 3D-сцена с Луной и Марсом. «Войти в архив» — камера входит в экран.
   ===================================================================================== */
let labFinish = null;
const labEl = $('#lab');
const lab = { timers: [], done: true, wired: false, globes: null };
function paintLab() {
  labEl.querySelector('#lab-sub').textContent = ui('labSub');
  labEl.querySelector('#lab-enter').textContent = ui('enter');
  labEl.querySelector('#lab-skip').textContent = ui('skip');
  labEl.querySelector('#lab-hint').textContent = ui('monitorsHint');
  labEl.querySelector('#lab-scan').textContent = labEl.classList.contains('granted') ? ui('granted') : ui('scanning');
  labEl.querySelector('#lab-live').textContent = ui('centralCaption');
  labEl.querySelector('#lab-motto').textContent = ui('motto');
  labEl.querySelector('.lab-emblem small').textContent = ui('labEmblem');
  labEl.querySelectorAll('[data-lab-planet]').forEach(b => {
    const k = b.dataset.labPlanet, list = launched(k), n = list.length, first = Math.min(...list.map(r => r.year));
    b.querySelector('b').textContent = ui(k === 'moon' ? 'exploreMoon' : 'exploreMars');
    b.querySelector('span').textContent = ui('pickCount', { n, first, word: plural(n, UI.launchesWord) });
  });
  labEl.querySelectorAll('[data-mon]').forEach(b => { b.querySelector('b').textContent = ui({ about: 'about', impact: 'impactShort', challenge: 'challenge', language: 'language', quiz: 'quizTitle', references: 'references' }[b.dataset.mon]); });
  labEl.querySelectorAll('[data-lab-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.labLang === state.lang)));
}
function wireLab() {
  if (lab.wired) return; lab.wired = true;
  langHooks.push(() => { if (!labEl.hidden) paintLab(); });
  labEl.querySelector('#lab-skip').addEventListener('click', () => labDone());
  labEl.querySelector('#lab-enter').addEventListener('click', () => labDone());   // рассказ начинается с первого экрана
  labEl.querySelectorAll('[data-mon]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.mon;
    if (k === 'language') { const box = labEl.querySelector('.lab-langs'); box.hidden = !box.hidden; if (!box.hidden) box.querySelector('[data-lab-lang]')?.focus(); return; }
    labDone({ about: '#/about', impact: '#impact', challenge: '#/challenge', quiz: '#/quiz', references: '#/references' }[k]);
  }));
  labEl.querySelectorAll('[data-lab-planet]').forEach(b => b.addEventListener('click', () => labDone(`#/explore/${b.dataset.labPlanet}`)));   // выбор планеты открывает её глобус и каталог
  labEl.querySelectorAll('[data-lab-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.labLang, true)));
  labEl.addEventListener('keydown', e => {
    if (e.key === 'Escape') { labDone(); return; }
    if (e.key !== 'Tab') return;
    const items = [...labEl.querySelectorAll('button, [href]')].filter(el => el.offsetParent !== null && !el.closest('[hidden]'));
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
function labDone(hash = null) {
  if (lab.done) return; lab.done = true;
  lab.timers.forEach(clearTimeout); lab.timers = [];
  try { sessionStorage.setItem('rp-lab', '1'); } catch { /* не страшно */ }
  labEl.classList.add('leaving');
  lab.timers.push(setTimeout(() => {
    lab.globes?.then(g => g?.dispose()); lab.globes = null;
    labEl.hidden = true; labEl.className = '';
    document.documentElement.classList.remove('lab-open');
    if (!document.documentElement.classList.contains('page-open')) stage?.pause?.(false);
    $('#main').inert = !!state.explore;
    if (hash) { location.hash = hash; if (!hash.startsWith('#/')) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }); }
    else $('#intro-h')?.focus?.({ preventScroll: true });
  }, reducedMotion.matches ? 0 : 450));
}
labFinish = () => labDone();
function showLab({ replay = false } = {}) {
  if (!labEl) return;
  if (!replay) {
    let seen = false; try { seen = sessionStorage.getItem('rp-lab') === '1'; } catch { /* нет доступа — показываем */ }
    if (new URLSearchParams(location.search).has('skipintro') || location.hash.startsWith('#/') || seen) { labEl.hidden = true; return; }
  } else {
    closePage(false);
    if (state.explore) exitExplore({ cut: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeMenu();
  }
  wireLab();
  lab.timers.forEach(clearTimeout); lab.timers = []; lab.done = false;
  labEl.className = ''; labEl.querySelector('.lab-langs').hidden = true;
  labEl.hidden = false; labEl.scrollTop = 0;
  document.documentElement.classList.add('lab-open');
  $('#main').inert = true;
  stage?.pause?.(true);   // основную сцену не рисуем, пока её закрывает заставка
  paintLab();
  lab.globes = initLabGlobes(labEl);
  // без анимации (по настройке системы) и на телефоне — сразу лаборатория, без дверей
  if (reducedMotion.matches || matchMedia('(max-width: 40rem)').matches) { labEl.classList.add('granted', 'open', 'inside', 'simple'); paintLab(); labEl.querySelector('#lab-enter').focus({ preventScroll: true }); return; }
  void labEl.offsetWidth;   // чтобы анимация началась заново при повторном показе
  labEl.classList.add('scan');
  const at = (ms, fn) => lab.timers.push(setTimeout(fn, ms));
  at(1700, () => { labEl.classList.add('granted'); paintLab(); });
  at(2300, () => labEl.classList.add('open'));
  at(3500, () => { labEl.classList.add('inside'); labEl.querySelector('#lab-enter').focus({ preventScroll: true }); });
  labEl.querySelector('#lab-skip').focus({ preventScroll: true });
}

/* ---------- 3D Луна и Марс на центральном экране заставки (один холст, два окна просмотра) ---------- */
async function initLabGlobes(root) {
  const st = await stageReady;
  if (!st || root.hidden) return null;
  const { THREE } = st.debug, screen = root.querySelector('.lab-window'), old = root.querySelector('#lab-canvas'), canvas = old.cloneNode(false);
  old.replaceWith(canvas);   // новый холст при каждом показе: после dispose старый контекст WebGL потерян
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setScissorTest(true);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50); camera.position.set(0, 0, 4.25);
  let dead = false, raf = 0, last = performance.now();
  const own = [];
  const globes = ['moon', 'mars'].map(key => {
    const scene = new THREE.Scene(), sun = new THREE.DirectionalLight(0xfff6ea, 3.1), pivot = new THREE.Group();
    sun.position.set(-3, 2.2, 4); scene.add(sun, new THREE.AmbientLight(0x8fa3c8, 0.3), pivot);
    pivot.rotation.z = key === 'mars' ? 0.44 : 0.027;                      // наклон оси: Марс 25°, Луна 1,5°
    const tex = st.paintPlanet(key), geo = new THREE.SphereGeometry(1, 64, 48), mat = new THREE.MeshStandardMaterial({ map: tex.map, bumpMap: tex.bumpMap, bumpScale: 1.2, roughness: 1, metalness: 0 });
    own.push(tex.map, tex.bumpMap, geo, mat);
    const proc = new THREE.Mesh(geo, mat), spin = new THREE.Group(); spin.add(proc); pivot.add(spin);
    st.loadAsset(`${key}-globe`).then(gltf => {                            // настоящая модель глобуса, если файл доступен
      if (dead) return;
      const model = gltf.scene.clone(true), box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
      const fit = new THREE.Group(); model.position.set(-c.x, -c.y, -c.z); fit.add(model); fit.scale.setScalar(2 / Math.max(size.x, size.y, size.z, 1e-6));
      spin.remove(proc); spin.add(fit);
    }).catch(() => { /* файла модели нет — остаётся нарисованная поверхность */ });
    const btn = root.querySelector(`[data-lab-planet="${key}"]`);
    return { scene, spin, btn, el: btn.querySelector('i'), speed: 0.22 };
  });
  const frame = now => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const w = screen.clientWidth, h = screen.clientHeight;
    if (!w || !h) return;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.round(w * pr) || canvas.height !== Math.round(h * pr)) renderer.setSize(w, h, false);
    const base = screen.getBoundingClientRect();
    renderer.setScissor(0, 0, w, h); renderer.setViewport(0, 0, w, h); renderer.clear();
    for (const g of globes) {
      const hot = g.btn.matches(':hover, :focus-visible');
      g.speed += ((state.motion ? (hot ? 0.9 : 0.22) : 0) - g.speed) * Math.min(1, dt * 4);
      g.spin.rotation.y += g.speed * dt;
      const r = g.el.getBoundingClientRect(), pad = r.width * 0.06;
      const x = r.left - base.left - pad, y = h - (r.bottom - base.top) - pad, s = r.width + pad * 2;
      renderer.setViewport(x, y, s, s); renderer.setScissor(x, y, s, s);
      renderer.render(g.scene, camera);
    }
  };
  screen.classList.add('gl');
  raf = requestAnimationFrame(frame);
  return { dispose() { dead = true; cancelAnimationFrame(raf); own.forEach(o => o.dispose()); renderer.dispose(); renderer.forceContextLoss?.(); screen.classList.remove('gl'); } };
}

/* =====================================================================================
   Значки за исследование сайта (хранятся только в этом браузере)
   ===================================================================================== */
const BADGES = [
  ['moon', T('Moonwalker', 'Лунный путник', 'Ай жолаушысы'), T('Opened the Moon’s globe and catalogue', 'Открыл глобус и каталог Луны', 'Айдың глобусы мен каталогын ашты')],
  ['mars', T('Red planet', 'Красная планета', 'Қызыл ғаламшар'), T('Opened the Mars globe and catalogue', 'Открыл глобус и каталог Марса', 'Марстың глобусы мен каталогын ашты')],
  ['reader', T('Archivist', 'Архивариус', 'Мұрағатшы'), T('Opened 5 mission pages', 'Открыл 5 страниц миссий', '5 миссия бетін ашты')],
  ['photo', T('Photo hunter', 'Фотоохотник', 'Фотоаңшы'), T('Looked at 5 archive photos', 'Посмотрел 5 фотографий архива', 'Мұрағаттың 5 фотосуретін көрді')],
  ['timeline', T('Time traveller', 'Путешественник во времени', 'Уақыт саяхатшысы'), T('Opened the timeline', 'Открыл хронологию', 'Хронологияны ашты')],
  ['surprise', T('Lucky explorer', 'Везучий исследователь', 'Сәтті зерттеуші'), T('Pressed “Surprise me”', 'Нажал «Удиви меня»', '«Таңғалдыр» батырмасын басты')],
  ['quiz', T('First flight', 'Первый полёт', 'Алғашқы ұшу'), T('Finished a quiz round', 'Прошёл раунд викторины', 'Викторина раундын өтті')],
  ['ace', T('Mission commander', 'Командир миссии', 'Миссия командирі'), T('Answered 9 of 10 questions or more correctly', 'Ответил правильно минимум на 9 вопросов из 10', '10 сұрақтың кемінде 9-ына дұрыс жауап берді')],
];
const badgeStore = { get() { try { return JSON.parse(localStorage.getItem('vestige-badges') || '{}'); } catch { return {}; } }, set(v) { try { localStorage.setItem('vestige-badges', JSON.stringify(v)); } catch { /* браузер не хранит — просто не запоминаем */ } } };
function toast(html) {
  const box = lightbox?.open ? lightbox.querySelector('.lb-toasts') : $('#toasts'); if (!box) return;
  const el = document.createElement('p'); el.className = 'toast'; el.innerHTML = html; box.append(el);
  setTimeout(() => el.classList.add('out'), 3600); setTimeout(() => el.remove(), 4200);
}
function award(id) {
  const s = badgeStore.get(); if (s[id]) return;
  s[id] = Date.now(); badgeStore.set(s);
  const b = BADGES.find(x => x[0] === id); if (b) toast(`<b>${esc(ui('badgeGot'))}</b> ${esc(LT(b[1]))} — ${esc(LT(b[2]))}`);
}
function bump(id, need, key) {   // счётчик разных объектов (страниц, фото); значок — когда набралось need
  const s = badgeStore.get(), list = new Set(s[`c_${id}`] || []); if (list.has(key)) return;
  list.add(key); s[`c_${id}`] = [...list]; badgeStore.set(s);
  if (list.size >= need) award(id);
}
const badgesHTML = () => { const s = badgeStore.get(); return `<ul class="badges-grid">${BADGES.map(([id, name, desc]) => `<li class="bdg${s[id] ? ' got' : ''}"><span class="bdg-ico" aria-hidden="true">${s[id] ? '★' : '☆'}</span><b>${esc(LT(name))}</b><span>${esc(LT(desc))}</span><span class="sr">${esc(s[id] ? ui('badgeYes') : ui('badgeNo'))}</span></li>`).join('')}</ul>`; };

/* =====================================================================================
   Фотографии архива: сетка миниатюр и просмотр крупно
   ===================================================================================== */
const PHOTO_KIND = { p: 'kindPhoto', a: 'kindArt', s: 'kindPatch', x: 'kindProcessed', u: 'kindImage' };
function archiveGallery(id, max = 99) {
  const list = ARCHIVE_IMG[id] || []; if (!list.length) return '';
  return `<div class="ag">${list.slice(0, max).map((p, i) => `<button type="button" class="ag-item" data-lb="${esc(id)}:${i}" aria-label="${esc(`${p[2] || ui(PHOTO_KIND[p[5]])} — ${ui('photoOpen')}`)}"><img src="${esc(p[1])}" alt="" loading="lazy" decoding="async"><span class="ag-kind k-${p[5]}">${esc(ui(PHOTO_KIND[p[5]]))}</span></button>`).join('')}</div>`;
}
const lightbox = $('#lightbox'); let lbSet = null, lbIdx = 0;
function paintLightbox() {
  const [file, , cap, credit, orig, kind, lic] = ARCHIVE_IMG[lbSet][lbIdx], total = ARCHIVE_IMG[lbSet].length;
  const img = lightbox.querySelector('img'); img.src = file; img.alt = cap || ui(PHOTO_KIND[kind]);
  lightbox.querySelector('.lb-cap').textContent = cap;
  lightbox.querySelector('.lb-credit').innerHTML = `<span class="ag-kind k-${kind}">${esc(ui(PHOTO_KIND[kind]))}</span> ${esc(ui('credit'))}: ${esc(credit || '—')}${lic ? ` · ${esc(lic)}` : ''}${orig ? ` · <a href="${esc(orig)}" target="_blank" rel="noopener">${esc(ui('photoOriginal'))} ↗</a>` : ''} · ${lbIdx + 1} / ${total}`;
  lightbox.querySelectorAll('.lb-nav').forEach(b => { b.hidden = total < 2; });
  bump('photo', 5, file);
}
function openLightbox(id, i) {
  lbSet = id; lbIdx = i;
  lightbox.setAttribute('aria-label', ui('photoViewer'));
  lightbox.querySelector('.lb-prev').setAttribute('aria-label', ui('photoPrev'));
  lightbox.querySelector('.lb-next').setAttribute('aria-label', ui('photoNext'));
  lightbox.querySelector('.lb-close').textContent = ui('close');
  if (!lightbox.open) lightbox.showModal?.();
  paintLightbox();
}
on(document, 'click', e => { const b = e.target.closest('[data-lb]'); if (!b) return; e.preventDefault(); const [id, i] = b.dataset.lb.split(':'); openLightbox(id, Number(i)); });
lightbox?.querySelector('.lb-close').addEventListener('click', () => lightbox.close());
lightbox?.querySelector('.lb-prev').addEventListener('click', () => { lbIdx = (lbIdx - 1 + ARCHIVE_IMG[lbSet].length) % ARCHIVE_IMG[lbSet].length; paintLightbox(); });
lightbox?.querySelector('.lb-next').addEventListener('click', () => { lbIdx = (lbIdx + 1) % ARCHIVE_IMG[lbSet].length; paintLightbox(); });
lightbox?.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') lightbox.querySelector('.lb-prev').click(); if (e.key === 'ArrowRight') lightbox.querySelector('.lb-next').click(); });
lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

/* =====================================================================================
   За пределами экрана — наш импакт (в финальной главе рассказа)
   ===================================================================================== */
const IMPACT_TEXT = {
  lead: T('Vestige is not only a website. We are taking it to a place where school students actually come to learn: the library.', 'Vestige — это не только сайт. Мы несём его туда, куда школьники действительно приходят учиться: в библиотеку.', 'Vestige — тек сайт емес. Біз оны оқушылар шынымен білім алуға келетін жерге — кітапханаға апарамыз.'),
  cards: [
    [T('A place in the library', 'Место в библиотеке', 'Кітапханадағы орын'), T('We arranged for Vestige to be placed in a library learning environment and agreed on cooperation with the administration of the National Library of the Republic of Kazakhstan in Almaty.', 'Мы добились размещения Vestige в библиотечной образовательной среде и договорились о сотрудничестве с администрацией Национальной библиотеки Республики Казахстан в Алматы.', 'Біз Vestige-ті кітапхананың білім беру ортасына орналастыруға қол жеткіздік және Алматыдағы Қазақстан Республикасы Ұлттық кітапханасының әкімшілігімен ынтымақтастық туралы келістік.')],
    [T('A quiz you want to replay', 'Викторина, в которую хочется играть', 'Қайта ойнағың келетін викторина'), T('Learning is checked, not assumed: the quiz is a game with a timer, mission photos and a launch-order challenge, and every round draws new questions.', 'Знания проверяются, а не подразумеваются: викторина — это игра с таймером, фотографиями миссий и заданием «расставь запуски по порядку», и каждый раунд даёт новые вопросы.', 'Білім тексеріледі: викторина — таймері, миссия суреттері және «ұшырылымдарды ретімен қой» тапсырмасы бар ойын, әр раунд жаңа сұрақтар береді.')],
    [T('Three languages', 'Три языка', 'Үш тіл'), T('The museum speaks English, Russian and Kazakh, so that students can read about space exploration in the language they think in.', 'Музей говорит на английском, русском и казахском, чтобы школьники читали об исследовании космоса на языке, на котором думают.', 'Мұражай ағылшын, орыс және қазақ тілдерінде сөйлейді — оқушылар ғарышты зерттеу туралы өз ойлайтын тілінде оқи алады.')],
    [T('Why we do it', 'Зачем мы это делаем', 'Мұны не үшін істейміз'), T('We want to teach school students the history of space exploration and inspire them to choose science, engineering and the study of the Universe.', 'Мы хотим знакомить школьников с историей космоса и вдохновлять их заниматься наукой, инженерией и исследованием Вселенной.', 'Біз оқушыларды ғарыш тарихымен таныстырып, оларды ғылыммен, инженериямен және Ғаламды зерттеумен айналысуға шабыттандырғымыз келеді.')],
  ],
  honest: T('We do not publish numbers we cannot prove. Counts of students, lessons or visitors will appear here only when they are real.', 'Мы не публикуем цифры, которые не можем подтвердить. Количество учеников, занятий и посетителей появится здесь только тогда, когда оно будет настоящим.', 'Біз дәлелдей алмайтын сандарды жарияламаймыз. Оқушылар, сабақтар мен келушілер саны мұнда тек нақты болғанда ғана пайда болады.'),
};
function renderImpact() {
  const box = $('#impact'); if (!box) return;
  box.innerHTML = `<h3 class="pr-3 font-display text-[1.625rem] font-bold leading-[1.1]">${esc(ui('impact'))}</h3>
    <div class="impact-split mt-5">
      <figure class="team-photo"><img src="${esc(TEAM.photo)}" alt="${esc(ui('teamPhotoAlt'))}" width="960" height="1280" loading="lazy" decoding="async"><figcaption>${esc(ui('teamPhotoCap'))}</figcaption></figure>
      <div>
        <p class="text-[1.0625rem] leading-[1.55]">${esc(LT(IMPACT_TEXT.lead))}</p>
        <h4 class="sub-h">${esc(ui('teamTitle'))}</h4>
        <ul class="team-grid">${TEAM.members.map(mb => `<li class="member"><span class="avatar" aria-hidden="true">${esc(initials(mb.name))}</span><span class="member-name">${esc(mb.name)}</span><span class="member-role">${esc(mb.role ? LT(mb.role) : ui('teamMember'))}</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="impact">${IMPACT_TEXT.cards.map(([h, p]) => `<div class="impact-card"><h3>${esc(LT(h))}</h3><p>${esc(LT(p))}</p></div>`).join('')}</div>
    <p class="mt-4 text-[0.8125rem] text-dim">${esc(LT(IMPACT_TEXT.honest))}</p>
    <p class="mt-4 flex flex-wrap gap-2"><a class="btn btn-sm btn-solid" href="${esc(TEAM.official)}" target="_blank" rel="noopener">${esc(ui('officialTeam'))} ↗</a><a class="btn btn-sm" href="#/about">${esc(ui('about'))}</a><a class="btn btn-sm" href="#/quiz">${esc(ui('quizTitle'))}</a></p>`;
}
function renderQuizTeaser() {
  const box = $('#quiz-teaser'); if (!box) return;
  box.innerHTML = `<h3 class="pr-3 font-display text-[1.625rem] font-bold leading-[1.1]">${esc(ui('quizTitle'))}</h3>
    <p class="mt-4 max-w-[40rem]">${esc(ui('quizTeaser'))}</p>
    <ul class="qt-feats">${['qtF1', 'qtF2', 'qtF3', 'qtF4'].map(k => `<li>${esc(ui(k))}</li>`).join('')}</ul>
    <p class="mt-5"><a class="btn btn-solid" href="#/quiz">${esc(ui('quizStart'))}</a></p>`;
}

/* =====================================================================================
   Викторина-игра на отдельной странице: таймер, очки, серии, «50 на 50», фото и порядок запусков
   ===================================================================================== */
const QUIZ_LEN = 10, QUIZ_TIME = 20;
const qz = { mode: 'all', qs: [], i: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, used5050: false, timer: 0, left: QUIZ_TIME, done: false, active: false, saved: false, prevBest: 0, t0: 0 };
const MARS_RE = /mars|mariner|viking|phoenix|curiosity|perseverance|insight|ingenuity|zhurong|tianwen|opportunity|spirit|sojourner|mangalyaan|beagle|odyssey|maven|hope|olympus|gale|jezero|phobos/i;
const qPlanet = q => MARS_RE.test(`${q.q.en} ${q.a.map(a => a.en).join(' ')}`) ? 'mars' : 'moon';
const pickN = (list, n) => shuffled(list).slice(0, n);
const stemOf = r => String(r.id).split('-')[0];   // программа: luna, apollo, change, mars…
function quizRecs(mode) { return RECORDS.filter(r => ['moon', 'mars'].includes(r.planet) && (mode === 'all' || r.planet === mode) && r.cat === 'launched' && r.year && ['success', 'partial'].includes(r.outcome) && COUNTRY[r.country]); }
// Подписи вариантов считаются при показе — так вопрос можно перерисовать на другом языке
function qLabels(q) {
  if (q.kind === 'know') return q.order.map(i => L(q.item.a[i]));
  if (q.kind === 'year') return q.years.map(String);
  if (q.kind === 'country') return q.countries.map(countryName);
  if (q.kind === 'photo') return q.recs.map(r => `${recName(r)} — ${clsLabel(r.cls).toLowerCase()}`);
  return [];
}
function qPrompt(q) {
  if (q.kind === 'know') return L(q.item.q);
  if (q.kind === 'year') return ui('qYear', { name: recName(q.rec) });
  if (q.kind === 'country') return ui('qCountry', { name: recName(q.rec) });
  if (q.kind === 'photo') return ui('qPhoto');
  return ui('qOrder');
}
// Фото для вопроса: лучше снимок или рисунок самого аппарата; ракеты на старте и эмблемы (на них часто написано название) — в последнюю очередь
function photoScore(p) { return ({ a: 3, p: 2, x: 1, u: 1, s: -6 })[p[5]] + (p[7] ? 1 : 0) - (/launch|lift|rocket|pad\b|booster|fairing|logo|emblem|patch|stamp/i.test(p[2]) ? 4 : 0); }
function buildQuiz(mode) {
  const recs = quizRecs(mode), out = [], usedRecs = new Set();
  const take = (list, n) => { const got = pickN(list.filter(r => !usedRecs.has(r.id)), n); got.forEach(r => usedRecs.add(r.id)); return got; };
  const know = shuffled(QUIZ_POOL.filter(q => mode === 'all' || qPlanet(q) === mode));
  const knowQ = item => { const order = shuffled([0, 1, 2]); return { kind: 'know', item, order, ok: order.indexOf(item.ok) }; };
  know.slice(0, 4).forEach(item => out.push(knowQ(item)));
  const allYears = [...new Set(recs.map(x => x.year))];
  take(recs, 2).forEach(r => {
    let near = allYears.filter(y => Math.abs(y - r.year) >= 2 && Math.abs(y - r.year) <= 12);
    if (near.length < 2) near = allYears.filter(y => y !== r.year);
    const a = near[Math.floor(Math.random() * near.length)], rest = near.filter(y => Math.abs(y - a) >= 2), b = rest.length ? rest[Math.floor(Math.random() * rest.length)] : near.find(y => y !== a);
    const years = shuffled([r.year, a, b]);
    out.push({ kind: 'year', rec: r, years, ok: years.indexOf(r.year) });
  });
  const cs = [...new Set(RECORDS.map(x => x.country))].filter(c => COUNTRY[c]);
  take(recs, 1).forEach(r => { const countries = shuffled([r.country, ...pickN(cs.filter(c => c !== r.country), 2)]); out.push({ kind: 'country', rec: r, countries, ok: countries.indexOf(r.country) }); });
  take(recs.filter(r => (ARCHIVE_IMG[r.id] || []).some(p => photoScore(p) > 0)), 2).forEach(r => {
    const list = ARCHIVE_IMG[r.id], img = list.reduce((best, p, i) => photoScore(p) > photoScore(list[best]) ? i : best, 0);
    // другие варианты: другой тип аппарата, другая программа и другие годы — чтобы ответ можно было вывести из снимка
    let others = recs.filter(x => x.planet === r.planet && x.id !== r.id && stemOf(x) !== stemOf(r) && Math.abs(x.year - r.year) >= 4 && x.klass !== r.klass);
    if (others.length < 2) others = recs.filter(x => x.id !== r.id && stemOf(x) !== stemOf(r) && Math.abs(x.year - r.year) >= 4);
    const opts = shuffled([r, ...pickN(others, 2)]);
    out.push({ kind: 'photo', rec: r, img, recs: opts, ok: opts.indexOf(r) });
  });
  const pool = recs.filter((r, i, a) => a.findIndex(x => x.year === r.year) === i);   // разные годы, чтобы порядок был однозначным
  if (pool.length >= 4) out.push({ kind: 'order', recs: pickN(pool, 4) });
  for (const item of know.slice(4)) { if (out.length >= QUIZ_LEN) break; out.push(knowQ(item)); }   // не хватило фото или записей — добавляем вопросы из рассказа
  while (out.length < QUIZ_LEN) { const r = take(recs, 1)[0]; if (!r) break; const years = shuffled([r.year, r.year - 3, r.year + 4]); out.push({ kind: 'year', rec: r, years, ok: years.indexOf(r.year) }); }
  const qs = shuffled(out).slice(0, QUIZ_LEN), oi = qs.findIndex(q => q.kind === 'order');
  if (oi === 0 && qs.length > 1) [qs[0], qs[1]] = [qs[1], qs[0]];   // первым идёт обычный вопрос, а не задание на порядок
  return qs;
}
window.vestige.quiz = qz;   // для отладки и тестов
const qBestKey = m => `vestige-quiz-best-${m}`;
const qBest = m => { try { return Number(localStorage.getItem(qBestKey(m)) || 0); } catch { return 0; } };
const qzBox = () => $('#qz');
ROUTES.quiz = () => `<div class="qz" id="qz"></div>`;
function qzStart() {
  clearInterval(qz.timer); qz.active = false;
  const box = qzBox(); if (!box) return;
  box.innerHTML = `<p class="qz-kicker">${esc(ui('quizKicker'))}</p><h1 class="page-h1">${esc(ui('quizTitle'))}</h1>
    <p class="lead">${esc(ui('quizIntro'))}</p>
    <ul class="qz-rules"><li>${esc(ui('qRule1'))}</li><li>${esc(ui('qRule2'))}</li><li>${esc(ui('qRule3'))}</li></ul>
    <h2 class="sec-h">${esc(ui('qMode'))}</h2>
    <div class="qz-modes" role="group" aria-label="${esc(ui('qMode'))}">${['moon', 'mars', 'all'].map(m => `<button type="button" class="qz-mode m-${m}" data-qmode="${m}"><b>${esc(ui(m === 'moon' ? 'moonTitle' : m === 'mars' ? 'marsTitle' : 'qAll'))}</b><span>${esc(qBest(m) ? ui('qBestShort', { n: qBest(m) }) : ui('qNoBest'))}</span></button>`).join('')}</div>
    <h2 class="sec-h">${esc(ui('badgesTitle'))}</h2>${badgesHTML()}`;
  box.querySelectorAll('[data-qmode]').forEach(b => b.addEventListener('click', () => qzBegin(b.dataset.qmode)));
}
function qzBegin(mode) {
  Object.assign(qz, { mode, qs: buildQuiz(mode), i: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, used5050: false, done: false, active: true, saved: false, t0: 0 });
  const box = qzBox(); if (!box) return;
  if (reducedMotion.matches) { qzQuestion(); return; }
  // короткий обратный отсчёт перед стартом
  const steps = ['3', '2', '1', ui('qLiftoff')];
  box.innerHTML = `<div class="qz-count" role="status" aria-live="assertive"><span></span></div>`;
  const span = box.querySelector('.qz-count span');
  steps.forEach((s, k) => setTimeout(() => { if (!span.isConnected) return; span.textContent = s; span.classList.remove('go'); void span.offsetWidth; span.classList.add('go'); }, k * 520));
  setTimeout(() => { if (span.isConnected) qzQuestion(); }, steps.length * 520);
}
function qzHeader() {
  return `<div class="qz-bar"><div class="qz-progress" aria-hidden="true">${qz.qs.map((q, i) => `<i class="${q.answered ? (q.right ? 'ok' : 'no') : i === qz.i ? 'now' : ''}"></i>`).join('')}</div>
    <p class="qz-stats"><span>${esc(ui('qQuestion', { i: qz.i + 1, n: qz.qs.length }))}</span><span>${esc(ui('qScore'))}: <b id="qz-score">${qz.score}</b></span><span class="qz-streak${qz.streak >= 3 ? ' hot' : ''}">${esc(ui('qStreak'))}: <b>${qz.streak}</b>${qz.streak >= 3 ? ` <em>×${qz.streak >= 5 ? 2 : 1.5}</em>` : ''}</span></p></div>`;
}
function qzQuestion(keepTime = false) {
  const box = qzBox(), q = qz.qs[qz.i]; if (!box || !q) return;
  q.answered = false;
  let media = '', body = '';
  if (q.kind === 'photo') { const p = ARCHIVE_IMG[q.rec.id][q.img]; media = `<figure class="qz-photo"><img src="${esc(p[0])}" alt="${esc(ui('qPhotoAlt'))}" decoding="async"><figcaption>${esc(ui('credit'))}: ${esc(p[3] || '—')}</figcaption></figure>`; }
  if (q.kind === 'order') { q.picked = []; body = `<p class="qz-hint">${esc(ui('qOrderHint'))}</p><div class="qz-order">${q.recs.map((r, i) => `<button type="button" class="qz-chip" data-oi="${i}"><span class="qz-num" aria-hidden="true"></span><span>${esc(recName(r))}</span></button>`).join('')}</div>`; }
  else body = `<div class="qz-opts">${qLabels(q).map((o, i) => `<button type="button" class="qz-opt" data-qi="${i}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>`;
  box.innerHTML = `${qzHeader()}
    <div class="qz-card">
      <div class="qz-timer" style="--p:1" aria-hidden="true"><span id="qz-left">${QUIZ_TIME}</span></div>
      <h2 class="qz-q" tabindex="-1">${esc(qPrompt(q))}</h2>${media}${body}
      <div class="qz-tools">${q.kind !== 'order' ? `<button type="button" class="btn btn-sm" id="qz-5050"${qz.used5050 ? ' disabled' : ''}>${esc(ui('q5050'))}</button>` : ''}</div>
      <div class="qz-feedback" id="qz-fb" role="status" aria-live="polite"></div>
      <p class="qz-next-wrap"><button type="button" class="btn btn-solid" id="qz-next" hidden>${esc(ui(qz.i + 1 < qz.qs.length ? 'qNext' : 'qFinish'))}</button></p>
    </div>`;
  box.querySelectorAll('.qz-opt').forEach(b => b.addEventListener('click', () => qzAnswer(Number(b.dataset.qi))));
  box.querySelectorAll('.qz-chip').forEach(b => b.addEventListener('click', () => qzOrderPick(b)));
  box.querySelector('#qz-5050')?.addEventListener('click', e => {
    if (qz.used5050 || q.answered) return;
    qz.used5050 = true; e.currentTarget.disabled = true;
    const wrong = [0, 1, 2].filter(i => i !== q.ok), drop = wrong[Math.floor(Math.random() * wrong.length)], b = box.querySelector(`.qz-opt[data-qi="${drop}"]`);
    b.disabled = true; b.classList.add('gone');
  });
  box.querySelector('#qz-next').addEventListener('click', () => { qz.i++; if (qz.i < qz.qs.length) qzQuestion(); else qzEnd(); });
  pageEl.scrollTo?.({ top: 0 });
  box.querySelector('.qz-q').focus({ preventScroll: true });
  if (!keepTime || !qz.t0) qz.t0 = performance.now();
  clearInterval(qz.timer);
  const tick = () => {
    if (!box.isConnected || q.answered) { clearInterval(qz.timer); return; }
    qz.left = Math.max(0, QUIZ_TIME - (performance.now() - qz.t0) / 1000);
    const tm = box.querySelector('.qz-timer');
    tm.style.setProperty('--p', (qz.left / QUIZ_TIME).toFixed(3)); tm.classList.toggle('low', qz.left < 6);
    box.querySelector('#qz-left').textContent = Math.ceil(qz.left);
    if (qz.left <= 0) { clearInterval(qz.timer); qzAnswer(-1); }
  };
  tick(); qz.timer = setInterval(tick, 100);
}
function qzOrderPick(b) {
  const q = qz.qs[qz.i]; if (q.answered) return;
  const i = Number(b.dataset.oi);
  q.picked = q.picked.includes(i) ? q.picked.filter(x => x !== i) : [...q.picked, i];
  $$('#qz .qz-chip').forEach(c => { const k = q.picked.indexOf(Number(c.dataset.oi)); c.querySelector('.qz-num').textContent = k >= 0 ? k + 1 : ''; c.classList.toggle('on', k >= 0); c.setAttribute('aria-pressed', String(k >= 0)); });
  if (q.picked.length === q.recs.length) qzAnswer(0);
}
function qzAnswer(choice) {
  const q = qz.qs[qz.i], box = qzBox(); if (!q || q.answered || !box) return;
  q.answered = true; clearInterval(qz.timer);
  const labels = qLabels(q);
  let right;
  if (q.kind === 'order') {
    const sorted = [...q.recs].sort((a, b) => a.year - b.year || String(a.date).localeCompare(String(b.date)));
    right = choice !== -1 && q.picked.every((p, k) => q.recs[p] === sorted[k]);
    q.yours = q.picked.length ? q.picked.map(p => recName(q.recs[p])).join(' → ') : ui('qTimeout');
    box.querySelectorAll('.qz-chip').forEach(c => { const r = q.recs[Number(c.dataset.oi)], pos = sorted.indexOf(r); c.disabled = true; c.querySelector('.qz-num').textContent = pos + 1; c.classList.add(q.picked.indexOf(Number(c.dataset.oi)) === pos ? 'right' : 'wrong'); c.insertAdjacentHTML('beforeend', `<small>${r.year}</small>`); });
    q.correctText = sorted.map(r => `${recName(r)} (${r.year})`).join(' → ');
  } else {
    right = choice === q.ok;
    q.yours = choice >= 0 ? labels[choice] : ui('qTimeout'); q.correctText = labels[q.ok];
    box.querySelectorAll('.qz-opt').forEach(b => { const i = Number(b.dataset.qi); b.disabled = true; b.classList.toggle('right', i === q.ok); b.classList.toggle('wrong', i === choice && !right); });
  }
  box.querySelector('#qz-5050')?.setAttribute('disabled', '');
  q.right = right;
  let gain = 0;
  if (right) {
    qz.correct++; qz.streak++; qz.bestStreak = Math.max(qz.bestStreak, qz.streak);
    const mult = qz.streak >= 5 ? 2 : qz.streak >= 3 ? 1.5 : 1;
    gain = Math.round(((q.kind === 'order' ? 200 : 100) + Math.ceil(qz.left) * 5) * mult); qz.score += gain;
  } else qz.streak = 0;
  let why = '';
  if (q.kind === 'know') why = `${esc(L(q.item.why))}${q.item.ref ? ` <span class="cites">${citeHTML([q.item.ref])}</span>` : ''}`;
  else if (q.kind === 'order') why = esc(ui('qOrderAns', { list: q.correctText }));
  else {
    const r = q.rec, cap = q.kind === 'photo' ? ARCHIVE_IMG[r.id][q.img][2] : '';
    why = `${cap ? `${esc(ui('qPhotoIs'))} ${esc(cap)}. ` : ''}${esc(ui('qLaunchedOn', { name: recName(r), date: fmtDate(r.date), agency: r.agency, country: countryName(r.country) }))} <a href="#/missions/${esc(r.id)}">${esc(ui('openMission'))}</a>`;
  }
  const fb = box.querySelector('#qz-fb');
  fb.className = `qz-feedback ${right ? 'ok' : 'no'}`;
  fb.innerHTML = `<p class="qz-verdict">${esc(ui(right ? 'qRight' : choice === -1 ? 'qTimeout' : 'qWrong'))}${right ? ` <span class="qz-gain">+${gain}</span>` : ''}${right && qz.streak >= 3 ? ` <span class="qz-hot">${esc(ui('qOnFire', { n: qz.streak }))}</span>` : ''}</p><p>${why}</p>`;
  renderCites(fb);
  box.querySelector('.qz-card').classList.add(right ? 'flash-ok' : 'shake');
  box.querySelector('.qz-bar').outerHTML = qzHeader();
  const next = box.querySelector('#qz-next'); next.hidden = false; next.focus({ preventScroll: true });
  next.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });   // на телефоне пояснение и кнопка «Дальше» могут быть ниже экрана
}
function qzEnd() {
  clearInterval(qz.timer); qz.done = true; qz.active = false;
  const n = qz.qs.length, pct = qz.correct / n;
  if (!qz.saved) {
    qz.saved = true; qz.prevBest = qBest(qz.mode);
    if (qz.score > qz.prevBest) { try { localStorage.setItem(qBestKey(qz.mode), String(qz.score)); } catch { /* не страшно */ } }
    award('quiz'); if (qz.correct >= 9) award('ace');
  }
  paintEnd(pct >= 0.7);
}
function paintEnd(party = false) {
  const box = qzBox(); if (!box) return;
  const n = qz.qs.length, pct = qz.correct / n, rank = pct >= 0.9 ? 'rank4' : pct >= 0.7 ? 'rank3' : pct >= 0.4 ? 'rank2' : 'rank1', isBest = qz.score > qz.prevBest;
  box.innerHTML = `<div class="qz-end">
    ${party && !reducedMotion.matches ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 42 }, () => `<i style="--x:${Math.round(Math.random() * 100)};--d:${(Math.random() * 1.1).toFixed(2)}s;--h:${Math.round(Math.random() * 360)}"></i>`).join('')}</div>` : ''}
    <p class="qz-kicker">${esc(ui('qResult'))} · ${esc(ui(qz.mode === 'moon' ? 'moonTitle' : qz.mode === 'mars' ? 'marsTitle' : 'qAll'))}</p><h1 class="page-h1">${esc(ui(rank))}</h1>
    <p class="lead">${esc(ui(`${rank}Note`))}</p>
    <div class="qz-final"><div><b>${qz.score}</b><span>${esc(ui('qScore'))}</span></div><div><b>${qz.correct}/${n}</b><span>${esc(ui('qCorrect'))}</span></div><div><b>${qz.bestStreak}</b><span>${esc(ui('qBestStreak'))}</span></div></div>
    <p class="mt-3">${esc(isBest ? ui('qNewBest') : ui('qBestWas', { n: qz.prevBest }))}</p>
    <p class="mt-5 flex flex-wrap gap-2"><button type="button" class="btn btn-solid" id="qz-again">${esc(ui('qPlayAgain'))}</button><button type="button" class="btn" id="qz-modes">${esc(ui('qChangeMode'))}</button><button type="button" class="btn" id="qz-copy">${esc(ui('qCopy'))}</button></p>
    <details class="acc mt-6"><summary><span>${esc(ui('qReview'))}</span></summary><div class="acc-body"><ol class="qz-review">${qz.qs.map(q => `<li class="${q.right ? 'ok' : 'no'}"><b>${esc(qPrompt(q))}</b><span>${esc(ui('qYour'))}: ${esc(q.yours || '—')}</span>${q.right ? '' : `<span>${esc(ui('qAnswer'))}: ${esc(q.correctText || '')}</span>`}</li>`).join('')}</ol></div></details>
    <h2 class="sec-h">${esc(ui('badgesTitle'))}</h2>${badgesHTML()}</div>`;
  box.querySelector('#qz-again').addEventListener('click', () => qzBegin(qz.mode));
  box.querySelector('#qz-modes').addEventListener('click', qzStart);
  box.querySelector('#qz-copy').addEventListener('click', async () => {
    const text = ui('qShare', { mode: ui(qz.mode === 'moon' ? 'moonTitle' : qz.mode === 'mars' ? 'marsTitle' : 'qAll'), score: qz.score, correct: qz.correct, n, rank: ui(rank) });
    try { await navigator.clipboard.writeText(`${text} ${location.origin}${location.pathname}#/quiz`); toast(esc(ui('qCopied'))); } catch { toast(esc(text)); }
  });
  box.querySelector('h1').tabIndex = -1; box.querySelector('h1').focus({ preventScroll: true });
}
// Перерисовать игру на новом языке, не сбрасывая раунд
function qzRefresh() {
  if (qz.done) { paintEnd(false); return; }
  if (!qz.active) { qzStart(); return; }
  const q = qz.qs[qz.i];
  if (q?.answered) { qz.i++; if (qz.i < qz.qs.length) qzQuestion(); else qzEnd(); return; }
  qzQuestion(true);
}
on(document, 'keydown', e => {
  if (pageEl.hidden || pageRoute?.name !== 'quiz' || e.altKey || e.ctrlKey || e.metaKey) return;
  if (['1', '2', '3', '4'].includes(e.key)) {
    const k = Number(e.key) - 1, b = $(`#qz .qz-opt[data-qi="${k}"]`) || $(`#qz .qz-chip[data-oi="${k}"]`);
    if (b && !b.disabled) { e.preventDefault(); b.click(); }
  }
});

/* ---------- «Удиви меня»: случайная миссия ---------- */
function surprise(planet) {
  award('surprise');
  // чаще выпадают миссии с фото или рассказом — с ними интереснее
  const pick = list => { const rich = list.filter(r => ARCHIVE_IMG[r.id] || r.mission || PROFILES[r.id]); const from = rich.length && Math.random() < 0.8 ? rich : list; return from[Math.floor(Math.random() * from.length)]; };
  if (state.explore) { const r = pick(RECORDS.filter(r => r.planet === state.explore && r.site)); if (r) exploreSelect(r.site, { from: 'list' }); return; }
  const r = pick(RECORDS.filter(r => !planet || r.planet === planet));
  if (r) location.hash = `#/missions/${r.id}`;
}

/* ---------- Кнопки выбора планеты на первом экране ---------- */
function paintPicks() {
  for (const key of ['moon', 'mars']) {
    const el = $(`#pick-${key}`); if (!el) continue;
    const n = launched(key).length, first = Math.min(...launched(key).map(r => r.year));
    el.querySelector('b').textContent = ui(key === 'moon' ? 'exploreMoon' : 'exploreMars');
    el.querySelector('span').textContent = ui('pickCount', { n, first, word: plural(n, UI.launchesWord) });
  }
}

/* ---------- Запуск ---------- */
renderMenu();
renderCites();
renderMainFooter();
paintPicks();
renderImpact(); renderQuizTeaser();
langHooks.push(() => {
  renderMenu(); renderCites($('#main')); renderCites($('#dossier')); renderMainFooter(); paintPicks(); renderImpact(); renderQuizTeaser(); closeCite(false);
  if (state.explore) paintExplore();
  if (pageRoute) { const top = pageEl.scrollTop; openPage(pageRoute, ROUTES[pageRoute.name]); pageEl.scrollTop = top; }
});
showLab();
route();
