/* =====================================================================================
   ЗАБЫТАЯ ТЕХНИКА — логика страницы
   Содержание:
     1. ПУТИ К ВАШИМ ФАЙЛАМ        ← модели, текстуры и фотографии меняются здесь
     2. Настройки сцены
     3. Данные: точки на Луне и Марсе, викторина, диаграмма
     4. Тексты: английская версия и короткие строки интерфейса
     5. Интерфейс (работает и без 3D)
     6. 3D-сцена на Three.js
   ===================================================================================== */

/* =====================================================================================
   1. ПУТИ К ВАШИМ ФАЙЛАМ
   Пути считаются от папки, где лежит index.html. Если файла нет, сайт не сломается:
   вместо модели планеты появится нарисованная кодом, вместо техники — заглушка,
   вместо фото — схема. Чтобы не искать файл вообще, поставьте null.
   ВАЖНО: модели и текстуры грузятся только с веб-сервера (http://…), а не при открытии
   файла двойным щелчком (file://…). Локально подойдёт, например: python -m http.server
   ===================================================================================== */

// Раскладка текстуры у модели Марса от NASA: развёртка куба «крестом» 4×3.
// Нужна, чтобы точки на планете попадали ровно в свои кратеры. Для обычной модели-сферы
// с прямоугольной картой (equirectangular) это не требуется — поставьте cubeCross: null.
const CUBE_CROSS_MARS = {
  cols: 4, rows: 3,
  faces: [ // cell — клетка [столбец, строка]; n — куда смотрит грань; u, v — оси текстуры в координатах модели
    { cell: [3, 1], n: [1, 0, 0],  u: [0, 0, -1], v: [0, -1, 0] },
    { cell: [1, 1], n: [-1, 0, 0], u: [0, 0, 1],  v: [0, -1, 0] },
    { cell: [2, 0], n: [0, 1, 0],  u: [1, 0, 0],  v: [0, 0, 1] },
    { cell: [0, 2], n: [0, -1, 0], u: [-1, 0, 0], v: [0, 0, 1] },
    { cell: [2, 1], n: [0, 0, 1],  u: [1, 0, 0],  v: [0, -1, 0] },
    { cell: [0, 1], n: [0, 0, -1], u: [-1, 0, 0], v: [0, -1, 0] },
  ],
};

function photoCard(missionId) {
  const ph = PHOTOS[missionId]?.[0]; if (!ph) return { src: null, caption: null };
  const [id, size, , cap, credit] = ph;
  return { src: `https://images-assets.nasa.gov/image/${id}/${id}~${size}.jpg`, caption: Object.fromEntries(['en', 'ru', 'kk'].map(l => [l, `${cap[l]} (${credit})`])) };
}
const ASSETS = {
  planets: {
    moon: {
      model: ['models/optimized/planets/moon_small.glb', 'models/planets/moon_small.glb'],   // ← 3D-модель Луны: сначала сжатая копия, если её нет — оригинал
      modelYaw: -Math.PI / 2,                  // поворот модели вокруг оси, чтобы долгота 0° встала на место (в радианах)
      cubeCross: null,
      colorMap: 'textures/moon_color.jpg',     // ← запасной вариант без модели: карта цвета (прямоугольная, 2:1)
      bumpMap: 'textures/moon_bump.jpg',       // ← запасной вариант: карта высот (чёрно-белая)
      bumpScale: 1.5,
    },
    mars: {
      model: ['models/optimized/planets/24881_Mars_1_6792_1.glb', 'models/planets/24881_Mars_1_6792_1.glb'],   // ← 3D-модель Марса (NASA)
      modelYaw: Math.PI,
      cubeCross: CUBE_CROSS_MARS,
      colorMap: 'textures/mars_color.jpg',     // ← запасной вариант: карта цвета
      bumpMap: 'textures/mars_bump.jpg',       // ← запасной вариант: карта высот
      bumpScale: 1.5,
    },
  },

  // 3D-модели техники на глобусах. Проверенные модели NASA привязаны к точкам в реестре
  // (SITE_MODELS и ASSET_REGISTRY в разделе данных). Здесь — запасные файлы по типу заглушки:
  // если для точки нет модели в реестре, сайт попробует этот файл, а если нет и его — оставит заглушку.
  //   scale     — множитель размера (1 — как у заглушки)
  //   rotationY — разворот модели вокруг вертикали, в радианах
  hardware: {
    lunokhod: { model: null, scale: 1, rotationY: 0 },     // ← Луноход-1 и Луноход-2: проверенной модели нет, стоит заглушка
    mer:      { model: null, scale: 1, rotationY: 0.6 },   // ← Opportunity и Spirit (модель — из реестра)
    crew:     { model: null, scale: 1, rotationY: 0 },     // ← «Аполлоны» (модель лунного модуля — из реестра)
    rover:    { model: null, scale: 1, rotationY: 0.6 },   // ← Curiosity (из реестра) и Perseverance (заглушка)
    lander:   { model: null, scale: 1, rotationY: 0 },     // ← посадочные станции
  },

  // Фотографии в карточках. caption — подпись под фото (укажите автора снимка).
  photos: {
    // первый снимок миссии из списка PHOTOS (библиотека изображений NASA); подпись — с автором снимка
    lunokhod1: photoCard('luna-17-lunokhod-1'),
    opportunity: photoCard('opportunity'),
  },
};

/* =====================================================================================
   2. НАСТРОЙКИ СЦЕНЫ
   ===================================================================================== */
const SETTINGS = {
  fov: 35,                                   // угол обзора камеры, градусы
  radius: { moon: 1, mars: 1.951 },          // радиусы планет в сцене: Марс в 1,95 раза больше Луны, как на самом деле
  spinFree: 0.05,                            // фоновое вращение планеты вдали, рад/с
  spinFocused: 0.008,                        // фоновое вращение планеты крупным планом, рад/с
  scrollLerp: 7,                             // плавность: чем больше число, тем быстрее сцена догоняет прокрутку
  hardwareSize: { hero: 0.12, normal: 0.08 },// размер моделей техники в радиусах планеты (они сильно увеличены)
  maxPixelRatio: 2,
};

/* =====================================================================================
   3. ДАННЫЕ
   Координаты: lat — широта (север +), lon — восточная долгота (запад −), в градусах.
   status: silent — молчит; passive — молчит, но ещё служит науке; active — работает.
   kind: lunokhod | mer | rover | lander | crew — какая заглушка/модель стоит на планете.
   ===================================================================================== */
const SITES = [
  // ------------------------------ ЛУНА ------------------------------
  { id: 'lunokhod1', world: 'moon', hero: true, kind: 'lunokhod', status: 'passive', lat: 38.315, lon: -35.008, years: '1970',
    name: { ru: 'Луноход-1', en: 'Lunokhod 1' }, who: { ru: 'СССР, 1970–1971', en: 'USSR, 1970–1971' }, place: { ru: 'Море Дождей', en: 'Sea of Rains (Mare Imbrium)' },
    text: { ru: 'Первый в мире планетоход. За 11 лунных дней проехал 10,5 км. В 2010 году его нашли на снимках спутника LRO и снова поймали отражённый от него луч лазера.',
            en: 'The world’s first rover on another body. It drove 10.5 km in 11 lunar days. In 2010 it was found in images from the LRO orbiter, and a laser beam was bounced off it once again.' },
    science: { ru: 'По его отражателю измеряют расстояние до Луны с точностью до миллиметров.', en: 'Its reflector helps measure the distance to the Moon to within millimetres.' } },
  { id: 'luna2', world: 'moon', kind: 'lander', status: 'silent', lat: 29.1, lon: 0.0, years: '1959',
    name: { ru: 'Луна-2', en: 'Luna 2' }, who: { ru: 'СССР, 1959', en: 'USSR, 1959' }, place: { ru: 'к востоку от Моря Дождей', en: 'east of the Sea of Rains' },
    text: { ru: 'Первый предмет, сделанный людьми, который достиг другого небесного тела. Станция не садилась, а врезалась в Луну 13 сентября 1959 года — через два года после первого спутника.',
            en: 'The first human-made object to reach another world. It did not land: it struck the Moon on 13 September 1959, two years after the first satellite.' },
    science: { ru: 'По пути её приборы не нашли у Луны заметного магнитного поля.', en: 'On the way in, its instruments found that the Moon has no noticeable magnetic field.' } },
  { id: 'apollo11', world: 'moon', kind: 'crew', status: 'passive', lat: 0.674, lon: 23.473, years: '1969',
    name: { ru: 'Аполлон-11', en: 'Apollo 11' }, who: { ru: 'США, 1969', en: 'USA, 1969' }, place: { ru: 'Море Спокойствия', en: 'Sea of Tranquility' },
    text: { ru: '20 июля 1969 года здесь впервые сели люди — Нил Армстронг и Базз Олдрин. На месте остались посадочная ступень, приборы и флаг. Флаг, по словам Олдрина, повалило струёй двигателя при взлёте.',
            en: 'On 20 July 1969 people landed here for the first time: Neil Armstrong and Buzz Aldrin. The descent stage, instruments and a flag stayed behind. According to Aldrin, the flag was knocked over by the engine blast at lift-off.' },
    science: { ru: 'Их отражатель из 100 призм не требует энергии и работает до сих пор.', en: 'Their reflector of 100 prisms needs no power and still works today.' } },
  { id: 'surveyor3', world: 'moon', kind: 'lander', status: 'silent', lat: -3.01, lon: -23.42, years: '1967',
    name: { ru: 'Сервейер-3', en: 'Surveyor 3' }, who: { ru: 'США, 1967', en: 'USA, 1967' }, place: { ru: 'Океан Бурь', en: 'Ocean of Storms' },
    text: { ru: 'Единственный робот на другом небесном теле, к которому пришли люди. Через два с половиной года рядом, примерно в 160 метрах, сел «Аполлон-12». Астронавты сняли с аппарата телекамеру и ковш и увезли на Землю.',
            en: 'The only robot on another world ever visited by people. Two and a half years after it landed, Apollo 12 set down about 160 metres away. The astronauts removed its TV camera and scoop and took them back to Earth.' },
    science: { ru: 'По этим деталям узнали, что делают с техникой годы на Луне.', en: 'Those parts showed what years on the Moon do to hardware.' } },
  { id: 'lunokhod2', world: 'moon', kind: 'lunokhod', status: 'passive', lat: 25.85, lon: 30.45, years: '1973',
    name: { ru: 'Луноход-2', en: 'Lunokhod 2' }, who: { ru: 'СССР, 1973', en: 'USSR, 1973' }, place: { ru: 'кратер Лемонье', en: 'Le Monnier crater' },
    text: { ru: 'За четыре месяца проехал около 39 км — этот рекорд держался 41 год. В 1993 году аппарат продали на аукционе: его купил разработчик компьютерных игр Ричард Гэрриот. Забрать покупку пока нельзя.',
            en: 'In four months it drove about 39 km, a record that stood for 41 years. In 1993 the rover was sold at auction to video-game developer Richard Garriott. He cannot collect it just yet.' },
    science: { ru: 'Его отражатель тоже отвечает на лазер, хотя и слабее.', en: 'Its reflector also answers lasers, though more faintly.' } },
  { id: 'apollo17', world: 'moon', kind: 'crew', status: 'silent', lat: 20.19, lon: 30.77, years: '1972',
    name: { ru: 'Аполлон-17', en: 'Apollo 17' }, who: { ru: 'США, 1972', en: 'USA, 1972' }, place: { ru: 'долина Таурус — Литтров', en: 'Taurus–Littrow valley' },
    text: { ru: 'Последняя высадка людей на Луну, декабрь 1972 года. Юджин Сернан и геолог Харрисон Шмитт проехали на лунном автомобиле 35,7 км. Автомобиль остался здесь; его камера сняла, как взлетает корабль. Через месяц примерно в 175 км к северу сел «Луноход-2».',
            en: 'The last crewed landing on the Moon, December 1972. Eugene Cernan and geologist Harrison Schmitt drove 35.7 km in their lunar rover. The car is still here; its camera filmed the lift-off. A month later Lunokhod 2 landed about 175 km to the north.' },
    science: { ru: 'Шмитт нашёл оранжевый грунт — стеклянные шарики древнего вулканического извержения.', en: 'Schmitt found orange soil: glass beads from an ancient volcanic eruption.' } },

  // ------------------------------ МАРС ------------------------------
  { id: 'opportunity', world: 'mars', hero: true, kind: 'mer', status: 'silent', lat: -2.33, lon: -5.35, years: '2004',
    name: { ru: 'Opportunity', en: 'Opportunity' }, who: { ru: 'США, 2004–2018', en: 'USA, 2004–2018' }, place: { ru: 'плато Меридиана, край кратера Индевор', en: 'Meridiani Planum, rim of Endeavour crater' },
    text: { ru: 'Рассчитан на 90 марсианских суток, проработал 5111. Нашёл доказательства того, что на Марсе была жидкая вода. Замолчал во время пыльной бури, накрывшей всю планету.',
            en: 'Built for 90 Martian days, it worked for 5,111. It found proof that Mars once had liquid water. It fell silent during a dust storm that covered the whole planet.' },
    science: { ru: 'Гематитовая «черника», ярозит, гипс и глины — следы древней воды.', en: 'Hematite “blueberries”, jarosite, gypsum and clays: traces of ancient water.' } },
  { id: 'spirit', world: 'mars', kind: 'mer', status: 'silent', lat: -14.57, lon: 175.47, years: '2004',
    name: { ru: 'Spirit', en: 'Spirit' }, who: { ru: 'США, 2004–2010', en: 'USA, 2004–2010' }, place: { ru: 'кратер Гусев', en: 'Gusev crater' },
    text: { ru: 'Близнец Opportunity. В 2006 году у него заклинило переднее колесо, и марсоход поехал задом, волоча колесо за собой. В 2009 году он увяз в песке, а в марте 2010-го замолчал.',
            en: 'Opportunity’s twin. In 2006 a front wheel jammed, so the rover drove backwards, dragging the wheel behind it. In 2009 it got stuck in sand, and in March 2010 it fell silent.' },
    science: { ru: 'Заклинившее колесо пропахало борозду и вскрыло почти чистый кремнезём — след древних горячих источников.', en: 'The jammed wheel ploughed a trench and exposed almost pure silica, a trace of ancient hot springs.' } },
  { id: 'viking1', world: 'mars', kind: 'lander', status: 'silent', lat: 22.27, lon: -47.95, years: '1976',
    name: { ru: 'Викинг-1', en: 'Viking 1' }, who: { ru: 'США, 1976–1982', en: 'USA, 1976–1982' }, place: { ru: 'равнина Хриса', en: 'Chryse Planitia' },
    text: { ru: 'Первая американская станция на Марсе. Проработала больше шести лет. В ноябре 1982 года с Земли ушла ошибочная команда: она стёрла настройки антенны, и связь пропала.',
            en: 'The first American lander on Mars. It worked for more than six years. In November 1982 a faulty command from Earth overwrote its antenna settings, and contact was lost.' },
    science: { ru: 'Передала первые подробные снимки поверхности и первой искала в грунте следы жизни. Ясного ответа не получила.', en: 'It sent the first detailed pictures of the surface and was the first to test the soil for life. It got no clear answer.' } },
  { id: 'viking2', world: 'mars', kind: 'lander', status: 'silent', lat: 47.667, lon: 134.281, years: '1976',
    name: { ru: 'Викинг-2', en: 'Viking 2' }, who: { ru: 'США, 1976–1980', en: 'USA, 1976–1980' }, place: { ru: 'равнина Утопия', en: 'Utopia Planitia' },
    text: { ru: 'Близнец «Викинга-1», севший намного севернее. Снял иней на грунте, нёс единственный работавший сейсмометр «Викингов» и вёл запись погоды до апреля 1980 года.',
            en: 'The twin of Viking 1, which landed much farther north. It photographed frost on the ground, carried the only working Viking seismometer and kept a weather record until April 1980.' },
    science: { ru: 'Первые снимки инея на поверхности Марса и долгий ряд наблюдений погоды.', en: 'The first pictures of frost on the surface of Mars and a long series of weather observations.' } },
  { id: 'pathfinder', world: 'mars', kind: 'lander', status: 'silent', lat: 19.13, lon: -33.22, years: '1997',
    name: { ru: 'Pathfinder и Sojourner', en: 'Pathfinder and Sojourner' }, who: { ru: 'США, 1997', en: 'USA, 1997' }, place: { ru: 'долина Арес', en: 'Ares Vallis' },
    text: { ru: 'Sojourner — первый марсоход: размером с микроволновку, 10,6 кг. Рассчитан на неделю, проработал 83 марсианских суток и проехал около 100 метров, не отходя далеко от посадочной станции.',
            en: 'Sojourner was the first Mars rover: the size of a microwave oven, 10.6 kg. Built for a week, it worked for 83 Martian days and drove about 100 metres, never far from its lander.' },
    science: { ru: 'Доказал, что по Марсу можно ездить, и проверил посадку на воздушных подушках — такую же, как потом у Opportunity.', en: 'It proved you can drive on Mars and tested the airbag landing later used by Opportunity.' } },
  { id: 'mars3', world: 'mars', kind: 'lander', status: 'silent', lat: -45.0, lon: -158.0, years: '1971',
    name: { ru: 'Марс-3', en: 'Mars 3' }, who: { ru: 'СССР, 1971', en: 'USSR, 1971' }, place: { ru: 'южное полушарие', en: 'southern hemisphere' },
    text: { ru: 'Первая в истории мягкая посадка на Марс — 2 декабря 1971 года. Станция начала передавать изображение и вскоре замолчала: по разным данным — через 14,5 или 20 секунд, а по новому анализу 2024 года — не раньше чем через минуту. Почему — неизвестно до сих пор. На борту был маленький марсоход на кабеле; данных от него так и не получили.',
            en: 'The first soft landing on Mars in history, on 2 December 1971. The lander began sending a picture and soon went silent: after 14.5 or 20 seconds according to different sources, or after at least a minute according to a new 2024 analysis. Nobody knows why to this day. On board was a small rover on a cable; no data from it was ever received.' },
    science: { ru: 'Показала, что на Марс можно сесть: парашют и тормозные двигатели справляются.', en: 'It showed that a landing on Mars is possible: a parachute and braking rockets can do the job.' } },
  { id: 'phoenix', world: 'mars', kind: 'lander', status: 'silent', lat: 68.22, lon: -125.75, years: '2008',
    name: { ru: 'Phoenix', en: 'Phoenix' }, who: { ru: 'США, 2008', en: 'USA, 2008' }, place: { ru: 'арктическая равнина', en: 'the arctic plains' },
    text: { ru: 'Сел севернее всех. Ковшом раскопал грунт и нашёл под ним лёд. Через пять месяцев наступила полярная зима, солнца стало мало, и станция замолчала. Судя по снимкам со спутника, её солнечные панели сломались под тяжестью инея.',
            en: 'It landed farther north than any other. Its scoop dug into the soil and found ice underneath. Five months later the polar winter came, sunlight ran short and the lander fell silent. Orbiter images suggest its solar panels broke under the weight of frost.' },
    science: { ru: 'Подтвердил: под поверхностью Марса есть водяной лёд.', en: 'It confirmed that water ice lies just under the surface of Mars.' } },
  { id: 'insight', world: 'mars', kind: 'lander', status: 'silent', lat: 4.5, lon: 135.62, years: '2018',
    name: { ru: 'InSight', en: 'InSight' }, who: { ru: 'США, 2018–2022', en: 'USA, 2018–2022' }, place: { ru: 'равнина Элизий', en: 'Elysium Planitia' },
    text: { ru: 'Он не ездил, а слушал. Сейсмометр записал 1319 марсотрясений. В декабре 2022 года панели занесло пылью, и энергии не осталось.',
            en: 'It did not drive; it listened. Its seismometer recorded 1,319 marsquakes. In December 2022 dust covered its panels and the power ran out.' },
    science: { ru: 'По толчкам учёные «просветили» планету: узнали толщину коры и то, что ядро Марса жидкое.', en: 'From the quakes, scientists mapped the planet’s inside: the thickness of the crust and a liquid core.' } },
  { id: 'curiosity', world: 'mars', kind: 'rover', status: 'active', lat: -4.59, lon: 137.44, years: '2012',
    name: { ru: 'Curiosity', en: 'Curiosity' }, who: { ru: 'США, с 2012 года', en: 'USA, since 2012' }, place: { ru: 'кратер Гейл', en: 'Gale crater' },
    text: { ru: 'Работает. Размером с автомобиль, а энергию берёт не от солнца, а от ядерной «батарейки», поэтому пыль на панелях ему не страшна. В августе 2026 года отметил 5000 марсианских суток.',
            en: 'Still working. It is the size of a car and runs not on sunlight but on a nuclear “battery”, so dusty panels are no threat. In August 2026 it marked 5,000 Martian days.' },
    science: { ru: 'Нашёл дно древнего озера, где когда-то могли жить микробы.', en: 'It found the bed of an ancient lake where microbes could once have lived.' } },
  { id: 'perseverance', world: 'mars', kind: 'rover', status: 'active', lat: 18.44, lon: 77.45, years: '2021',
    name: { ru: 'Perseverance', en: 'Perseverance' }, who: { ru: 'США, с 2021 года', en: 'USA, since 2021' }, place: { ru: 'кратер Езеро', en: 'Jezero crater' },
    text: { ru: 'Работает. 11 октября 2026 года побил рекорд Opportunity: 45,22 км. Больше 90% пути выбирает дорогу сам. Привёз вертолёт Ingenuity — тот совершил 72 полёта.',
            en: 'Still working. On 11 October 2026 it beat Opportunity’s record with 45.22 km. It picks its own path for more than 90% of the way. It brought the Ingenuity helicopter, which made 72 flights.' },
    science: { ru: 'Собирает образцы пород в пробирки, чтобы когда-нибудь их можно было привезти на Землю.', en: 'It seals rock samples in tubes so that one day they can be brought back to Earth.' } },
];
SITES.push(...EXPLORE_SITES);   // точки, которые видны только в режиме «Исследовать» (координаты LROC и NSSDCA)
// Казахские тексты точек (сами тексты — в разделе переводов, SITE_KK)
for (const s of SITES) { const k = SITE_KK[s.id]; if (k) for (const f of ['name', 'who', 'place', 'text', 'science']) s[f].kk = k[f]; }
const SITE = Object.fromEntries(SITES.map(s => [s.id, s]));
const MISSION_OF_SITE = Object.fromEntries(MISSIONS.filter(m => m.site).map(m => [m.site, m]));   // точка на глобусе → страница миссии

// Диаграмма «эстафета»: сколько километров проехали по другому миру
const RELAY = [
  { world: 'moon', km: 10.54, digits: 1, name: { ru: 'Луноход-1', en: 'Lunokhod 1' }, meta: { ru: 'Луна, 1970–1971. Первый планетоход.', en: 'Moon, 1970–1971. The first rover on another world.' } },
  { world: 'moon', km: 27.8, digits: 1, name: { ru: 'Лунный автомобиль «Аполлона-15»', en: 'Apollo 15 lunar rover' }, meta: { ru: 'Луна, 1971. Первый автомобиль с астронавтами.', en: 'Moon, 1971. The first car with astronauts at the wheel.' } },
  { world: 'moon', km: 35.7, digits: 1, name: { ru: 'Лунный автомобиль «Аполлона-17»', en: 'Apollo 17 lunar rover' }, meta: { ru: 'Луна, 1972. Пока последняя поездка людей по Луне.', en: 'Moon, 1972. People’s last drive on the Moon so far.' } },
  { world: 'moon', km: 39, digits: 0, name: { ru: 'Луноход-2', en: 'Lunokhod 2' }, meta: { ru: 'Луна, 1973. Рекорд на 41 год.', en: 'Moon, 1973. A record for 41 years.' } },
  { world: 'mars', km: 45.16, digits: 2, name: { ru: 'Opportunity', en: 'Opportunity' }, meta: { ru: 'Марс, 2004–2018. Рекорд с 2014 по 2026 год.', en: 'Mars, 2004–2018. Record holder from 2014 to 2026.' } },
  { world: 'mars', km: 45.22, digits: 2, name: { ru: 'Perseverance', en: 'Perseverance' }, meta: { ru: 'Марс, с 2021 года. Новый рекорд — и он ещё едет.', en: 'Mars, since 2021. The new record, and still driving.' } },
];
RELAY.forEach((r, i) => { r.name.kk = RELAY_KK[i].name; r.meta.kk = RELAY_KK[i].meta; r.ref = RELAY_REFS[i]; });
const RELAY_MAX = 50, MARATHON = 42.195;

// Викторина: a — варианты, ok — номер верного варианта
const QUIZ = [
  { q: { ru: 'Сколько человек одновременно управляли «Луноходом-1»?', en: 'How many people drove Lunokhod 1 at the same time?' },
    a: [{ ru: 'Один', en: 'One' }, { ru: 'Пять', en: 'Five' }, { ru: 'Двенадцать', en: 'Twelve' }], ok: 1,
    why: { ru: 'Экипаж из пяти человек: командир, водитель, штурман, бортинженер и оператор антенны.', en: 'A crew of five: commander, driver, navigator, flight engineer and antenna operator.' } },
  { q: { ru: 'Почему «Луноход-1» полезен учёным до сих пор?', en: 'Why is Lunokhod 1 still useful to scientists?' },
    a: [{ ru: 'Его батареи всё ещё работают', en: 'Its batteries still work' }, { ru: 'На нём стоит отражатель, который возвращает лазерный луч', en: 'It carries a reflector that bounces laser light back' }, { ru: 'Он передаёт прогноз погоды', en: 'It sends weather reports' }], ok: 1,
    why: { ru: 'Уголковому отражателю не нужна энергия. По нему измеряют расстояние до Луны.', en: 'A corner reflector needs no power. Scientists use it to measure the distance to the Moon.' } },
  { q: { ru: 'Opportunity рассчитывали на 90 марсианских суток. Сколько он проработал?', en: 'Opportunity was built for 90 Martian days. How long did it work?' },
    a: [{ ru: '180 суток', en: '180 days' }, { ru: 'Около 1000 суток', en: 'About 1,000 days' }, { ru: 'Больше 5000 суток', en: 'More than 5,000 days' }], ok: 2,
    why: { ru: '5111 марсианских суток — больше чем в 50 раз дольше плана.', en: '5,111 Martian days: over 50 times longer than planned.' } },
  { q: { ru: 'Что такое марсианская «черника»?', en: 'What are Martian “blueberries”?' },
    a: [{ ru: 'Ягоды, выросшие в марсианском грунте', en: 'Berries grown in Martian soil' }, { ru: 'Шарики минерала гематита, которые образуются в воде', en: 'Beads of the mineral hematite, which form in water' }, { ru: 'Кусочки льда', en: 'Bits of ice' }], ok: 1,
    why: { ru: 'Серые шарики гематита — одно из доказательств того, что на Марсе была вода.', en: 'Grey hematite beads are part of the proof that Mars once had water.' } },
  { q: { ru: 'Почему марсоходом нельзя управлять «вживую», как игрушечной машинкой?', en: 'Why can’t a Mars rover be driven live, like a toy car?' },
    a: [{ ru: 'На Марсе не работает радио', en: 'Radio doesn’t work on Mars' }, { ru: 'Сигнал идёт до Марса от 3 до 22 минут', en: 'A signal takes 3 to 22 minutes to reach Mars' }, { ru: 'Марсоход слишком быстро ездит', en: 'The rover drives too fast' }], ok: 1,
    why: { ru: 'Пока команда долетит, всё успеет измениться. Поэтому марсоходы получают план на день.', en: 'By the time a command arrives, things have changed. So rovers get a plan for the day.' } },
  { q: { ru: 'Кто в октябре 2026 года побил рекорд дальности Opportunity?', en: 'Who beat Opportunity’s distance record in October 2026?' },
    a: [{ ru: 'Луноход-2', en: 'Lunokhod 2' }, { ru: 'Curiosity', en: 'Curiosity' }, { ru: 'Perseverance', en: 'Perseverance' }], ok: 2,
    why: { ru: '11 октября 2026 года счётчик пути Perseverance показал 45,22 км.', en: 'On 11 October 2026 Perseverance’s odometer reached 45.22 km.' } },
];

QUIZ.forEach((item, i) => { const k = QUIZ_KK[i]; item.q.kk = k.q; item.a.forEach((a, j) => { a.kk = k.a[j]; }); item.why.kk = k.why; });
const QUIZ_POOL = [...QUIZ, ...QUIZ_EXTRA];   // все вопросы; на экран попадают QUIZ_SIZE случайных
const QUIZ_SIZE = 6;
const shuffled = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let quizDeck = [], quizSet = [];
function drawQuiz() {   // следующий набор: вопросы не повторяются, пока не пройден весь пул
  const current = new Set(quizSet.map(x => x.item));
  if (quizDeck.length < QUIZ_SIZE) quizDeck = [...quizDeck, ...shuffled(QUIZ_POOL.filter(q => !current.has(q) && !quizDeck.includes(q)))];
  quizSet = quizDeck.splice(0, QUIZ_SIZE).map(item => { const order = shuffled([0, 1, 2]); return { item, order, ok: order.indexOf(item.ok) }; });
}
drawQuiz();

/* =====================================================================================
   4. ТЕКСТЫ
   Русский текст страницы написан прямо в HTML. Здесь — его английская версия (ключ совпадает
   с атрибутом data-i18n) и короткие строки интерфейса на обоих языках (STR).
   ===================================================================================== */
const EN = {
  'skip': 'Skip to content',
  'brand': 'Vestige',
  'nav.label': 'Sections', 'nav.intro': 'Start', 'nav.moon': 'Moon', 'nav.mars': 'Mars', 'nav.finale': 'Wrap-up',
  'lang.label': 'Language',

  'intro.title': 'Vestige',
  'intro.lede': 'Machines that fell silent long ago still stand on the Moon and Mars. Some of them are still helping scientists. Scroll down and let them tell you their own stories.',
  'intro.meta': 'Two chapters, 15 places on the map and a quiz: about 10 minutes. The Moon and Mars are shown to the same scale; Mars is almost twice as wide.',
  'intro.cue': 'Scroll down',

  'moon.h': 'Chapter one. The Moon',
  'm1.title': 'Lunokhod 1',
  'm1.sub': 'The first wheeled robot to drive on another world',
  'm1.voice': 'My name is Lunokhod 1. I have been silent since 1971: my batteries died long ago. But shine a laser at me from Earth and I will send the beam straight back. That is how I still work today.',
  'm1.cite': 'What Lunokhod 1 might say',
  'bp.l.title': 'Side-view diagram of Lunokhod 1: a tub-shaped body on eight wheels, an open lid lined with solar cells, an antenna, TV cameras, a reflector and a ninth measuring wheel.',
  'bp.l.lid': 'lid with solar cells', 'bp.l.antenna': 'antenna', 'bp.l.reflector': 'reflector', 'bp.l.cameras': 'TV cameras', 'bp.l.ninth': 'ninth wheel: counts distance',
  'm1.photoAlt': 'Lunokhod 1',
  'm1.caption': 'Diagram of Lunokhod 1. 4.42 m long with the lid folded back, 756 kg.',
  'm1.p1': 'On 17 November 1970 the Soviet lander Luna 17 touched down in the Sea of Rains. It lowered its ramps, and an eight-wheeled machine shaped like a big lidded pot rolled onto the lunar dust. Nobody was inside: its drivers sat on Earth, in Crimea, 384,000 kilometres away.',
  'm1.p2': 'Lunokhods were first designed to help cosmonauts: to scout a landing site and act as a radio beacon. Soviet cosmonauts never flew to the Moon, so the scout became an explorer.',
  'm1.p3': 'It was built to last three lunar days, about three months. It worked for eleven: it drove 10.5 kilometres, sent back more than 20,000 pictures and 206 panoramas, tested the soil’s chemistry 25 times and its strength about 500 times.',
  'f.launch': 'Launch', 'f.landing': 'Landing', 'f.mass': 'Mass', 'f.dist': 'Distance driven', 'f.life': 'Worked for', 'f.now': 'Today',
  'm1.f.launch': '10 November 1970, Baikonur', 'm1.f.landing': '17 November 1970, Sea of Rains', 'm1.f.mass': '756 kg', 'm1.f.dist': '10,540 m',
  'm1.f.life': '11 lunar days instead of 3: November 1970 to September 1971',
  'm1.f.now': 'Silent since 14 September 1971. Its reflector still works.',

  'm2.title': 'How to drive a car on the Moon',
  'm2.p1': 'Lunokhod was driven by a crew of five: a commander, a driver, a navigator, a flight engineer and an antenna operator. They sat at their screens in a space communications centre near Simferopol.',
  'm2.p2': 'It was hard work. The cameras sent single frames, not video: one every few seconds. On top of that, a radio signal takes about 2.6 seconds to reach the Moon and come back. The driver saw where the rover had been, not where it was, and had to think ahead every time.',
  'm2.p3': 'A lunar day lasts two Earth weeks, and so does the night. By day the rover opened its lid, whose inner side was a solar panel. At night the lid closed and a small piece of radioactive polonium kept the instruments warm. Outside it was about −150 °C.',

  'm3.title': 'What the rover could do, and what we learned',
  'm3.intro': 'On the left, a part of the machine. On the right, what it helped us find out.',
  'm3.a.part': 'A ninth wheel and a probe',
  'm3.a.partText': 'A small unpowered wheel trailed behind and counted the distance: driven wheels slip in the dust, but it did not. A probe pushed into the ground to test how firm it was.',
  'm3.a.find': 'You can drive on Moon dust',
  'm3.a.findText': 'By comparing wheel turns with hundreds of probe jabs, engineers learned how strong the lunar surface is.',
  'm3.b.part': 'The RIFMA X-ray instrument',
  'm3.b.partText': 'It bathed the soil in X-rays and read the glow that came back to find which chemical elements were there.',
  'm3.b.find': 'A lunar “sea” is frozen lava',
  'm3.b.findText': '25 measurements showed basalt, a volcanic rock. The dark patches on the Moon were once lava.',
  'm3.c.part': 'A solar lid and an isotope heater',
  'm3.c.partText': 'By day, charge the batteries. At night, close up and stay warm on the heat of decaying polonium.',
  'm3.c.find': 'A machine can survive the lunar night',
  'm3.c.findText': 'Eleven nights, two weeks each, at −150 °C. Similar heaters later flew on the Mars rovers Spirit and Opportunity.',
  'm3.note': 'By its own instruments the rover drove 10,540 metres. In 2013 the route was re-measured from wheel tracks seen from orbit and came out at about 9.9 km. Measuring distance on another world is not easy.',

  'm4.title': 'Lost for forty years',
  'm4.p1': 'On the rover’s front sits a French-made corner reflector, a block of glass prisms. It works like the reflector on a bicycle, sending light straight back to where it came from. It needs no electricity.',
  'm4.p2': 'In the first months, lasers on Earth reached it a few times. Then contact with the rover was lost, and nobody knew exactly where it had stopped. For almost forty years the laser beams found nothing.',
  'm4.p3': 'In March 2010 a NASA orbiter called LRO photographed the area in such detail that the landing platform, the rover and its tracks all showed up. On 22 April physicist Tom Murphy aimed a laser at the new coordinates and caught about 2,000 particles of light on the first try. Earlier searches had been aimed several kilometres away.',
  'm4.p4': 'The reflector turned out to be in excellent shape. Lunokhod 1 is back at work: with it and other reflectors, scientists measure the distance to the Moon to within millimetres, test Einstein’s theory and study the Moon’s liquid core. That is how we know the Moon drifts 3.8 centimetres farther from Earth every year.',

  'm5.title': 'Who else is still on the Moon',
  'm5.p': 'Six places to start with. Tap a name, or a glowing dot on the Moon.',
  'legend.silent': 'silent', 'legend.passive': 'still useful to science', 'legend.active': 'working',
  'm5.note': 'The hardware models on the planets are enlarged tens to hundreds of thousands of times; otherwise you could not see them. You can spin a planet with the mouse or a finger.',

  'mars.h': 'Chapter two. Mars',
  'r1.title': 'Opportunity',
  'r1.sub': 'The rover that came for three months and stayed for fourteen years',
  'r1.voice': 'My name is Opportunity. Friends call me Oppy. I was promised 90 Martian days of work. I lasted 5,111 and drove farther than a marathon, until dust hid the sky over the whole planet.',
  'r1.cite': 'What Opportunity might say',
  'bp.o.title': 'Side-view diagram of the Opportunity rover: six wheels on a flexible suspension, a flat deck of solar panels, a camera mast, an antenna and an arm with tools.',
  'bp.o.mast': 'camera mast', 'bp.o.panels': 'solar panels', 'bp.o.antenna': 'antenna', 'bp.o.arm': 'arm with tools', 'bp.o.susp': 'flexible suspension',
  'r1.photoAlt': 'Opportunity',
  'r1.caption': 'Diagram of Opportunity. The size of a golf cart: 1.6 metres long, 185 kg.',
  'r1.p1': 'On 25 January 2004 a cluster of airbags hit the plain of Meridiani and bounced along. Inside was a rover. The cluster rolled into the small Eagle crater and stopped right there; scientists called it a hole in one.',
  'r1.p2': 'It was sent to look for traces of water. From orbit, a satellite had spotted hematite here, a mineral that usually forms in water. Someone had to go and check on the ground.',
  'r1.p3': 'The plan: 90 days and one kilometre of driving. The reality: more than fourteen years and 45 kilometres.',
  'r1.f.launch': '8 July 2003, Cape Canaveral', 'r1.f.landing': '25 January 2004, Meridiani Planum', 'r1.f.mass': '185 kg', 'r1.f.dist': '45.16 km',
  'r1.f.life': '5,111 sols instead of 90: January 2004 to June 2018',
  'r1.f.now': 'Silent since 10 June 2018. Mission declared over on 13 February 2019.',
  'r1.foot': 'A sol is a Martian day: 24 hours 39 minutes. Dates are in Universal Time (UTC); in the US it was still the evening before.',

  'r2.title': 'How to steer a robot hundreds of millions of kilometres away',
  'r2.p1': 'A radio signal reaches the Moon in just over a second. Reaching Mars takes 3 to 22 minutes, depending on where the planets are in their orbits. Live steering is impossible: by the time a “stop” command arrives, the rover is already in the ditch.',
  'r2.p2': 'So Opportunity worked from a daily plan. Each morning a list of tasks arrived. People mapped the route in advance, using the rover’s own photos. On unfamiliar ground the rover looked for rocks itself and steered around them. In the evening it sent a report and slept until morning to save power.',
  'sig.title': 'Try it yourself',
  'sig.moon': 'Earth → Moon, 384,400 km', 'sig.moonTime': '1.3 s', 'sig.mars': 'Earth → Mars', 'sig.dist': 'Distance to Mars',
  'sig.send': 'Send the command “Forward”',
  'sig.speed': 'The signal to the Moon is shown in real time; the one to Mars is sped up 120 times.',

  'r3.title': 'What Opportunity could do, and what we learned',
  'r3.intro': 'On the left, a part of the machine. On the right, what it helped us find out.',
  'r3.a.part': 'A grinder and a microscope',
  'r3.a.partText': 'On the rover’s arm are a grinding tool that strips the top layer off a rock and a microscope to study what is underneath.',
  'r3.a.find': 'There was water here',
  'r3.a.findText': 'The rock was full of grey beads a few millimetres across, nicknamed “blueberries”. They are hematite: beads like these grow inside rock soaked with water.',
  'r3.b.part': 'The Mössbauer spectrometer',
  'r3.b.partText': 'An instrument that fits in the palm of a hand and identifies minerals containing iron.',
  'r3.b.find': 'The water was acidic',
  'r3.b.findText': 'It found jarosite, a mineral that only forms in acidic water. Ancient Mars was wet, but not welcoming.',
  'r3.c.part': 'Six wheels and patience',
  'r3.c.partText': 'Over three years the rover drove 21 kilometres to the huge Endeavour crater, which is 22 kilometres wide.',
  'r3.c.find': 'And here the water was fit for life',
  'r3.c.findText': 'At the crater’s rim it found veins of gypsum and clay minerals. They form in calm, non-acidic water: the friendliest for microbes of anything Opportunity saw.',
  'r3.d.part': 'Solar panels',
  'r3.d.partText': 'Engineers expected dust to bury the panels within months and cut off the power.',
  'r3.d.find': 'Mars cleaned the rover itself',
  'r3.d.findText': 'Gusts of wind blew the dust off again and again. Nobody planned for it, and it gave the mission years.',

  'r4.title': 'The last storm',
  'r4.p1': 'In June 2018 a dust storm wrapped the whole of Mars. The sky above Opportunity grew so dark that its panels stopped making power. On 10 June it called home for the last time.',
  'r4.p2': 'Engineers sent it the wake-up command more than a thousand times. On 13 February 2019 NASA announced that the mission was over. The rover stands on the slope of a valley named Perseverance.',
  'r4.p3': 'Opportunity held the distance record for twelve years, starting in 2014, when it overtook Lunokhod 2. Then on 11 October 2026 a rover with the same name as the valley drove past its 45.16 kilometres: Perseverance.',

  'r5.title': 'Who else is still on Mars',
  'r5.p': 'Nine places: seven machines are silent, two are at work right now. Tap a name, or a dot on Mars.',

  'fin.title': 'They are still out there',
  'fin.lede': 'Look at the Moon tonight. Somewhere in the Sea of Rains, Lunokhod 1 is waiting for the next laser flash.',

  'f1.title': 'A relay half a century long',
  'f1.p': 'The distance record on another world has changed hands again and again, between machines and between countries.',
  'f1.chartTitle': 'Distance driven on the Moon and Mars, km', 'f1.legMoon': 'Moon', 'f1.legMars': 'Mars',
  'f1.p2': 'People drove Lunokhod almost live. Opportunity picked its own path for only about 5% of the way. Perseverance does it for more than 90%.',
  'f1.stamp': 'NASA figures as of 11 October 2026. The distance for Lunokhod 2 was refined from LRO orbiter images.',

  'f2.title': 'Test yourself',
  'f2.p': 'Six questions. All the answers were in the story.',
  'f2.again': 'New questions',

  'f3.title': 'And farther still',
  'f3.p': 'Machines from Earth were left on more than the Moon and Mars.',
  'f3.a.h': 'Venus', 'f3.a.who': 'Venera 13, USSR, 1982',
  'f3.a.t': 'It worked on the surface for 127 minutes and sent the first colour panoramas. It is about 460 °C there, and the pressure is like being almost a kilometre deep in the ocean.',
  'f3.b.h': 'Titan', 'f3.b.who': 'Huygens, Europe, 2005',
  'f3.b.t': 'The only landing ever made in the outer Solar System. The probe parachuted down for two and a half hours and kept sending data from the surface of Saturn’s moon for another 72 minutes.',
  'f3.c.h': 'Comet 67P', 'f3.c.who': 'Philae, Europe, 2014',
  'f3.c.t': 'The first landing on a comet. The lander bounced twice, ended up in shadow and worked for about 64 hours until its batteries ran down.',

  'f4.title': 'About this project',
  'f4.who.h': 'Who it is for', 'f4.who.t': 'Students aged 10 and up, and anyone curious about space.',
  'f4.how.h': 'How to use it', 'f4.how.t': 'Scroll and the planets turn by themselves. You can tap the dots and spin a planet. At the top are the language switch and a pause for the rotation. Everything shown in 3D is also in the text.',
  'f4.honest.h': 'What is simplified', 'f4.honest.t': 'The hardware models are hugely enlarged. The real Moon always keeps one face toward Earth; here it spins so you can see every site. The machines’ “voices” are invented; the facts are real.',
  'f4.acc.h': 'Accuracy', 'f4.acc.t': 'Dates and figures were checked against NASA and other sources in November 2026. Some numbers get refined over time, such as how far the Lunokhods drove.',
  'f4.src.h': 'Sources',
  'src.1': 'NASA NSSDCA: Luna 17 and Lunokhod 1',
  'src.2': 'LROC: Lunokhod 1 seen from orbit',
  'src.3': 'Murphy et al., 2010: laser ranging to the lost reflector',
  'src.4': 'NASA JPL: the Apollo experiment that keeps on giving',
  'src.5': 'NASA Science: Surveyor 3 and Apollo 12',
  'src.6': 'Nature, 2013: how far the Lunokhods really drove',
  'src.7': 'NASA JPL, 2019: Opportunity’s mission comes to an end',
  'src.8': 'NASA Science: six things to know about Opportunity',
  'src.9': 'NASA JPL, 2014: Opportunity passes Lunokhod 2',
  'src.10': 'NASA JPL, 2026: Perseverance sets the record',
  'src.11': 'NASA Science: the Spirit rover',
  'src.12': 'NASA Science: Viking 1',
  'src.13': 'NASA JPL: what InSight learned about the inside of Mars',
  'src.14': 'ESA via phys.org: ten years since Huygens landed on Titan',
  'f4.credits': '3D models of the Moon and Mars: NASA. Typefaces: Tektur and Geologica. Built with Three.js and Tailwind CSS.',
};

const STR = {
  ru: {
    title: 'Vestige — машины, которые человечество оставило на Луне и Марсе',
    quizPool: 'Каждый раз выбираются 6 случайных вопросов из {n}. Нажмите «Новые вопросы», чтобы получить другой набор.',
    noVoice: 'На этом устройстве нет голоса для русского языка, поэтому текст не читается чужим голосом. Голос можно добавить в настройках речи системы.',
    listen: 'Слушать', stop: 'Стоп', science: 'Что это дало науке.', prev: 'Назад', next: 'Дальше', close: 'Закрыть',
    silent: 'Молчит', passive: 'Молчит, но ещё служит науке', active: 'Работает',
    count: '{i} из {n}', N: 'с. ш.', S: 'ю. ш.', E: 'в. д.', W: 'з. д.',
    hint: 'Нажмите на точку. Планету можно повернуть.',
    load: 'Загружаю 3D-модели планет… {p}%', loadPlain: 'Загружаю 3D-модели планет…',
    loadFail: 'Файлы 3D-моделей не найдены — планеты нарисованы схематично.',
    loadFile: 'Страница открыта как файл, поэтому браузер не загрузил 3D-модели. Откройте её через веб-сервер.',
    pause: 'Остановить вращение планет', play: 'Запустить вращение планет',
    min: 'мин', s: 'с', mkm: 'млн км',
    flying: 'Сигнал летит…', moonDone: 'Луноход получил команду через 1,3 секунды.', marsDone: 'Марсоход получил её через {t}. Ответ будет идти столько же.',
    right: 'Верно.', wrong: 'Не совсем.', qn: 'Вопрос {i} из {n}',
    best: 'Шесть из шести. Центр управления вами гордится.', good: '{n} из 6. Отличная работа.', low: '{n} из 6. Ответы есть в рассказе — можно пролистать ещё раз.',
    marathon: 'марафон: 42,2 км', colWho: 'Аппарат', colBar: 'Путь', colKm: 'км', km: 'км',
    isRight: 'верный ответ', isYours: 'ваш ответ',
  },
  en: {
    title: 'Vestige — the machines humanity left on the Moon and Mars',
    quizPool: 'Each round picks 6 random questions out of {n}. Press “New questions” for another set.',
    noVoice: 'This device has no English voice, so the text is not read in another language’s voice. You can add a voice in your system’s speech settings.',
    listen: 'Listen', stop: 'Stop', science: 'What science gained.', prev: 'Back', next: 'Next', close: 'Close',
    silent: 'Silent', passive: 'Silent, but still useful to science', active: 'Working',
    count: '{i} of {n}', N: 'N', S: 'S', E: 'E', W: 'W',
    hint: 'Tap a dot. You can spin the planet.',
    load: 'Loading 3D planet models… {p}%', loadPlain: 'Loading 3D planet models…',
    loadFail: '3D model files were not found, so the planets are drawn as sketches.',
    loadFile: 'This page was opened as a file, so the browser did not load the 3D models. Open it through a web server.',
    pause: 'Pause planet rotation', play: 'Resume planet rotation',
    min: 'min', s: 's', mkm: 'million km',
    flying: 'Signal on its way…', moonDone: 'The lunar rover got the command after 1.3 seconds.', marsDone: 'The Mars rover got it after {t}. The reply will take just as long.',
    right: 'Correct.', wrong: 'Not quite.', qn: 'Question {i} of {n}',
    best: 'Six out of six. Mission control is proud of you.', good: '{n} out of 6. Great work.', low: '{n} out of 6. The answers are in the story; you can scroll through it again.',
    marathon: 'marathon: 42.2 km', colWho: 'Vehicle', colBar: 'Distance', colKm: 'km', km: 'km',
    isRight: 'correct answer', isYours: 'your answer',
  },
};
STR.kk = STR_KK;              // казахская версия коротких строк (раздел переводов)
Object.assign(EN, EN_PATCH);  // английские строки, которые изменились вместе с новыми разделами

/* =====================================================================================
   5. ИНТЕРФЕЙС
   ===================================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const damp = (cur, target, k, dt) => lerp(cur, target, 1 - Math.exp(-k * dt));
const wrapPi = a => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };
const DEG = Math.PI / 180;
const prng = seed => () => { seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };   // повторяемые «случайные» числа

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const state = {
  explore: null,              // 'moon' | 'mars' — открыт каталог планеты; null — рассказ или выбор планеты
  lang: 'en',
  motion: !reducedMotion.matches,   // вращаются ли планеты сами
  selected: null,                   // выбранная точка
  world: 'none',                    // какая планета сейчас крупным планом: moon | mars | none
  quiz: Array(QUIZ_SIZE).fill(null),
  photos: {},
  hinted: false,
};
let stage = null;                   // 3D-сцена; появится, когда загрузится three.js
const ac = new AbortController();   // одним вызовом ac.abort() снимаем все обработчики событий
const on = (target, type, fn, opts = {}) => target.addEventListener(type, fn, { signal: ac.signal, ...opts });

const LANGS = ['en', 'ru', 'kk'];                     // английский — по умолчанию, русский, казахский
const LOCALE = { en: 'en-US', ru: 'ru-RU', kk: 'kk-KZ' };
const t = (key, vars = {}) => (STR[state.lang][key] ?? STR.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const L = obj => obj[state.lang] ?? obj.en ?? obj.ru;
const num = (n, digits = 0) => n.toLocaleString(LOCALE[state.lang], { minimumFractionDigits: digits, maximumFractionDigits: digits });
const langHooks = [];                                  // сюда другие разделы добавляют свою перерисовку при смене языка

/* ---------- Язык ---------- */
const RU = {};   // русские тексты запоминаем из HTML при запуске
function initLang() {
  $$('[data-i18n]').forEach(el => { RU[el.dataset.i18n] ??= el.innerHTML; });
  $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => { const [attr, key] = pair.split(':'); RU[key] ??= el.getAttribute(attr); }));
  let lang = new URLSearchParams(location.search).get('lang');
  try { lang ||= localStorage.getItem('forgotten-lang'); } catch { /* хранилище недоступно — не страшно */ }
  if (!LANGS.includes(lang)) lang = 'en';              // пока посетитель не выбрал язык — английский
  $$('[data-lang]').forEach(b => on(b, 'click', () => setLang(b.dataset.lang, true)));
  setLang(lang, false);
}
function setLang(lang, remember) {
  state.lang = lang;
  if (remember) { try { localStorage.setItem('forgotten-lang', lang); } catch { /* не страшно */ } }
  const text = key => dictFor(lang)[key] ?? EN[key];   // если перевода нет — английский текст
  document.documentElement.lang = lang;
  document.title = t('title');
  $$('[data-i18n]').forEach(el => { const v = text(el.dataset.i18n); if (v !== undefined) el.innerHTML = v; });
  $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => { const [attr, key] = pair.split(':'); const v = text(key); if (v !== undefined) el.setAttribute(attr, v); }));
  $$('[data-str]').forEach(el => { el.textContent = t(el.dataset.str); });
  $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $('#dossier-close').setAttribute('aria-label', t('close'));
  $('#hint').textContent = t('hint');
  stopSpeech();
  renderChips(); renderRelay(); renderQuiz(); renderDossier(); updateSignalText(); applyCaptions(); updateMotionButton();
  stage?.relabel();
  langHooks.forEach(fn => fn(lang));
}
const dictFor = lang => lang === 'en' ? EN : lang === 'kk' ? KK : RU;

/* ---------- Прокрутка: в какой секции мы находимся ---------- */
const sections = $$('main > section');
let tops = [0, 1e9, 2e9, 3e9], viewH = window.innerHeight;
const layout = { wide: true, pad: 64, colW: 528, free: 600 };
function measure() {
  viewH = window.innerHeight;
  // Раскладка: если сбоку от колонки с карточками хватает места — планета стоит рядом, иначе — сверху
  const w = document.documentElement.clientWidth, section = $('#moon'), column = $('#moon > div');
  layout.pad = parseFloat(getComputedStyle(section).paddingLeft) || 16;
  layout.colW = Math.min(column.offsetWidth, w - layout.pad * 2);
  layout.free = w - (layout.pad + layout.colW) - 28;
  layout.wide = w / viewH >= 0.9 && layout.free >= 320;
  document.body.dataset.layout = layout.wide ? 'wide' : 'tall';
  tops = sections.map(s => s.getBoundingClientRect().top + window.scrollY);
}
// Параметр сцены: 0 — интро, 1 — Луна, 2 — Марс, 3 — итоги; дробные значения — переход между секциями
function sceneParam(y) {
  let p = 0;
  for (let i = 1; i < tops.length; i++) p += smooth(clamp((y - (tops[i] - viewH * 0.95)) / (viewH * 0.65), 0, 1));
  return p;
}
const ACCENTS = [[236, 234, 228], [169, 207, 255], [242, 166, 94], [236, 234, 228]];   // интро, Луна, Марс, итоги
let lastAccent = '', scrollQueued = false;
function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    if (state.explore) return;                  // в каталоге планеты сценой управляет он, а не прокрутка
    const p = sceneParam(window.scrollY), i = Math.min(2, Math.floor(p)), f = p - i;
    const c = ACCENTS[i].map((v, k) => Math.round(lerp(v, ACCENTS[i + 1][k], f)));
    const accent = `rgb(${c[0]} ${c[1]} ${c[2]})`;
    if (accent !== lastAccent) { document.documentElement.style.setProperty('--accent', accent); lastAccent = accent; }
    const idx = Math.round(p);
    $$('[data-nav]').forEach(a => a.setAttribute('aria-current', String(Number(a.dataset.nav) === idx)));
    setWorld(idx === 1 ? 'moon' : idx === 2 ? 'mars' : 'none');
  });
}
function setWorld(world) {
  if (world === state.world) return;
  state.world = world;
  document.body.dataset.world = world;
  if (state.selected && SITE[state.selected].world !== world) closeDossier(false);
  $('#hint').style.opacity = world !== 'none' && !state.hinted && !document.documentElement.classList.contains('no-webgl') ? '1' : '0';
}
function markHinted() { state.hinted = true; $('#hint').style.opacity = '0'; }

/* ---------- Список точек и досье ---------- */
function renderChips() {
  $$('[data-sites]').forEach(box => {
    box.replaceChildren(...SITES.filter(s => s.world === box.dataset.sites && !s.explore).map(s => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.dataset.site = s.id;
      b.setAttribute('aria-pressed', String(state.selected === s.id));
      const g = document.createElement('i'); g.className = 'glyph'; g.dataset.status = s.status;
      const name = document.createElement('span'); name.textContent = L(s.name);
      b.append(g, name);
      on(b, 'click', () => {
        openDossier(s.id, { focus: true, opener: b });
        // на узком экране карточка закрывает планету — сдвигаем её вниз, чтобы точку было видно
        if (matchMedia('(max-width: 63.99rem)').matches) b.closest('.plate').scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
      return b;
    }));
  });
}
function coords(s) {
  const la = `${num(Math.abs(s.lat), 1)}° ${t(s.lat >= 0 ? 'N' : 'S')}`, lo = `${num(Math.abs(s.lon), 1)}° ${t(s.lon >= 0 ? 'E' : 'W')}`;
  return `${la}, ${lo}`;
}
let dossierOpener = null;
function renderDossier() {
  const s = SITE[state.selected]; if (!s) return;
  const list = SITES.filter(x => x.world === s.world && !x.explore);
  $('#dossier-who').textContent = L(s.who);
  $('#dossier-name').textContent = L(s.name);
  $('#dossier-glyph').dataset.status = s.status;
  $('#dossier-status').textContent = t(s.status);
  $('#dossier-text').textContent = L(s.text);
  $('#dossier-science').textContent = L(s.science);
  $('#dossier-place').textContent = `${L(s.place)[0].toUpperCase()}${L(s.place).slice(1)}. ${coords(s)}`;
  $('#dossier-count').textContent = t('count', { i: list.indexOf(s) + 1, n: list.length });
  const m = MISSION_OF_SITE[s.id], link = $('#dossier-page'), refs = $('#dossier-refs');
  link.hidden = !m;
  if (m) link.href = `#/missions/${m.id}`;
  // источники к тексту досье: место и главный научный результат
  const ids = m ? [...new Set([...(m.art?.[1] || []), ...(m.imp?.sci?.[1] || [])])].slice(0, 4) : [];
  refs.dataset.refs = ids.join(',');
  refs.innerHTML = ids.length && typeof citeHTML === 'function' ? citeHTML(ids, 'icon') : '';
}
function openDossier(id, { focus = false, opener = null } = {}) {
  if (!SITE[id]) return;
  state.selected = id;
  if (opener) dossierOpener = opener;
  renderDossier();
  const panel = $('#dossier');
  panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false');
  $$('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.site === id)));
  stage?.select(id);
  markHinted();
  if (focus) $('#dossier-name').focus({ preventScroll: true });
}
function closeDossier(returnFocus = true) {
  const panel = $('#dossier');
  if (!panel.classList.contains('open')) return;
  panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true');
  state.selected = null;
  $$('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
  stage?.select(null);
  if (returnFocus && dossierOpener?.isConnected) dossierOpener.focus({ preventScroll: true });
  dossierOpener = null;
  setTimeout(() => { if (!state.selected) $$('#dossier-who, #dossier-name, #dossier-status, #dossier-text, #dossier-science, #dossier-place, #dossier-count').forEach(el => { el.textContent = ''; }); }, 320);   // панель уехала — убираем старый текст
}
function stepDossier(dir) {
  const s = SITE[state.selected]; if (!s) return;
  const list = SITES.filter(x => x.world === s.world);
  openDossier(list[(list.indexOf(s) + dir + list.length) % list.length].id);
}
function initDossier() {
  on($('#dossier-close'), 'click', () => closeDossier(true));
  on($('#dossier-prev'), 'click', () => stepDossier(-1));
  on($('#dossier-next'), 'click', () => stepDossier(1));
  on(document, 'keydown', e => { if (e.key === 'Escape' && state.selected) closeDossier(true); });
}

/* ---------- Диаграмма «эстафета» (это настоящая таблица: её читают и программы экранного доступа) ---------- */
function renderRelay() {
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const table = el('table', 'relay');
  const head = el('tr');
  const hWho = el('th', 'who text-[0.8125rem] text-dim', t('colWho')); hWho.scope = 'col';
  const hBar = el('th', 'text-[0.8125rem] text-dim'); hBar.scope = 'col';
  const axis = el('div', 'relative h-5');
  const mark = el('span', 'absolute bottom-0 whitespace-nowrap pr-1.5 text-right', t('marathon'));
  mark.style.right = `${100 - (MARATHON / RELAY_MAX) * 100}%`;
  const sr = el('span', 'sr-only-live', t('colBar'));
  axis.append(sr, mark); hBar.append(axis);
  const hKm = el('th', 'val text-[0.8125rem] font-normal text-dim', t('colKm')); hKm.scope = 'col';
  head.append(hWho, hBar, hKm);
  const thead = el('thead'); thead.append(head);
  const body = el('tbody');
  for (const r of RELAY) {
    const tr = el('tr');
    const who = el('th', 'who'); who.scope = 'row';
    who.append(el('b', '', L(r.name)), el('span', '', L(r.meta)));
    const cell = el('td');
    const track = el('div', 'track');
    const line = el('i', 'absolute -bottom-[0.625rem] -top-[0.625rem] w-px bg-line'); line.style.left = `${(MARATHON / RELAY_MAX) * 100}%`;
    const bar = el('div', 'bar'); bar.dataset.world = r.world; bar.style.width = `${(r.km / RELAY_MAX) * 100}%`;
    bar.title = `${L(r.name)}: ${num(r.km, r.digits)} ${t('km')}`;
    track.append(line, bar); cell.append(track);
    tr.append(who, cell, el('td', 'val', num(r.km, r.digits)));
    body.append(tr);
  }
  table.setAttribute('aria-label', dictFor(state.lang)['f1.chartTitle'] || EN['f1.chartTitle'] || '');
  table.append(thead, body);
  $('#relay').replaceChildren(table);
}

/* ---------- Викторина ---------- */
function renderQuiz() {
  if (!$('#quiz')) return;   // викторина теперь на отдельной странице (#/quiz)
  const lede = $('#quiz-lede'); if (lede) lede.textContent = t('quizPool', { n: QUIZ_POOL.length });
  $('#quiz').replaceChildren(...quizSet.map((set, qi) => {
    const fs = document.createElement('fieldset');
    const lg = document.createElement('legend'); lg.className = 'mb-3 w-full';
    const n = document.createElement('span'); n.className = 'block text-[0.8125rem] text-dim'; n.textContent = t('qn', { i: qi + 1, n: quizSet.length });
    const q = document.createElement('span'); q.className = 'mt-1 block font-display text-[1.125rem] font-semibold leading-[1.3]'; q.textContent = L(set.item.q);
    lg.append(n, q);
    const opts = document.createElement('div'); opts.className = 'grid gap-2';
    set.order.forEach((src, ai) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'opt';
      const m = document.createElement('span'); m.className = 'mark'; m.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span'); label.textContent = L(set.item.a[src]);
      const note = document.createElement('span'); note.className = 'sr';     // пояснение для программ экранного доступа
      b.append(m, label, note);
      on(b, 'click', () => { if (state.quiz[qi] === null) { state.quiz[qi] = ai; paintQuiz(); } });
      opts.append(b);
    });
    const why = document.createElement('p'); why.className = 'why mt-3 min-h-[1.5em] text-[0.9375rem] leading-[1.5]'; why.setAttribute('role', 'status'); why.setAttribute('aria-live', 'polite');
    fs.append(lg, opts, why);
    return fs;
  }));
  paintQuiz();
}
// Отмечает выбранные ответы и показывает объяснения (кнопки остаются на месте — фокус клавиатуры не теряется)
function paintQuiz() {
  if (!$('#quiz')) return;
  $$('#quiz fieldset').forEach((fs, qi) => {
    const set = quizSet[qi], chosen = state.quiz[qi], why = fs.querySelector('.why');
    fs.querySelectorAll('.opt').forEach((b, ai) => {
      const m = b.querySelector('.mark');
      b.classList.toggle('right', chosen !== null && ai === set.ok);
      b.classList.toggle('wrong', chosen !== null && ai === chosen && ai !== set.ok);
      m.textContent = chosen === null ? '' : ai === set.ok ? '✓' : ai === chosen ? '×' : '';
      b.querySelector('.sr').textContent = chosen === null ? '' : [ai === chosen ? t('isYours') : '', ai === set.ok ? t('isRight') : ''].filter(Boolean).map(x => ` (${x})`).join('');
      if (chosen === null) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true');
    });
    const text = chosen === null ? '' : `${t(chosen === set.ok ? 'right' : 'wrong')} ${L(set.item.why)}`;
    if (why.dataset.text !== text) {
      why.dataset.text = text; why.textContent = text;
      if (text && set.item.ref) why.insertAdjacentHTML('beforeend', ` <span class="cites">${citeHTML([set.item.ref])}</span>`);   // источник ответа
    }
  });
  const done = state.quiz.every(v => v !== null);
  $('#quiz-result').classList.toggle('hidden', !done);
  const score = state.quiz.filter((v, i) => v === quizSet[i].ok).length;
  $('#quiz-score').textContent = done ? t(score === quizSet.length ? 'best' : score >= 4 ? 'good' : 'low', { n: score }) : '';
}
function initQuiz() { if (!$('#quiz-again')) return; on($('#quiz-again'), 'click', () => { drawQuiz(); state.quiz = Array(QUIZ_SIZE).fill(null); renderQuiz(); $('#quiz .opt')?.focus(); }); }

/* ---------- Опыт: сколько летит сигнал ---------- */
const LIGHT_KM_S = 299792.458, MOON_KM = 384400, MARS_SPEEDUP = 120;
const marsDelay = () => Number($('#sig-dist').value) * 1e6 / LIGHT_KM_S;      // секунды в одну сторону
function delayText(sec) { const m = Math.floor(sec / 60), s = Math.round(sec % 60); return m ? `${m} ${t('min')} ${s} ${t('s')}` : `${s} ${t('s')}`; }
function updateSignalText() {
  $('#sig-dist-val').textContent = `${num(Number($('#sig-dist').value))} ${t('mkm')}`;
  $('#sig-mars-time').textContent = delayText(marsDelay());
}
function initSignal() {
  const btn = $('#sig-send'), out = $('#sig-out');
  const lanes = { moon: $('[data-lane="moon"]'), mars: $('[data-lane="mars"]') };
  let run = 0;
  on($('#sig-dist'), 'input', updateSignalText);
  on(btn, 'click', () => {
    const id = ++run, start = performance.now(), sec = marsDelay();
    const dur = { moon: MOON_KM / LIGHT_KM_S * 1000, mars: sec / MARS_SPEEDUP * 1000 };
    const done = { moon: false, mars: false };
    btn.disabled = true; $('#sig-dist').disabled = true;
    out.textContent = t('flying');
    Object.values(lanes).forEach(l => l.querySelector('.b').classList.remove('hit'));
    const tick = now => {
      if (id !== run) return;
      for (const key of ['moon', 'mars']) {
        const lane = lanes[key], dot = lane.querySelector('.pulse'), k = clamp((now - start) / dur[key], 0, 1);
        dot.style.opacity = k < 1 ? '1' : '0';
        dot.style.transform = `translateX(${k * (lane.clientWidth - 12)}px)`;
        if (k >= 1 && !done[key]) {
          done[key] = true;
          lane.querySelector('.b').classList.add('hit');
          out.textContent = key === 'moon' ? t('moonDone') : `${t('moonDone')} ${t('marsDone', { t: delayText(sec) })}`;
        }
      }
      if (done.moon && done.mars) { btn.disabled = false; $('#sig-dist').disabled = false; return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- Озвучка (встроенный синтезатор речи браузера) ----------
   1) Голос выбирается строго по языку страницы; из нескольких берётся самый качественный
      (в названии «Natural», «Neural», «Online», «Premium» или «Enhanced»).
   2) Если голоса для языка на устройстве нет, текст НЕ читается чужим голосом: показываем,
      как добавить голос (иначе, например, казахский текст прозвучал бы с русским произношением).
   3) Перед чтением текст готовится только для синтезатора: латинские названия миссий
      заменяются чтением, сокращения раскрываются, разделители тысяч убираются. */
const SAY_NAMES = [
  ['Vestige', 'Вестидж'],
  ['Opportunity', 'Оппортьюнити'], ['Curiosity', 'Кьюриосити'], ['Perseverance', 'Пёрсивиранс'], ['InSight', 'Инсайт'], ['Spirit', 'Спирит'],
  ['Phoenix', 'Финикс'], ['Pathfinder', 'Патфайндер'], ['Sojourner', 'Соджорнер'], ['Ingenuity', 'Инджинюити'], ['Odyssey', 'Одиссей'],
  ['Mars Express', 'Марс Экспресс'], ['Reconnaissance Orbiter', 'Реконнэсанс Орбитер'], ['Lunar Reconnaissance Orbiter', 'Лунар Реконнэсанс Орбитер'],
  ['Global Surveyor', 'Глобал Сервейор'], ['Science Laboratory', 'Сайенс Лаборатори'], ['Trace Gas Orbiter', 'Трейс Гэс Орбитер'],
  ['Viking', 'Викинг'], ['Mariner', 'Маринер'], ['Surveyor', 'Сервейер'], ['Ranger', 'Рейнджер'], ['Apollo', 'Аполлон'], ['Artemis', 'Артемида'],
  ['Huygens', 'Гюйгенс'], ['Rosetta', 'Розетта'], ['Philae', 'Филы'], ['Venera', 'Венера'], ['Lunokhod', 'Луноход'], ['Luna', 'Луна'],
  ['Chang’e', 'Чанъэ'], ["Chang'e", 'Чанъэ'], ['Yutu', 'Юйту'], ['Tianwen', 'Тяньвэнь'], ['Zhurong', 'Чжужун'], ['Chandrayaan', 'Чандраян'],
  ['Mangalyaan', 'Мангальян'], ['Clementine', 'Клементина'], ['Prospector', 'Проспектор'], ['Pioneer', 'Пионер'], ['Explorer', 'Эксплорер'],
  ['MAVEN', 'Мейвен'], ['GRAIL', 'Грейл'], ['LADEE', 'Ладии'], ['LCROSS', 'Элкросс'], ['MOXIE', 'Мокси'], ['HiRISE', 'Хайрайз'], ['SLIM', 'Слим'],
  ['MarCO', 'Марко'], ['ESCAPADE', 'Эскапейд'], ['Hope', 'Хоуп'], ['Kaguya', 'Кагуя'], ['Hiten', 'Хитэн'], ['Beresheet', 'Берешит'],
  ['Mars', 'Марс'], ['Moon', 'Мун'],
];
const SAY_ABBR = {
  ru: [['NASA', 'НАСА'], ['ESA', 'Европейское космическое агентство'], ['JPL', 'Джей-Пи-Эл'], ['LROC', 'Эл-Ар-О-Си'], ['LRO', 'Эл-Ар-О'], ['CNSA', 'китайское космическое агентство'], ['ISRO', 'индийское космическое агентство'], ['JAXA', 'японское агентство аэрокосмических исследований'],
       ['км', 'километров'], ['кг', 'килограммов'], ['°C', ' градусов'], ['с. ш.', 'северной широты'], ['ю. ш.', 'южной широты'], ['в. д.', 'восточной долготы'], ['з. д.', 'западной долготы']],
  kk: [['NASA', 'НАСА'], ['ESA', 'Еуропа ғарыш агенттігі'], ['JPL', 'Джей-Пи-Эл'], ['LROC', 'Эл-Ар-О-Си'], ['LRO', 'Эл-Ар-О'], ['CNSA', 'Қытай ғарыш агенттігі'], ['ISRO', 'Үндістан ғарыш агенттігі'], ['JAXA', 'Жапония аэроғарыштық зерттеулер агенттігі'],
       ['км', 'шақырым'], ['кг', 'килограмм'], ['°C', ' градус'], ['%', ' пайыз'], ['с. е.', 'солтүстік ендік'], ['о. е.', 'оңтүстік ендік'], ['ш. б.', 'шығыс бойлық'], ['б. б.', 'батыс бойлық'], ['т. б.', 'тағы басқа']],
  en: [['km', 'kilometres'], ['°C', ' degrees Celsius']],
};
const escRe = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function prepareSpeech(text, lang) {
  let t = text.replace(/[  ]/g, ' ').replace(/(\d) (?=\d{3}\b)/g, '$1');   // «10 540» → «10540»
  if (lang !== 'en') for (const [from, to] of SAY_NAMES) t = t.replace(new RegExp(`(^|[^\\p{L}])${escRe(from)}(?![\\p{L}])`, 'gu'), `$1${to}`);
  for (const [from, to] of SAY_ABBR[lang] || []) t = t.replace(new RegExp(`(^|[^\\p{L}])${escRe(from)}(?![\\p{L}])`, 'gu'), `$1${to}`);
  return t.replace(/[«»“”"]/g, '').replace(/\s+—\s+/g, ', ').replace(/\s{2,}/g, ' ').trim();
}
let speaking = null, voicesReady = null;
function waitVoices() {
  if (!('speechSynthesis' in window)) return Promise.resolve([]);
  if (speechSynthesis.getVoices().length) return Promise.resolve(speechSynthesis.getVoices());
  voicesReady ||= new Promise(res => {
    const done = () => res(speechSynthesis.getVoices());
    speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 1500);   // некоторые браузеры не присылают событие — ждём недолго
  });
  return voicesReady;
}
function pickVoice(voices, lang) {
  const norm = v => (v.lang || '').toLowerCase().replace('_', '-');
  const list = voices.filter(v => norm(v).split('-')[0] === lang);
  const score = v => (/natural|neural|online|premium|enhanced/i.test(v.name) ? 10 : 0) + ({ kk: 'kk-kz', ru: 'ru-ru', en: 'en-us' }[lang] === norm(v) ? 2 : 0) + (v.default ? 1 : 0);
  return list.sort((a, b) => score(b) - score(a))[0] || null;
}
function speechNote(btn, text) {
  let note = btn.parentElement.querySelector('.speak-note');
  if (!note) { note = document.createElement('p'); note.className = 'speak-note'; note.setAttribute('role', 'status'); btn.after(note); }
  note.textContent = text; note.hidden = !text;
}
function stopSpeech() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  if (speaking) { const lab = speaking.querySelector('[data-str]'); lab.dataset.str = 'listen'; lab.textContent = t('listen'); speaking.setAttribute('aria-pressed', 'false'); speaking = null; }
}
// Текст для чтения: заголовки, абзацы и пункты; номера сносок, схемы и кнопки пропускаем
function speechParts(root) {
  const say = el => { const c = el.cloneNode(true); c.querySelectorAll('.cites, .cite, [data-refs], .no-say').forEach(n => n.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };
  return $$('h1, h2, h3, h4, p, dt, dd, li', root).filter(el => !el.closest('.no-say, svg, button, figure, nav, form') && !el.querySelector('p, li, dd')).map(say).filter(Boolean);
}
async function speakFrom(btn, root) {
  if (speaking === btn) { stopSpeech(); return; }
  stopSpeech(); speechNote(btn, '');
  const lang = state.lang, voice = pickVoice(await waitVoices(), lang);
  if (!voice) { speechNote(btn, t('noVoice')); return; }   // своего голоса нет — не читаем чужим
  const parts = speechParts(root).map(x => prepareSpeech(x, lang)).filter(Boolean);
  if (!parts.length) return;
  speaking = btn; btn.setAttribute('aria-pressed', 'true');
  const lab = btn.querySelector('[data-str]'); lab.dataset.str = 'stop'; lab.textContent = t('stop');
  parts.forEach((text, i) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice.lang; u.voice = voice;
    u.rate = lang === 'en' ? 1 : 0.95; u.pitch = 1;
    if (i === parts.length - 1) u.onend = () => { if (speaking === btn) stopSpeech(); };
    u.onerror = () => { if (speaking === btn) stopSpeech(); };
    window.speechSynthesis.speak(u);
  });
}
function initSpeech() {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  $$('.speak').forEach(btn => {
    btn.hidden = false; btn.setAttribute('aria-pressed', 'false');
    on(btn, 'click', () => speakFrom(btn, btn.closest('[data-speak]')));
  });
  on(window, 'pagehide', stopSpeech);
  langHooks.push(() => { stopSpeech(); $$('.speak-note').forEach(n => { n.hidden = true; }); });
}

/* ---------- Фотографии: если файл загрузился, он заменяет схему ---------- */
function applyCaptions() {
  for (const [key, cfg] of Object.entries(ASSETS.photos)) {
    const cap = $(`[data-caption="${key}"]`); if (!cap) continue;
    cap.textContent = state.photos[key] && cfg.caption ? L(cfg.caption) : (dictFor(state.lang)[cap.dataset.i18n] ?? EN[cap.dataset.i18n]);
  }
}
function initPhotos() {
  for (const [key, cfg] of Object.entries(ASSETS.photos)) {
    const box = $(`.photo[data-photo="${key}"]`), img = box?.querySelector('img');
    if (!img || !cfg?.src) continue;
    img.referrerPolicy = 'no-referrer'; img.alt = L(cfg.caption);
    on(img, 'load', () => { box.classList.add('has-photo'); state.photos[key] = true; applyCaptions(); });
    on(img, 'error', () => { /* файла пока нет — остаётся схема */ });
    img.src = cfg.src;
  }
}

/* ---------- Пауза вращения ---------- */
function updateMotionButton() {
  const b = $('#motion');
  b.setAttribute('aria-pressed', String(!state.motion));
  b.setAttribute('aria-label', t(state.motion ? 'pause' : 'play'));
  b.title = t(state.motion ? 'pause' : 'play');
  b.querySelector('.i-pause').style.display = state.motion ? '' : 'none';
  b.querySelector('.i-play').style.display = state.motion ? 'none' : '';
}
function initMotion() { on($('#motion'), 'click', () => { state.motion = !state.motion; updateMotionButton(); }); }

/* ---------- Индикатор загрузки ---------- */
let loaderTimer = 0;
function setLoader(text, hideAfter = 0) {
  const el = $('#loader'); clearTimeout(loaderTimer);
  if (!text) { el.style.opacity = '0'; loaderTimer = setTimeout(() => { el.textContent = ''; }, 600); return; }
  el.textContent = text; el.style.opacity = '1';
  if (hideAfter) loaderTimer = setTimeout(() => setLoader(null), hideAfter);
}

/* ---------- Запуск интерфейса ---------- */
initDossier(); initQuiz(); initSignal(); initMotion(); initPhotos();
initLang();          // рисует списки, диаграмму и викторину на нужном языке
initSpeech();
measure(); onScroll();
on(window, 'scroll', onScroll, { passive: true });
on(window, 'resize', () => { measure(); onScroll(); stage?.resize(); });
const layoutWatcher = new ResizeObserver(() => { measure(); onScroll(); stage?.resize(); });
layoutWatcher.observe($('#main'));
document.fonts?.ready.then(() => { measure(); onScroll(); });

/* =====================================================================================
   6. 3D-СЦЕНА
   ===================================================================================== */
async function init3D() {
  const root = document.documentElement;
  let THREE, GLTFLoader, DRACOLoader, MeshoptDecoder;
  try {
    THREE = await import('three');
    ({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'));
    ({ DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js'));
    ({ MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js'));
  } catch (err) {
    console.warn('[Vestige] Three.js не загрузился — показываю страницу без 3D.', err);
    root.classList.add('no-webgl');
    return null;
  }

  const canvas = $('#stage');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('[Vestige] WebGL недоступен — показываю страницу без 3D.', err);
    root.classList.add('no-webgl');
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, SETTINGS.maxPixelRatio));
  renderer.setClearColor(0x000000, 1);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(SETTINGS.fov, 1, 0.1, 2000);   // камера стоит в начале координат и смотрит вдоль −Z
  const tanHalf = Math.tan(SETTINGS.fov * DEG / 2);
  const view = { w: 1, h: 1, aspect: 1 };

  // Свет: одно «Солнце» слева сверху для обеих планет и слабая подсветка ночной стороны
  const sun = new THREE.DirectionalLight(0xfff6ea, 3.3);
  sun.position.set(-6, 4.5, 7);
  scene.add(sun, new THREE.AmbientLight(0x8fa3c8, 0.26));
  const sunDir = sun.position.clone().normalize();

  /* ---------- Звёзды ---------- */
  const rand = prng(20261114);
  const starSprite = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d'), grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.35, 'rgba(255,255,255,0.75)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  })();
  const stars = new THREE.Group();
  for (const [count, size] of [[1700, 1.5], [260, 2.6]]) {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const z = rand() * 2 - 1, a = rand() * Math.PI * 2, r = Math.sqrt(1 - z * z), b = 0.35 + 0.65 * Math.pow(rand(), 2.2), warm = rand();
      pos.set([r * Math.cos(a) * 900, z * 900, r * Math.sin(a) * 900], i * 3);
      col.set([b * (0.82 + 0.18 * warm), b * 0.9, b * (1 - 0.2 * warm)], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    stars.add(new THREE.Points(geo, new THREE.PointsMaterial({ size, sizeAttenuation: false, vertexColors: true, map: starSprite, transparent: true, depthWrite: false })));
  }
  scene.add(stars);

  /* ---------- Временные планеты: рисуем поверхность кодом, чтобы сайт работал и без файлов ---------- */
  function makeNoise(seed) {
    const p = new Uint8Array(512), r = prng(seed);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 256; i++) p[i + 256] = p[i];
    const h = (x, y, z) => p[p[p[x & 255] + (y & 255)] + (z & 255)] / 255;
    const value = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
      const a = lerp(lerp(h(xi, yi, zi), h(xi + 1, yi, zi), u), lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u), v);
      const b = lerp(lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u), lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u), v);
      return lerp(a, b, w);
    };
    return (x, y, z, octaves) => { let sum = 0, amp = 0.5, f = 1, norm = 0; for (let o = 0; o < octaves; o++) { sum += amp * value(x * f, y * f, z * f); norm += amp; amp *= 0.5; f *= 2.03; } return sum / norm; };
  }
  function paintPlanet(key) {
    const W = 768, H = 384, noise = makeNoise(key === 'moon' ? 7 : 19);
    const color = document.createElement('canvas'), bump = document.createElement('canvas');
    color.width = bump.width = W; color.height = bump.height = H;
    const cc = color.getContext('2d'), bc = bump.getContext('2d'), ci = cc.createImageData(W, H), bi = bc.createImageData(W, H);
    for (let y = 0; y < H; y++) {
      const lat = (0.5 - (y + 0.5) / H) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
      for (let x = 0; x < W; x++) {
        const lon = ((x + 0.5) / W - 0.5) * Math.PI * 2, px = cl * Math.cos(lon), pz = -cl * Math.sin(lon);
        const fine = noise(px * 9 + 3, sl * 9 + 3, pz * 9 + 3, 5), broad = noise(px * 1.7 + 11, sl * 1.7 + 11, pz * 1.7 + 11, 3);
        let r, g, b;
        if (key === 'moon') {
          const sea = smooth(clamp((broad - 0.5) * 6 + 0.5 * px, 0, 1));            // «моря» — в основном на видимой стороне
          const v = lerp(0.58, 0.26, sea) * (0.72 + 0.56 * fine);
          r = v * 1.02; g = v; b = v * 0.97;
        } else {
          const dark = smooth(clamp((broad - 0.52) * 7, 0, 1)), k = 0.7 + 0.6 * fine;
          r = lerp(0.80, 0.42, dark) * k; g = lerp(0.47, 0.25, dark) * k; b = lerp(0.29, 0.19, dark) * k;
          const cap = smooth(clamp((Math.abs(lat) / DEG - (sl > 0 ? 78 : 84) + fine * 8) / 4, 0, 1));   // полярные шапки
          r = lerp(r, 0.93, cap); g = lerp(g, 0.92, cap); b = lerp(b, 0.9, cap);
        }
        const i = (y * W + x) * 4, hgt = clamp(fine * 255, 0, 255);
        ci.data[i] = clamp(r * 255, 0, 255); ci.data[i + 1] = clamp(g * 255, 0, 255); ci.data[i + 2] = clamp(b * 255, 0, 255); ci.data[i + 3] = 255;
        bi.data[i] = bi.data[i + 1] = bi.data[i + 2] = hgt; bi.data[i + 3] = 255;
      }
    }
    cc.putImageData(ci, 0, 0); bc.putImageData(bi, 0, 0);
    if (key === 'moon') {   // несколько сотен кратеров поверх шума
      const cr = prng(31);
      for (let n = 0; n < 420; n++) {
        const u = cr(), v = cr(), s = cr();
        const lat = Math.asin(clamp(v * 2 - 1, -0.98, 0.98)), x = u * W, y = (0.5 - lat / Math.PI) * H, rad = 1.2 + 9 * s * s * s, sx = 1 / Math.max(0.25, Math.cos(lat));
        for (const [ctx, rim, floor] of [[cc, 'rgba(255,255,255,0.20)', 'rgba(0,0,0,0.16)'], [bc, 'rgba(255,255,255,0.55)', 'rgba(0,0,0,0.5)']]) {
          ctx.beginPath(); ctx.ellipse(x, y, rad * sx, rad, 0, 0, Math.PI * 2); ctx.fillStyle = floor; ctx.fill();
          ctx.lineWidth = Math.max(0.6, rad * 0.22); ctx.strokeStyle = rim; ctx.stroke();
        }
      }
    }
    const map = new THREE.CanvasTexture(color), bumpMap = new THREE.CanvasTexture(bump);
    map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = maxAniso;
    return { map, bumpMap };
  }

  /* ---------- Утилиты ---------- */
  // Освобождаем память: геометрию, материалы и их текстуры
  function disposeDeep(obj) {
    obj.traverse(o => {
      o.geometry?.dispose();
      for (const m of [].concat(o.material || [])) {
        for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
        m.dispose();
      }
    });
  }
  // Широта и долгота → направление на сфере (север — ось +Y, долгота 0° — ось +X, восток — к −Z)
  const latLonDir = (lat, lon) => new THREE.Vector3(Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), -Math.cos(lat * DEG) * Math.sin(lon * DEG));

  const gltfLoader = new GLTFLoader();
  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.187.0/examples/jsm/libs/draco/gltf/');   // нужен только для сжатых моделей
  gltfLoader.setDRACOLoader(draco); gltfLoader.setMeshoptDecoder(MeshoptDecoder);
  const textureLoader = new THREE.TextureLoader();
  const gltfCache = new Map();
  const loadGLTF = (url, onProgress) => {
    if (!gltfCache.has(url)) gltfCache.set(url, new Promise((res, rej) => gltfLoader.load(url, res, onProgress, rej)));
    return gltfCache.get(url);
  };
  // Пробует адреса по очереди: сначала сжатую копию, потом оригинал
  const loadAny = async (urls, onProgress) => {
    let last;
    for (const url of [].concat(urls).filter(Boolean)) {
      try { return await loadGLTF(url, onProgress); } catch (err) { last = err; gltfCache.delete(url); }
    }
    throw last || new Error('no model file');
  };
  const assetUrls = id => ASSET[id] ? [ASSET[id].optimizedFilePath, ASSET[id].filePath] : [];
  const loadTexture = url => new Promise((res, rej) => textureLoader.load(url, res, undefined, rej));

  /* ---------- Заглушки техники из простых фигур (пока нет настоящих .glb-моделей) ---------- */
  const partMat = hex => new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.16, roughness: 0.7, metalness: 0.1, flatShading: true });
  const MAT = { metal: partMat(0xcfcac0), dark: partMat(0x2d2d31), gold: partMat(0xc79a3b), panel: partMat(0x2b3b63), white: partMat(0xeeeae2) };
  const GEO = {};
  const geo = (name, make) => (GEO[name] ??= make());
  const part = (g, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); return mesh; };
  const wheel = (r, w) => geo(`wheel${r}`, () => new THREE.CylinderGeometry(r, r, w, 10));
  const PLACEHOLDER = {
    lunokhod() {
      const g = new THREE.Group();
      g.add(part(geo('tub', () => new THREE.CylinderGeometry(0.36, 0.27, 0.26, 14)), MAT.metal, 0, 0.40, 0));
      g.add(part(geo('rim', () => new THREE.CylinderGeometry(0.4, 0.4, 0.03, 14)), MAT.gold, 0, 0.5, 0));
      g.add(part(geo('cap', () => new THREE.CylinderGeometry(0.3, 0.36, 0.04, 14)), MAT.white, 0, 0.55, 0));
      g.add(part(geo('lid', () => new THREE.CylinderGeometry(0.37, 0.37, 0.03, 14)), MAT.panel, -0.57, 0.85, 0, 0, 0, -0.96));
      g.add(part(geo('frame', () => new THREE.BoxGeometry(0.86, 0.04, 0.5)), MAT.dark, 0, 0.22, 0));
      for (const x of [-0.33, -0.11, 0.11, 0.33]) for (const z of [-0.36, 0.36]) g.add(part(wheel(0.11, 0.07), MAT.dark, x, 0.11, z, Math.PI / 2));
      g.add(part(geo('horn', () => new THREE.ConeGeometry(0.06, 0.34, 8)), MAT.white, 0.2, 0.74, 0.1, 0, 0, -0.5));
      g.add(part(geo('rod', () => new THREE.CylinderGeometry(0.008, 0.008, 0.5, 5)), MAT.white, 0.02, 0.8, -0.12));
      g.add(part(geo('mirror', () => new THREE.BoxGeometry(0.08, 0.08, 0.16)), MAT.gold, 0.4, 0.57, 0));
      g.add(part(wheel(0.045, 0.03), MAT.dark, -0.52, 0.045, 0, Math.PI / 2));
      return g;
    },
    mer() {
      const g = new THREE.Group();
      g.add(part(geo('web', () => new THREE.BoxGeometry(0.42, 0.14, 0.34)), MAT.gold, 0, 0.33, 0));
      g.add(part(geo('deck', () => new THREE.BoxGeometry(0.62, 0.025, 0.46)), MAT.panel, -0.02, 0.425, 0));
      for (const z of [-0.33, 0.33]) g.add(part(geo('wing', () => new THREE.BoxGeometry(0.4, 0.02, 0.2)), MAT.panel, -0.08, 0.425, z));
      for (const z of [-0.3, 0.3]) g.add(part(geo('strut', () => new THREE.BoxGeometry(0.66, 0.03, 0.03)), MAT.metal, 0, 0.2, z));
      for (const x of [-0.31, 0, 0.31]) for (const z of [-0.3, 0.3]) g.add(part(wheel(0.09, 0.07), MAT.dark, x, 0.09, z, Math.PI / 2));
      g.add(part(geo('mast', () => new THREE.CylinderGeometry(0.018, 0.018, 0.44, 6)), MAT.white, 0.24, 0.65, 0.1));
      g.add(part(geo('head', () => new THREE.BoxGeometry(0.06, 0.06, 0.2)), MAT.white, 0.24, 0.89, 0.1));
      g.add(part(geo('dish', () => new THREE.CylinderGeometry(0.09, 0.09, 0.012, 12)), MAT.white, -0.12, 0.56, -0.1, 0.5, 0, 0.3));
      g.add(part(geo('arm', () => new THREE.BoxGeometry(0.24, 0.025, 0.025)), MAT.metal, 0.44, 0.27, 0, 0, 0, -0.55));
      return g;
    },
    rover() { return PLACEHOLDER.mer(); },
    lander() {
      const g = new THREE.Group();
      g.add(part(geo('base', () => new THREE.CylinderGeometry(0.2, 0.34, 0.28, 8)), MAT.gold, 0, 0.3, 0));
      g.add(part(geo('top', () => new THREE.CylinderGeometry(0.1, 0.2, 0.14, 8)), MAT.metal, 0, 0.51, 0));
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; g.add(part(geo('leg', () => new THREE.CylinderGeometry(0.014, 0.014, 0.42, 5)), MAT.metal, Math.cos(a) * 0.36, 0.17, Math.sin(a) * 0.36, Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6)); }
      g.add(part(geo('dish', () => new THREE.CylinderGeometry(0.09, 0.09, 0.012, 12)), MAT.white, 0.06, 0.66, 0, 0.4, 0, 0.5));
      return g;
    },
    orbiter() {
      const g = new THREE.Group();
      g.add(part(geo('bus', () => new THREE.BoxGeometry(0.34, 0.4, 0.34)), MAT.gold, 0, 0, 0));
      for (const x of [-0.5, 0.5]) g.add(part(geo('array', () => new THREE.BoxGeometry(0.6, 0.02, 0.3)), MAT.panel, x, 0.05, 0));
      g.add(part(geo('dish', () => new THREE.CylinderGeometry(0.09, 0.09, 0.012, 12)), MAT.white, 0, 0.3, 0.12, 0.6, 0, 0));
      return g;
    },
    // Упрощённые модели значимых миссий (схемы, не точные копии)
    luna9() {   // посадочная капсула «Луны-9»: шар, четыре раскрытых лепестка, камера и антенны
      const g = new THREE.Group();
      g.add(part(geo('l9ball', () => new THREE.SphereGeometry(0.29, 20, 14)), MAT.metal, 0, 0.3, 0));
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2, petal = part(geo('l9petal', () => new THREE.BoxGeometry(0.42, 0.02, 0.26)), MAT.gold, Math.cos(a) * 0.4, 0.05, Math.sin(a) * 0.4, 0, -a, 0.18); g.add(petal); }
      g.add(part(geo('l9cam', () => new THREE.CylinderGeometry(0.05, 0.06, 0.16, 10)), MAT.dark, 0, 0.66, 0));
      for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2; g.add(part(geo('l9ant', () => new THREE.CylinderGeometry(0.006, 0.006, 0.5, 4)), MAT.white, Math.cos(a) * 0.24, 0.72, Math.sin(a) * 0.24, Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55)); }
      return g;
    },
    sample() {   // «Луна-16»: посадочная ступень с баками и буром, сверху взлётная ракета и капсула
      const g = new THREE.Group();
      for (const x of [-0.3, 0.3]) for (const z of [-0.3, 0.3]) g.add(part(geo('l16tank', () => new THREE.SphereGeometry(0.22, 14, 10)), MAT.metal, x, 0.48, z));
      g.add(part(geo('l16deck', () => new THREE.BoxGeometry(1.1, 0.08, 1.1)), MAT.gold, 0, 0.74, 0));
      for (const x of [-0.6, 0.6]) for (const z of [-0.6, 0.6]) { g.add(part(geo('l16leg', () => new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6)), MAT.white, x * 0.9, 0.37, z * 0.9, z * 0.3, 0, -x * 0.3)); g.add(part(geo('l16pad', () => new THREE.CylinderGeometry(0.1, 0.1, 0.03, 10)), MAT.dark, x * 1.15, 0.015, z * 1.15)); }
      g.add(part(geo('l16asc', () => new THREE.CylinderGeometry(0.2, 0.24, 0.62, 12)), MAT.metal, 0, 1.1, 0));
      g.add(part(geo('l16cap', () => new THREE.SphereGeometry(0.2, 16, 12)), MAT.white, 0, 1.62, 0));
      g.add(part(geo('l16drill', () => new THREE.BoxGeometry(0.06, 0.9, 0.06)), MAT.dark, 0.78, 0.36, 0, 0, 0, 0.35));
      return g;
    },
    cnlander() {   // «Чанъэ-4»: посадочный аппарат с панелями и ровер «Юйту-2» рядом
      const g = new THREE.Group();
      g.add(part(geo('cnbody', () => new THREE.BoxGeometry(0.9, 0.7, 0.9)), MAT.gold, 0, 0.85, 0));
      for (const x of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) g.add(part(geo('cnleg', () => new THREE.CylinderGeometry(0.03, 0.03, 0.75, 6)), MAT.white, x * 1.05, 0.36, z * 1.05, z * 0.35, 0, -x * 0.35));
      for (const x of [-1, 1]) g.add(part(geo('cnpanel', () => new THREE.BoxGeometry(0.62, 0.02, 0.5)), MAT.panel, x * 0.72, 1.28, 0, 0, 0, x * 0.5));
      g.add(part(geo('cndish', () => new THREE.CylinderGeometry(0.16, 0.04, 0.06, 14)), MAT.white, 0.2, 1.36, 0.25, 0.6, 0, 0));
      const rover = new THREE.Group(); rover.position.set(1.55, 0, 0);
      rover.add(part(geo('ytbody', () => new THREE.BoxGeometry(0.42, 0.22, 0.34)), MAT.gold, 0, 0.3, 0));
      for (const z of [-1, 1]) rover.add(part(geo('ytwing', () => new THREE.BoxGeometry(0.34, 0.015, 0.3)), MAT.panel, 0, 0.42, z * 0.3, z * 0.35, 0, 0));
      rover.add(part(geo('ytmast', () => new THREE.CylinderGeometry(0.015, 0.015, 0.3, 5)), MAT.white, 0.12, 0.56, 0));
      rover.add(part(geo('ythead', () => new THREE.BoxGeometry(0.1, 0.06, 0.08)), MAT.dark, 0.12, 0.72, 0));
      for (const x of [-0.16, 0, 0.16]) for (const z of [-0.2, 0.2]) rover.add(part(wheel(0.07, 0.05), MAT.dark, x, 0.07, z, Math.PI / 2));
      g.add(rover);
      return g;
    },
    vikram() {   // «Чандраян-3»: модуль «Викрам» с солнечной панелью сбоку и ровер «Прагьян»
      const g = new THREE.Group();
      g.add(part(geo('vkbody', () => new THREE.BoxGeometry(1.0, 0.8, 1.0)), MAT.gold, 0, 0.85, 0));
      g.add(part(geo('vktop', () => new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12)), MAT.white, 0, 1.31, 0));
      g.add(part(geo('vkpanel', () => new THREE.BoxGeometry(0.02, 0.62, 0.8)), MAT.panel, -0.52, 0.95, 0));
      for (const x of [-0.55, 0.55]) for (const z of [-0.55, 0.55]) g.add(part(geo('vkleg', () => new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6)), MAT.white, x * 1.05, 0.33, z * 1.05, z * 0.35, 0, -x * 0.35));
      g.add(part(geo('vkramp', () => new THREE.BoxGeometry(0.75, 0.02, 0.3)), MAT.metal, 0.82, 0.24, 0, 0, 0, -0.55));
      const rover = new THREE.Group(); rover.position.set(1.5, 0, 0);
      rover.add(part(geo('pgbody', () => new THREE.BoxGeometry(0.36, 0.16, 0.3)), MAT.metal, 0, 0.24, 0));
      rover.add(part(geo('pgpanel', () => new THREE.BoxGeometry(0.02, 0.24, 0.3)), MAT.panel, -0.17, 0.42, 0, 0, 0, 0.2));
      for (const x of [-0.13, 0, 0.13]) for (const z of [-0.18, 0.18]) rover.add(part(wheel(0.06, 0.04), MAT.dark, x, 0.06, z, Math.PI / 2));
      g.add(rover);
      return g;
    },
    zhurong() {   // «Чжужун»: ровер с четырьмя панелями-крыльями и мачтой, рядом посадочная платформа
      const g = new THREE.Group();
      g.add(part(geo('zrbody', () => new THREE.BoxGeometry(0.7, 0.3, 0.5)), MAT.white, 0, 0.45, 0));
      for (const [x, z, ry] of [[0.45, 0.4, 0.4], [0.45, -0.4, -0.4], [-0.4, 0.4, -0.4], [-0.4, -0.4, 0.4]]) g.add(part(geo('zrwing', () => new THREE.BoxGeometry(0.42, 0.015, 0.3)), MAT.panel, x, 0.6, z, 0, ry, 0));
      g.add(part(geo('zrmast', () => new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6)), MAT.white, 0.2, 0.8, 0));
      g.add(part(geo('zrhead', () => new THREE.BoxGeometry(0.14, 0.08, 0.1)), MAT.dark, 0.2, 1.03, 0));
      for (const x of [-0.26, 0, 0.26]) for (const z of [-0.3, 0.3]) g.add(part(wheel(0.1, 0.07), MAT.dark, x, 0.1, z, Math.PI / 2));
      const pad = new THREE.Group(); pad.position.set(-1.45, 0, 0);
      pad.add(part(geo('zrpad', () => new THREE.BoxGeometry(1.0, 0.14, 1.0)), MAT.gold, 0, 0.32, 0));
      for (const x of [-0.45, 0.45]) for (const z of [-0.45, 0.45]) pad.add(part(geo('zrleg', () => new THREE.CylinderGeometry(0.03, 0.03, 0.34, 6)), MAT.white, x, 0.16, z));
      for (const z of [-0.2, 0.2]) pad.add(part(geo('zrramp', () => new THREE.BoxGeometry(0.6, 0.015, 0.12)), MAT.metal, 0.75, 0.17, z, 0, 0, -0.5));
      g.add(pad);
      return g;
    },
    crew() {
      const g = new THREE.Group();
      g.add(part(geo('stage', () => new THREE.CylinderGeometry(0.2, 0.26, 0.16, 8)), MAT.gold, -0.24, 0.1, 0));
      g.add(part(geo('pole', () => new THREE.CylinderGeometry(0.013, 0.013, 0.9, 6)), MAT.white, 0.16, 0.45, 0));
      g.add(part(geo('flag', () => new THREE.BoxGeometry(0.36, 0.22, 0.012)), MAT.white, 0.35, 0.78, 0));
      return g;
    },
  };

  /* ---------- Планета ---------- */
  const STATUS_COLOR = { silent: 0xecebe4, passive: null /* цвет главы */, active: 0x7fe3a0, site: 0xecebe4, impact: 0xff8f7d, orbit: 0x8fd1ff, flyby: 0xc6b5ff };
  const WORLD_COLOR = { moon: 0xa9cfff, mars: 0xf2a65e };
  const dotGeo = new THREE.SphereGeometry(1, 16, 12), ringGeo = new THREE.RingGeometry(0.86, 1, 48), hitGeo = new THREE.SphereGeometry(1, 10, 8);
  ringGeo.rotateX(-Math.PI / 2);   // кольцо лежит на поверхности

  class Planet {
    constructor(key) {
      this.key = key;
      this.cfg = ASSETS.planets[key];
      this.radius = SETTINGS.radius[key];
      this.root = new THREE.Group();    // положение в сцене (управляется прокруткой)
      this.tilt = new THREE.Group();    // наклон к зрителю: «кивок» к выбранной точке
      this.spin = new THREE.Group();    // вращение вокруг оси
      this.root.add(this.tilt); this.tilt.add(this.spin); scene.add(this.root);

      // временная поверхность, нарисованная кодом
      const tex = paintPlanet(key);
      this.proc = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 96, 64), new THREE.MeshStandardMaterial({ map: tex.map, bumpMap: tex.bumpMap, bumpScale: 1.2, roughness: 1, metalness: 0 }));
      this.spin.add(this.proc);
      this.model = null;                // сюда встанет загруженная модель
      this.lookup = null;               // точная привязка координат для моделей с «кубической» текстурой

      if (key === 'mars') {             // тонкая дымка атмосферы по краю диска; у Луны атмосферы нет
        this.air = new THREE.Mesh(new THREE.SphereGeometry(this.radius * 1.035, 64, 48), new THREE.ShaderMaterial({
          uniforms: { uColor: { value: new THREE.Color(0xffb48a) }, uSun: { value: sunDir }, uEdge: { value: Math.sqrt(1 - 1 / (1.035 * 1.035)) } },
          vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vW; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vW = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * mv; }',
          fragmentShader: 'uniform vec3 uColor; uniform vec3 uSun; uniform float uEdge; varying vec3 vN; varying vec3 vV; varying vec3 vW; void main(){ float d = -dot(normalize(vN), normalize(vV)); float a = smoothstep(0.0, uEdge, d) * (1.0 - smoothstep(uEdge, uEdge * 1.6, d)); float lit = smoothstep(-0.25, 0.6, dot(normalize(vW), uSun)); gl_FragColor = vec4(uColor, a * lit * 0.55); }',
          side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        }));
        this.root.add(this.air);
      }

      // состояние вращения
      this.spinAngle = key === 'moon' ? -1.2 : 1.9;
      this.yaw = 0; this.yawTarget = 0; this.pitch = 0; this.pitchTarget = 0;
      this.zoom = 1; this.zoomTarget = 1;
      this.focus = 0; this.follow = null;
      this.screen = { x: 0, y: 0, r: 1 };

      // точки
      this.markers = new Map(); this.hitMeshes = [];
      for (const site of SITES.filter(s => s.world === key)) this.addMarker(site);
      // кольца, на которых стоят точки аппаратов «на орбите» и «пролётом» (поверхности они не касаются)
      this.shells = [...new Set(SITES.filter(s => s.world === key && s.alt).map(s => `${s.alt}|${s.status}|${s.inc || 0}`))].map(k => {
        const [alt, status, inc] = k.split('|'), r = this.radius * (1 + Number(alt)), si = Math.sin(Number(inc)), ci = Math.cos(Number(inc)), pts = [];
        for (let i = 0; i <= 180; i++) { const a = i / 180 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, si * Math.sin(a) * r, -ci * Math.sin(a) * r)); }   // то же наклонное кольцо, что и у точек
        const mat = status === 'flyby' ? new THREE.LineDashedMaterial({ color: STATUS_COLOR.flyby, dashSize: this.radius * 0.04, gapSize: this.radius * 0.035, transparent: true, opacity: 0.35, depthWrite: false })
          : new THREE.LineBasicMaterial({ color: STATUS_COLOR.orbit, transparent: true, opacity: 0.3, depthWrite: false });
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat); line.computeLineDistances(); line.visible = false;
        this.spin.add(line); return line;
      });
      this.placeMarkers();

      // орбитальные аппараты: летают по своей (сильно увеличенной) полярной орбите, а не стоят на поверхности
      this.orbiters = ORBITERS.filter(o => o.planet === key).map(cfg => this.addOrbiter(cfg));
    }

    addOrbiter(cfg) {
      const R = this.radius, r = R * cfg.alt, color = WORLD_COLOR[this.key];
      const plane = new THREE.Group(); plane.rotation.y = cfg.tilt;        // плоскость орбиты проходит через полюса
      const pts = []; for (let i = 0; i < 160; i++) { const a = i / 160 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0)); }
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color, dashSize: R * 0.035, gapSize: R * 0.03, transparent: true, opacity: 0.4, depthWrite: false }));
      line.computeLineDistances();
      const pivot = new THREE.Group(), slot = new THREE.Group(), size = R * cfg.size;
      slot.position.set(r, 0, 0); slot.rotation.z = -Math.PI / 2;     // «низ» аппарата смотрит на планету
      slot.scale.setScalar(size); slot.add(PLACEHOLDER.orbiter());
      const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial()); hit.visible = false; hit.scale.setScalar(Math.max(size * 0.9, R * 0.08)); slot.add(hit);
      hit.scale.divideScalar(size);                                        // слот уже масштабирован
      pivot.add(slot); plane.add(line, pivot); this.tilt.add(plane);
      const orb = { cfg, plane, line, pivot, slot, hit, size, angle: cfg.tilt * 3, behind: false, grow: 1 };
      hit.userData.orbiter = orb;
      this.hitMeshes.push(hit);
      return orb;
    }

    addMarker(site) {
      const R = this.radius, color = STATUS_COLOR[site.status] ?? WORLD_COLOR[this.key];
      const group = new THREE.Group();
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color })); dot.scale.setScalar(R * 0.011);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
      const pulse = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
      const size = R * (site.hero ? SETTINGS.hardwareSize.hero : SETTINGS.hardwareSize.normal) * (site.mini ? 0.55 : 1);
      ring.scale.setScalar(size * 0.62); ring.position.y = R * 0.002; pulse.position.y = R * 0.002;
      const slot = new THREE.Group(); slot.scale.setScalar(size);                 // сюда ставится заглушка, а потом — настоящая модель
      if (!site.mini) { const hw = (PLACEHOLDER[site.kind] || PLACEHOLDER.lander)(); if (['cnlander', 'vikram', 'zhurong'].includes(site.kind)) hw.scale.setScalar(0.55); slot.add(hw); }   // у дополнительных точек — только метка
      const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial()); hit.scale.setScalar(Math.max(size * 0.85, R * 0.075)); hit.position.y = size * 0.4; hit.visible = false;
      group.add(ring, pulse, dot, slot, hit);
      this.spin.add(group);
      const marker = { site, group, ring, pulse, slot, hit, size, dir: new THREE.Vector3(), facing: 0, grow: 1, phase: (site.lat * 13.7 + site.lon * 3.1) % 1 };
      hit.userData.marker = marker;
      this.markers.set(site.id, marker); this.hitMeshes.push(hit);
    }

    // Ставит точки на поверхность: по модели (если она есть) или по идеальной сфере
    placeMarkers() {
      this.root.updateWorldMatrix(true, true);
      const up = new THREE.Vector3(0, 1, 0), ray = new THREE.Raycaster();
      for (const m of this.markers.values()) {
        let dir = latLonDir(m.site.lat, m.site.lon), r = this.radius;
        if (m.site.alt) {   // аппарат на орбите или пролётом: точка на кольце, не на поверхности
          m.dir.copy(dir); m.group.position.copy(dir).multiplyScalar(this.radius * (1 + m.site.alt)); m.group.quaternion.setFromUnitVectors(up, dir); continue;
        }
        if (this.model) {
          const exact = this.lookup?.(dir);
          if (exact) { dir = exact.dir; r = exact.r; }
          else {   // луч из космоса к центру планеты: где он встретит модель, там и поверхность
            const from = this.spin.localToWorld(dir.clone().multiplyScalar(this.radius * 3)), center = this.spin.getWorldPosition(new THREE.Vector3());
            ray.set(from, center.clone().sub(from).normalize());
            const hitPoint = ray.intersectObject(this.model, true)[0];
            if (hitPoint) r = this.spin.worldToLocal(hitPoint.point.clone()).length();
          }
        }
        m.dir.copy(dir);
        m.group.position.copy(dir).multiplyScalar(r + this.radius * 0.003);
        m.group.quaternion.setFromUnitVectors(up, dir);
      }
    }

    /* Загрузка поверхности: модель → (если её нет) карты цвета и высот → (если и их нет) остаётся нарисованная кодом */
    async load(onProgress) {
      const cfg = this.cfg;
      if (cfg.model) {
        try {
          const gltf = await loadAny(cfg.model, onProgress);
          this.useModel(gltf.scene);
          return 'model';
        } catch (err) { console.info(`[Vestige] Модель ${[].concat(cfg.model).join(' / ')} не загрузилась — пробую текстуры.`); }
      }
      if (cfg.colorMap) {
        try {
          const map = await loadTexture(cfg.colorMap);
          map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = maxAniso;
          const old = this.proc.material.map; this.proc.material.map = map; old.dispose();
          if (cfg.bumpMap) {
            try { const bump = await loadTexture(cfg.bumpMap); const oldBump = this.proc.material.bumpMap; this.proc.material.bumpMap = bump; this.proc.material.bumpScale = cfg.bumpScale ?? 1; oldBump.dispose(); }
            catch { /* карты высот нет — остаётся рельеф из шума */ }
          }
          this.proc.material.needsUpdate = true;
          return 'texture';
        } catch (err) { console.info(`[Vestige] Текстура ${cfg.colorMap} не найдена — планета «${this.key}» нарисована кодом.`); }
      }
      return 'procedural';
    }

    useModel(object) {
      // приводим модель к нужному размеру и ставим в центр
      const box = new THREE.Box3().setFromObject(object), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
      const holder = new THREE.Group();
      object.position.sub(center);
      holder.add(object);
      holder.scale.setScalar((2 * this.radius) / Math.max(size.x, size.y, size.z));
      holder.rotation.y = this.cfg.modelYaw || 0;
      object.traverse(o => {
        if (!o.isMesh) return;
        const old = o.material;   // упрощаем материал: планете не нужен блеск, только цвет и рельеф
        o.material = new THREE.MeshStandardMaterial({ map: old.map || null, normalMap: old.normalMap || null, roughness: 1, metalness: 0, color: old.map ? 0xffffff : old.color });
        if (old.normalScale) o.material.normalScale.copy(old.normalScale);
        if (o.material.map) o.material.map.anisotropy = maxAniso;
        old.dispose();
      });
      this.spin.add(holder);
      this.model = holder;
      if (this.cfg.cubeCross) this.lookup = this.makeCubeLookup(holder, this.cfg.cubeCross);
      this.placeMarkers();
      // нарисованная поверхность плавно растворяется поверх модели
      this.proc.material.transparent = true; this.proc.scale.setScalar(1.006); this.fade = 1;
    }

    // Для текстуры «кубический крест»: по направлению находим точку текстуры, а по ней — место на модели
    makeCubeLookup(holder, layout) {
      let mesh = null; holder.traverse(o => { if (o.isMesh && o.geometry.attributes.uv && !mesh) mesh = o; });
      if (!mesh || !mesh.geometry.index) return null;
      this.root.updateWorldMatrix(true, true);
      const rel = new THREE.Matrix4().copy(this.spin.matrixWorld).invert().multiply(mesh.matrixWorld), inv = rel.clone().invert();
      const P = mesh.geometry.attributes.position, T = mesh.geometry.attributes.uv, I = mesh.geometry.index;
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      const dot = (v, n) => v.x * n[0] + v.y * n[1] + v.z * n[2];
      return dir => {
        const d = dir.clone().transformDirection(inv);
        let face = layout.faces[0], k = -2;
        for (const f of layout.faces) { const q = dot(d, f.n); if (q > k) { k = q; face = f; } }
        const U = (face.cell[0] + 0.5 + dot(d, face.u) / k / 2) / layout.cols, V = (face.cell[1] + 0.5 + dot(d, face.v) / k / 2) / layout.rows;
        let best = null, bestDot = -2;
        for (let i = 0; i < I.count; i += 3) {
          const ia = I.getX(i), ib = I.getX(i + 1), ic = I.getX(i + 2);
          const ax = T.getX(ia), ay = T.getY(ia), bx = T.getX(ib), by = T.getY(ib), cx = T.getX(ic), cy = T.getY(ic);
          const den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
          if (Math.abs(den) < 1e-12) continue;
          const w1 = ((by - cy) * (U - cx) + (cx - bx) * (V - cy)) / den, w2 = ((cy - ay) * (U - cx) + (ax - cx) * (V - cy)) / den, w3 = 1 - w1 - w2;
          if (w1 < -1e-4 || w2 < -1e-4 || w3 < -1e-4) continue;
          a.fromBufferAttribute(P, ia).multiplyScalar(w1); b.fromBufferAttribute(P, ib).multiplyScalar(w2); c.fromBufferAttribute(P, ic).multiplyScalar(w3);
          const point = a.add(b).add(c).applyMatrix4(rel), r = point.length(), q = point.dot(dir) / r;
          if (q > bestDot) { bestDot = q; best = { dir: point.clone().divideScalar(r), r }; }
        }
        return best;
      };
    }

    // Куда смотрит камера в системе координат планеты (азимут вокруг оси вращения)
    cameraAzimuth() {
      this.tilt.updateWorldMatrix(true, false);
      const v = this.tilt.worldToLocal(camera.position.clone());
      return Math.atan2(v.x, v.z);
    }
    // Повернуть планету так, чтобы точка оказалась перед зрителем (чуть левее центра — дальше её понесёт вращение)
    // lift — на сколько приподнять точку над центром диска (когда открыто досье, чтобы оно её не закрывало)
    focusSite(id, lead = 0.3, lift = 0) {
      const m = this.markers.get(id); if (!m) return;
      this.follow = id; this.lead = lead; this.lift = lift;
      const want = this.cameraAzimuth() - lead - Math.atan2(m.dir.x, m.dir.z);
      this.yawTarget = this.yaw + wrapPi(want - (this.spinAngle + this.yaw));
      this.pitchTarget = clamp(Math.asin(clamp(m.dir.y, -1, 1)) * 0.72 - lift, -1, 1);
    }

    update(frameA, frameB, f, dt, time) {
      // 1) положение и размер: интерполяция между ключевыми кадрами соседних секций
      const x = lerp(frameA.x, frameB.x, f), y = lerp(frameA.y, frameB.y, f);
      const zoomGoal = this.focus > 0.85 ? this.zoomTarget : 1;
      this.zoomSettling = Math.abs(zoomGoal - this.zoom) > 0.004;
      this.zoom = damp(this.zoom, zoomGoal, 2.5, dt);
      const size = Math.exp(lerp(Math.log(frameA.size), Math.log(frameB.size), f)) * this.zoom;
      const dist = this.radius * Math.sqrt(1 + 1 / Math.pow(2 * size * tanHalf, 2));
      this.root.position.set(x * dist * tanHalf * view.aspect, y * dist * tanHalf, -dist);
      this.screen.x = (x + 1) / 2 * view.w; this.screen.y = (1 - y) / 2 * view.h; this.screen.r = size * view.h;

      // 2) вращение: фоновое (не зависит от прокрутки) + доводка к выбранной точке
      if (state.motion) this.spinAngle += lerp(SETTINGS.spinFree, SETTINGS.spinFocused, this.focus) * dt;
      this.yaw = damp(this.yaw, this.yawTarget, 3.2, dt);
      this.pitch = damp(this.pitch, this.focus > 0.4 ? this.pitchTarget : 0, 3.2, dt);
      this.spin.rotation.y = this.spinAngle + this.yaw;
      this.tilt.rotation.x = this.pitch;
      if (this.follow && !pointer.drag && this.focus > 0.5) {
        if (this.focus < 0.985 || this.zoomSettling) this.focusSite(this.follow, this.lead, this.lift);   // планета ещё летит на место — держим точку в кадре
        else if (state.motion) {                                                 // точка уплыла к краю диска — возвращаем
          const m = this.markers.get(this.follow), off = wrapPi(Math.atan2(m.dir.x, m.dir.z) + this.spin.rotation.y - this.cameraAzimuth());
          if (off > 0.9 || off < -1.2) this.focusSite(this.follow, this.lead, this.lift);
        }
      }

      // 3) растворение временной поверхности после загрузки модели
      if (this.fade !== undefined) {
        this.fade = Math.max(0, this.fade - dt / 0.9);
        this.proc.material.opacity = this.fade;
        if (this.fade === 0) { this.spin.remove(this.proc); disposeDeep(this.proc); this.proc = null; this.fade = undefined; }
      }

      // 4) точки: пульсация, подсветка выбранной, видимость с нашей стороны
      for (const line of this.shells || []) line.visible = state.explore === this.key;
      this.root.updateWorldMatrix(true, true);
      const center = this.root.position;
      for (const m of this.markers.values()) {
        const show = (!m.site.explore || !!state.explore) && (!m.site.alt || state.explore === this.key);   // дополнительные точки — только в режиме «Исследовать»
        if (m.group.visible !== show) m.group.visible = show;
        if (!show) { m.facing = -1; continue; }
        m.group.getWorldPosition(tmpA);
        if (m.site.alt) {   // точка на кольце видна, если она перед планетой или сбоку от её диска
          const view = tmpC.copy(center).normalize(), d = tmpB.copy(tmpA).sub(center), along = d.dot(view);
          m.facing = along < 0 || d.addScaledVector(view, -along).length() > this.radius * 1.02 ? 1 : -1;
        } else m.facing = tmpB.copy(tmpA).sub(center).normalize().dot(tmpC.copy(tmpA).multiplyScalar(-1).normalize());
        const lit = m.site.id === state.selected || m.site.id === pointer.hover;
        m.grow = damp(m.grow, lit ? 1.3 : 1, 10, dt);
        m.slot.scale.setScalar(m.size * m.grow);
        const k = state.motion ? (time * (m.site.status === 'active' ? 0.75 : 0.4) + m.phase) % 1 : 0.35;
        m.pulse.scale.setScalar(m.size * (0.62 + 0.75 * k));
        m.pulse.material.opacity = (1 - k) * (lit ? 0.9 : 0.55);
        m.ring.material.opacity = lit ? 1 : 0.8;
      }

      // 5) орбитальные аппараты: полёт по орбите; за диском планеты их не выбрать
      for (const o of this.orbiters) {
        if (state.motion) o.angle += dt * Math.PI * 2 / o.cfg.period;
        o.pivot.rotation.z = o.angle;
        o.line.material.opacity = 0.12 + 0.3 * this.focus;
        o.slot.getWorldPosition(tmpA);
        tmpB.copy(tmpA).project(camera);
        const sx = (tmpB.x + 1) / 2 * view.w, sy = (1 - tmpB.y) / 2 * view.h;
        o.behind = tmpA.length() > center.length() && Math.hypot(sx - this.screen.x, sy - this.screen.y) < this.screen.r;
        o.screen = { x: sx, y: sy };
        o.grow = damp(o.grow, `orb:${o.cfg.id}` === pointer.hover ? 1.35 : 1, 10, dt);
        o.slot.scale.setScalar(o.size * o.grow);
      }
    }
  }
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();

  /* ---------- Ключевые кадры: где стоят планеты в каждой секции ----------
     x, y — центр планеты на экране (от −1 до 1 от центра), size — радиус в долях высоты экрана.
     Порядок секций: интро → Луна → Марс → итоги. */
  let frames = { moon: [], mars: [] }, exFrames = { moon: {}, mars: {} };   // exFrames — режим «Исследовать»: выбранная планета справа от панели
  const sameDistance = moonSize => {   // размер Марса на том же расстоянии от камеры, что и Луна
    const d = SETTINGS.radius.moon * Math.sqrt(1 + 1 / Math.pow(2 * moonSize * tanHalf, 2));
    return 0.5 * SETTINGS.radius.mars / Math.sqrt(d * d - SETTINGS.radius.mars ** 2) / tanHalf;
  };
  function computeFrames() {
    const { w, h, aspect } = view, { pad, colW, free } = layout;   // free — свободное место сбоку от колонки с карточками
    const F = (x, y, size) => ({ x, y, size });
    if (layout.wide) {                                      // широкий экран: планета рядом с карточкой
      const r = Math.min(0.37 * h, free * 0.47), cx = pad + colW + 28 + free / 2, fx = (cx - w / 2) / (w / 2), fs = r / h;
      // интро — выбор планеты: Луна и Марс крупно, рядом, в одном масштабе
      const introMoon = Math.min(0.15, 0.092 * aspect), endMoon = 0.06;
      frames = {
        moon: [F(-0.44, -0.2, introMoon), F(fx, -0.03, fs), F(-0.84, 0.7, 0.026), F(-0.74, 0.5, endMoon)],
        mars: [F(0.4, -0.08, sameDistance(introMoon)), F(0.84, 0.7, 0.05), F(-fx, -0.03, fs), F(0.74, 0.42, sameDistance(endMoon))],
      };
      const panel = Math.min(26.5 * 16, w - 24) + 12, ecx = (panel + w) / 2, er = Math.min(0.4 * h, (w - panel) * 0.4), ex = F((ecx - w / 2) / (w / 2), -0.02, er / h);
      exFrames = { moon: { moon: ex, mars: F(0.86, 0.72, 0.05) }, mars: { mars: ex, moon: F(0.88, 0.74, 0.026) } };
    } else {                                                // узкий экран: планета сверху, карточки проезжают под ней
      const fs = Math.min(0.2, 0.42 * aspect), introMoon = Math.min(0.082, 0.17 * aspect), endMoon = 0.045;
      frames = {
        moon: [F(-0.5, -0.1, introMoon), F(0, 0.44, fs), F(-0.66, 0.8, 0.016), F(-0.5, 0.76, endMoon)],
        mars: [F(0.22, -0.52, sameDistance(introMoon)), F(0.66, 0.8, 0.027), F(0, 0.44, fs), F(0.44, 0.7, sameDistance(endMoon))],
      };
      const es = Math.min(0.19, 0.4 * aspect);   // над нижней панелью каталога
      exFrames = { moon: { moon: F(0, 0.5, es), mars: F(0.7, 0.86, 0.027) }, mars: { mars: F(0, 0.5, es), moon: F(-0.7, 0.86, 0.016) } };
    }
  }
  function resize() {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    const changed = w !== view.w || h !== view.h;
    view.w = w; view.h = h; view.aspect = w / h;
    if (changed) {
      renderer.setSize(w, h, false);
      camera.aspect = view.aspect; camera.updateProjectionMatrix();
    }
    computeFrames();
    if (changed && ready) renderer.render(scene, camera);   // сразу перерисовываем, чтобы холст не мигнул пустым кадром
  }
  let ready = false;

  /* ---------- Указатель: наведение, щелчок по точке, вращение планеты перетаскиванием ---------- */
  const pointer = { hover: null, drag: null };
  const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const activePlanet = () => planets.find(p => p.focus > 0.6) || null;
  const overDisc = (p, e) => Math.hypot(e.clientX - p.screen.x, e.clientY - p.screen.y) < p.screen.r;
  function pick(e, planet) {
    ndc.set((e.clientX / view.w) * 2 - 1, -(e.clientY / view.h) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    for (const hit of raycaster.intersectObjects(planet.hitMeshes, false)) {
      const { marker, orbiter } = hit.object.userData;
      if (marker && marker.group.visible && marker.facing > 0.08) return marker;
      if (orbiter && !orbiter.behind) return { orbiter };
    }
    return null;
  }
  on(canvas, 'pointerdown', e => {
    const planet = activePlanet();
    if (planet && overDisc(planet, e)) { pointer.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0, planet }; canvas.setPointerCapture?.(e.pointerId); }
    else pointer.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0, planet: null };
  });
  on(canvas, 'pointermove', e => {
    const d = pointer.drag;
    if (d && d.id === e.pointerId) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y; d.x = e.clientX; d.y = e.clientY; d.moved += Math.abs(dx) + Math.abs(dy);
      if (d.planet && d.moved > 5) {
        const k = 1 / d.planet.screen.r;
        d.planet.yaw += dx * k; d.planet.yawTarget = d.planet.yaw;
        d.planet.pitchTarget = clamp(d.planet.pitchTarget + dy * k, -1.1, 1.1);
        d.planet.follow = null; markHinted();
        canvas.style.cursor = 'grabbing';
      }
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const planet = activePlanet(), m = planet ? pick(e, planet) : null;
    pointer.hover = m ? (m.orbiter ? `orb:${m.orbiter.cfg.id}` : m.site.id) : null;
    canvas.style.cursor = m ? 'pointer' : planet && overDisc(planet, e) ? 'grab' : planets.some(p => p.focus < 0.3 && overDisc(p, e)) ? 'pointer' : '';
  });
  const endDrag = e => {
    const d = pointer.drag; if (!d || d.id !== e.pointerId) return;
    pointer.drag = null; canvas.style.cursor = '';
    if (e.type !== 'pointerup' || d.moved > 5) return;
    const planet = activePlanet(), m = planet ? pick(e, planet) : null;       // это был щелчок, а не перетаскивание
    if (m?.orbiter) { location.hash = `#/missions/${m.orbiter.cfg.mission}`; return; }   // орбитальный аппарат → его страница
    if (m && state.explore) { exploreSelect(m.site.id, { from: 'globe' }); return; }   // в каталоге планеты — выбрать запись в списке
    if (m) { openDossier(m.site.id, { focus: false }); return; }
    if (!planet) {                                                            // в интро и в итогах щелчок по планете ведёт к её главе
      const far = planets.find(p => overDisc(p, e));
      if (far && window.scrollY < viewH * 0.5) location.hash = `#/explore/${far.key}`;   // выбор планеты → её каталог и сцена
      else if (far) document.getElementById(far.key).scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  };
  on(canvas, 'pointerup', endDrag); on(canvas, 'pointercancel', endDrag);
  on(canvas, 'pointerleave', () => { pointer.hover = null; });

  /* ---------- Подписи к точкам ---------- */
  const labelBox = $('#labels'), labels = new Map();
  function relabel() {
    for (const s of SITES) {
      let el = labels.get(s.id);
      if (!el) { el = document.createElement('div'); el.className = 'site-label'; labelBox.append(el); labels.set(s.id, el); }
      el.textContent = L(s.name);
      const y = document.createElement('small'); y.textContent = s.years; el.append(y);
      if (s.desc) { const d = document.createElement('span'); d.className = 'lbl-desc'; d.textContent = L(s.desc); el.append(d); el.classList.add('has-desc'); }
      el._w = 0; el._h = 0;
    }
    for (const o of ORBITERS) {
      let el = labels.get(`orb:${o.id}`);
      if (!el) { el = document.createElement('div'); el.className = 'site-label orbit-label'; labelBox.append(el); labels.set(`orb:${o.id}`, el); }
      el.textContent = L(o.label);
      const y = document.createElement('small'); y.textContent = o.years; el.append(y);
      el._w = 0; el._h = 0;
    }
  }
  const hint = $('#hint');
  let picks = null;   // создаются при первом кадре, когда планеты уже есть
  function updatePicks(p) {
    picks ??= planets.map(pl => ({ planet: pl, el: $(`#pick-${pl.key}`), on: null }));
    const show = !state.explore && p < 0.3;        // кнопки видны только на экране выбора планеты
    for (const k of picks) {
      if (!k.el) continue;
      if (show !== k.on) { k.on = show; k.el.classList.toggle('is-on', show); k.el.tabIndex = show ? 0 : -1; }
      if (!show) continue;
      const { x, y, r } = k.planet.screen;
      const w = k.el.offsetWidth || 160, left = Math.max(8, Math.min(view.w - w - 8, x - w / 2));   // кнопка не выходит за край экрана
      k.el.style.transform = `translate3d(${left.toFixed(1)}px, ${Math.min(view.h - 60, y + r + 14).toFixed(1)}px, 0)`;
    }
  }
  function updateLabels() {
    const active = activePlanet();
    hint.style.visibility = active && active.focus > 0.92 ? 'visible' : 'hidden';   // пока планеты летят — подсказку прячем
    if (active && hint.style.opacity === '1') {   // подсказка держится у нижнего края планеты
      const y = layout.wide ? Math.min(view.h - 44, active.screen.y + active.screen.r + 12) : 64;   // на узком экране — под шапкой
      hint.style.transform = `translate3d(calc(${active.screen.x.toFixed(0)}px - 50%), ${y.toFixed(0)}px, 0)`;
    }
    for (const planet of planets) for (const m of planet.markers.values()) {
      const el = labels.get(m.site.id);
      const wanted = m.group.visible && ((m.site.hero && !state.explore) || m.site.id === state.selected || m.site.id === pointer.hover);
      const alpha = wanted ? clamp((planet.focus - 0.55) / 0.3, 0, 1) * clamp((m.facing - 0.1) / 0.2, 0, 1) : 0;
      if (alpha <= 0.01) { if (el._on) { el.style.opacity = '0'; el._on = false; } continue; }
      m.group.getWorldPosition(tmpA).project(camera);
      const x = (tmpA.x + 1) / 2 * view.w, y = (1 - tmpA.y) / 2 * view.h;
      el._w ||= el.offsetWidth; el._h ||= el.offsetHeight;
      const gap = m.size * 0.7 * planet.screen.r / planet.radius + 8;            // подпись стоит сбоку от кольца, не закрывая модель
      const left = x + gap + el._w > view.w - 8 ? x - gap - el._w : x + gap;
      el.style.transform = `translate3d(${left.toFixed(1)}px, ${(y - el._h / 2).toFixed(1)}px, 0)`;
      el.style.opacity = alpha.toFixed(2); el._on = true;
    }
    for (const planet of planets) for (const o of planet.orbiters) {
      const el = labels.get(`orb:${o.cfg.id}`);
      const alpha = o.behind ? 0 : clamp((planet.focus - 0.6) / 0.3, 0, 1) * (`orb:${o.cfg.id}` === pointer.hover ? 1 : 0.85);
      if (alpha <= 0.01) { if (el._on) { el.style.opacity = '0'; el._on = false; } continue; }
      el._w ||= el.offsetWidth; el._h ||= el.offsetHeight;
      const gap = o.size * planet.screen.r / planet.radius + 6;
      const left = o.screen.x + gap + el._w > view.w - 8 ? o.screen.x - gap - el._w : o.screen.x + gap;
      el.style.transform = `translate3d(${left.toFixed(1)}px, ${(o.screen.y - el._h / 2).toFixed(1)}px, 0)`;
      el.style.opacity = alpha.toFixed(2); el._on = true;
    }
  }

  /* ---------- Создаём планеты и запускаем загрузку моделей ---------- */
  resize();
  const planets = [new Planet('moon'), new Planet('mars')];
  const byKey = { moon: planets[0], mars: planets[1] };
  relabel();

  // Загрузка моделей планет с общим индикатором
  const progress = { moon: [0, 0], mars: [0, 0] };
  const showProgress = () => {
    const loaded = progress.moon[0] + progress.mars[0], total = progress.moon[1] + progress.mars[1];
    setLoader(total ? t('load', { p: Math.min(99, Math.round(loaded / total * 100)) }) : t('loadPlain'));
  };
  if (planets.some(p => p.cfg.model)) setLoader(t('loadPlain'));
  Promise.all(planets.map(p => p.load(e => { progress[p.key] = [e.loaded || 0, e.total || 0]; showProgress(); }))).then(results => {
    if (results.every(r => r === 'model')) setLoader(null);
    else if (results.includes('procedural')) setLoader(t(location.protocol === 'file:' ? 'loadFile' : 'loadFail'), 9000);
    else setLoader(null);
  });

  // Загрузка моделей техники: если файл есть — он заменяет заглушку.
  // Модели грузятся только когда планета впервые выходит крупным планом. При «экономии трафика»
  // остаются заглушки, а на узком экране не грузятся самые тяжёлые файлы (подробно модель видна на странице миссии).
  const hardwareDone = new Set();
  const saveData = !!navigator.connection?.saveData, narrow = matchMedia('(max-width: 40rem)').matches;
  async function loadHardware(planet) {
    if (hardwareDone.has(planet.key)) return;
    hardwareDone.add(planet.key);
    if (saveData) { console.info('[Vestige] Режим экономии трафика: на глобусах остаются заглушки.'); return; }
    const missing = new Set();
    const fitInto = (slot, gltf, cfg, ground) => {
      const obj = gltf.scene.clone(true);
      // масштабируем модель под размер заглушки и ставим её «на землю» (или в центр — для орбитальных аппаратов)
      const box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
      const fit = new THREE.Group();
      obj.position.set(-center.x, ground ? -box.min.y : -center.y, -center.z);
      fit.add(obj);
      fit.scale.setScalar((cfg.scale ?? 1) / Math.max(size.x, size.y, size.z, 1e-6));
      fit.rotation.y = cfg.rotationY ?? 0;
      const keep = slot.children.filter(c => c.isMesh && c.userData.orbiter);    // невидимая зона нажатия остаётся
      slot.clear(); slot.add(fit, ...keep);   // заглушку убираем (её геометрия общая — освободится при закрытии страницы)
    };
    const jobs = [...planet.markers.values()].map(async m => {
      const cfg = ASSETS.hardware[m.site.kind] || {}, id = SITE_MODELS[m.site.id];
      const urls = id ? assetUrls(id) : [cfg.model].filter(Boolean);
      if (!urls.length || (id && narrow && ASSET[id].optimizedSize > 1.2e6)) return;
      try { fitInto(m.slot, await loadAny(urls), cfg, true); } catch { missing.add(urls[0]); }
    });
    for (const o of planet.orbiters) jobs.push((async () => {
      const urls = assetUrls(o.cfg.asset);
      try { fitInto(o.slot, await loadAny(urls), { scale: 1.6 }, false); } catch { missing.add(urls[0]); }
    })());
    await Promise.all(jobs);
    if (missing.size) console.info(`[Vestige] Модели техники не найдены, стоят заглушки: ${[...missing].join(', ')}`);
  }

  /* ---------- Какая карточка сейчас в центре экрана: к её точке поворачиваем планету ---------- */
  const cardWatcher = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const planet = byKey[en.target.closest('section').id]; if (!planet) continue;
      planet.zoomTarget = Number(en.target.dataset.zoom) || 1;          // у некоторых карточек планета чуть крупнее
      if (en.target.dataset.site && !state.selected) planet.focusSite(en.target.dataset.site);
    }
  }, { rootMargin: '-45% 0px -45% 0px' });
  $$('#moon .plate, #mars .plate').forEach(el => cardWatcher.observe(el));

  /* ---------- Главный цикл ---------- */
  let raf = 0, last = performance.now(), smoothY = window.scrollY, starDrift = 0, firstFocus = { moon: false, mars: false };
  let paused = false;
  const ex = { key: null, e: 0 };   // key — исследуемая планета; e — 0…1, насколько завершён переход к ней
  function frame(now) {
    if (paused) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    // плавная прокрутка: сцена «догоняет» window.scrollY линейной интерполяцией
    smoothY = reducedMotion.matches ? window.scrollY : damp(smoothY, window.scrollY, SETTINGS.scrollLerp, dt);
    // режим «Исследовать»: планета летит из кадра выбора (0) прямо в свой кадр крупного плана, минуя чужую главу
    if (state.explore) ex.key = state.explore;
    ex.e = reducedMotion.matches ? (state.explore ? 1 : 0) : damp(ex.e, state.explore ? 1 : 0, 3.4, dt);
    if (!state.explore && ex.e < 0.01) { ex.e = 0; ex.key = null; }
    let p;
    if (ex.key) {
      const target = ex.key === 'moon' ? 1 : 2, f = smooth(Math.min(1, ex.e));
      p = target * f;
      updatePicks(1);
      for (const planet of planets) {
        planet.focus = planet.key === ex.key ? f : 0;
        if (planet.focus > 0.5) loadHardware(planet);
        planet.update(frames[planet.key][0], exFrames[ex.key][planet.key], f, dt, now / 1000);
      }
    } else {
      // p: 0 — выбор планеты, 1 — Луна, 2 — Марс, 3 — итоги; дробное — переход между ними
      p = sceneParam(smoothY);
      const i = Math.min(2, Math.floor(p)), f = p - i;
      updatePicks(p);
      for (const planet of planets) {
        planet.focus = Math.max(0, 1 - Math.abs(p - (planet.key === 'moon' ? 1 : 2)));
        if (planet.focus > 0.5 && !firstFocus[planet.key]) { firstFocus[planet.key] = true; planet.focusSite(SITES.find(s => s.world === planet.key && s.hero).id); loadHardware(planet); }
        planet.update(frames[planet.key][i], frames[planet.key][i + 1], f, dt, now / 1000);
      }
    }
    if (state.motion) starDrift += dt * 0.004;
    stars.rotation.y = -p * 0.1 + starDrift;
    stars.rotation.x = p * 0.04;
    renderer.render(scene, camera);
    updateLabels();
  }
  ready = true;
  raf = requestAnimationFrame(frame);

  /* ---------- Очистка: освобождаем память, когда страница закрывается ---------- */
  function destroy() {
    cancelAnimationFrame(raf);
    cardWatcher.disconnect();
    disposeDeep(scene);
    Object.values(GEO).forEach(g => g.dispose()); Object.values(MAT).forEach(m => m.dispose());
    [dotGeo, ringGeo, hitGeo, starSprite].forEach(x => x.dispose());
    draco.dispose();
    renderer.dispose();
    renderer.forceContextLoss?.();
  }

  // Пауза: пока открыт раздел сайта поверх рассказа, сцену не рисуем — экономим батарею
  function pause(on) {
    if (on === paused) return;
    paused = on;
    if (on) cancelAnimationFrame(raf);
    else { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  return {
    resize,
    relabel,
    destroy,
    pause,
    focusSite: id => { const site = SITE[id]; if (site) byKey[site.world]?.focusSite(id); },   // повернуть планету к точке
    exploreCut: () => { ex.e = 0; ex.key = null; },   // выйти из режима «Исследовать» без обратной анимации
    loadAsset: id => loadAny(assetUrls(id)),   // загрузить модель из реестра (для 3D-просмотра на странице миссии)
    buildHardware: kind => PLACEHOLDER[kind]?.() || null,   // упрощённая модель аппарата (для страниц значимых миссий)
    paintPlanet,   // нарисованная поверхность планеты (для глобусов на экране заставки)
    // выбрать точку: повернуть к ней планету (или снять выбор, если id пустой)
    select(id) {
      const site = SITE[id];
      if (site) byKey[site.world].focusSite(id, 0.12, 0.4);
      else for (const p of planets) if (p.follow && p.lift) p.focusSite(p.follow);      // досье закрыто — возвращаем точку в центр
    },
    // для отладки и тестов
    debug: { THREE, scene, camera, planets, renderer },
  };
}

const stageReady = init3D().then(s => {
  stage = s;
  if (!s) { setWorld(state.world); $('#hint').style.opacity = '0'; }
  else if (document.documentElement.classList.contains('page-open') || document.documentElement.classList.contains('lab-open')) s.pause(true);   // сайт открыли сразу на разделе или на заставке
  return s;
});

// Закрытие страницы: снимаем обработчики и чистим сцену (если страница уходит в кэш «назад-вперёд», ничего не трогаем)
window.addEventListener('pagehide', e => {
  if (e.persisted) return;
  ac.abort(); layoutWatcher.disconnect();
  stage?.destroy(); stage = null;
});
// Для ручной очистки, если страницу встроят в другое приложение
window.vestige = window.forgottenMachines = { destroy() { ac.abort(); layoutWatcher.disconnect(); stage?.destroy(); stage = null; }, get stage() { return stage; } };
