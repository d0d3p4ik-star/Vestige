/* =====================================================================================
   ПРОФИЛИ МИССИЙ (Луна). Тексты на трёх языках: en — английский (основной), ru, kk.
   Классификация разделена: outcome — итог миссии; op — состояние работы; phys — где
   техника физически; still — «Всё ещё там» (только если есть данные, что аппарат на месте).
   Каждое важное утверждение ссылается на id из REF_LIST.
   ===================================================================================== */
const T = (en, ru, kk) => ({ en, ru, kk });
const MISSIONS = [];
const M = m => MISSIONS.push(m);

M({
  id: 'luna-2', site: 'luna2', planet: 'moon', model: null,
  name: T('Luna 2', 'Луна-2', 'Луна-2'), agency: 'OKB-1', country: 'USSR', type: 'impactor',
  launch: '1959-09-12', arrive: '1959-09-13', end: '1959-09-13', outcome: 'success', op: 'completed', phys: 'controlled', still: true,
  coords: { lat: 29.1, lon: 0, conf: 'approximate', ref: 'nssdc-luna2' },
  obj: T('Reach the Moon — no spacecraft had ever touched another world — and measure radiation and magnetic fields on the way.',
    'Долететь до Луны — до этого ни один аппарат не касался другого мира — и по пути измерить радиацию и магнитное поле.',
    'Айға жету — бұған дейін ешбір аппарат басқа әлемге жетпеген — және жолда радиация мен магнит өрісін өлшеу.'),
  tl: [
    ['1959-09-12', T('Launch from Tyuratam (Baikonur)', 'Запуск с Тюратама (Байконур)', 'Тюратамнан (Байқоңыр) ұшырылды'), 'nssdc-luna2'],
    ['1959-09-13', T('Impact east of the Sea of Rains; radio signals stop at 21:02 UTC', 'Удар к востоку от Моря Дождей; сигнал пропал в 21:02 UTC', 'Жаңбыр теңізінің шығысына соқтығысты; сигнал 21:02 UTC-де жоғалды'), 'nssdc-luna2'],
    ['1959-09-15', T('Khrushchev presents Eisenhower with a replica of the pennant', 'Хрущёв дарит Эйзенхауэру копию вымпела', 'Хрущев Эйзенхауэрге вымпелдің көшірмесін сыйлады'), 'whha-khrushchev'],
  ],
  imp: {
    sci: [T('Its magnetometer found no measurable magnetic field near the Moon.', 'Магнитометр не нашёл у Луны заметного магнитного поля.', 'Магнитометр Ай маңынан байқалатын магнит өрісін таппады.'), ['nssdc-luna2', 'siddiqi2018']],
    tech: [T('Showed that a spacecraft could be guided across 384,000 km to hit a chosen target.', 'Показала, что аппарат можно провести через 384 тысячи километров точно к цели.', 'Аппаратты 384 мың шақырымнан нысанаға дәл жеткізуге болатынын көрсетті.'), ['siddiqi2018']],
    fut: [T('Opened the Luna series, which later made the first soft landing (Luna 9) and carried the first rover (Luna 17).', 'Открыла серию «Луна», в которой позже были первая мягкая посадка («Луна-9») и первый луноход («Луна-17»).', '«Луна» сериясын ашты: кейін алғашқы жұмсақ қону («Луна-9») мен алғашқы луноход («Луна-17») болды.'), ['siddiqi2018']],
    hist: [T('The first human-made object to reach another celestial body.', 'Первый рукотворный предмет, достигший другого небесного тела.', 'Басқа аспан денесіне жеткен адам қолымен жасалған алғашқы зат.'), ['nssdc-luna2', 'siddiqi2018']],
    edu: [T('Its pennants became symbols of the space race; a replica was given to the US president.', 'Её вымпелы стали символом космической гонки; копию подарили президенту США.', 'Оның вымпелдері ғарыш жарысының символына айналды; көшірмесі АҚШ президентіне сыйланды.'), ['whha-khrushchev']],
  },
  chg: [T('From September 1959, another world was no longer out of reach.', 'С сентября 1959 года другой мир перестал быть недосягаемым.', '1959 жылғы қыркүйектен бастап басқа әлем қолжетімсіз болудан қалды.'), ['siddiqi2018']],
  val: [T('One small probe answered a basic question — could we reach the Moon? — and made the first measurement of its magnetism on the spot.', 'Небольшой зонд ответил на главный вопрос — можно ли долететь до Луны — и впервые измерил её магнетизм на месте.', 'Шағын зонд басты сұраққа жауап берді — Айға жетуге бола ма — және оның магнетизмін алғаш рет орнында өлшеді.'), ['nssdc-luna2']],
  ver: {
    ok: T('Reached the Moon and sent data until impact.', 'Достигла Луны и передавала данные до удара.', 'Айға жетіп, соққыға дейін дерек жіберді.'),
    no: T('No pictures or surface data: it was built to crash.', 'Ни снимков, ни данных с поверхности: она была создана для удара.', 'Сурет те, беттен дерек те жоқ: ол соқтығысу үшін жасалған.'),
    top: T('First contact with another world.', 'Первое касание другого мира.', 'Басқа әлемге алғашқы жанасу.'),
    why: T('This is where humanity’s footprint on other worlds begins.', 'С неё начинается след человечества на других мирах.', 'Адамзаттың басқа әлемдердегі ізі осыдан басталады.'),
  },
  art: [T('Fragments of the probe and its pennants lie in the impact area; the exact point is known only approximately.', 'Обломки зонда и вымпелы лежат в районе падения; точное место известно лишь приблизительно.', 'Зондтың сынықтары мен вымпелдер құлаған аймақта жатыр; нақты орны шамамен ғана белгілі.'), ['nssdc-luna2']],
  cost: [],
});

M({
  id: 'surveyor-3', site: 'surveyor3', planet: 'moon', model: null,
  name: T('Surveyor 3', 'Сервейер-3', 'Сервейер-3'), agency: 'NASA / JPL', country: 'USA', type: 'lander',
  launch: '1967-04-17', arrive: '1967-04-20', end: null, outcome: 'success', op: 'completed', phys: 'soft', still: true,
  coords: { lat: -3.0162, lon: -23.418, conf: 'confirmed', ref: 'lroc-938' },
  obj: T('Test a soft landing and study the lunar soil to show where Apollo astronauts could land safely.', 'Отработать мягкую посадку и изучить лунный грунт, чтобы понять, где смогут безопасно сесть «Аполлоны».', 'Жұмсақ қонуды сынап, «Аполлондар» қауіпсіз қона алатын жерді анықтау үшін Ай топырағын зерттеу.'),
  tl: [
    ['1967-04-17', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-surveyor3'],
    ['1967-04-20', T('Landing in the Ocean of Storms; trenches dug with a scoop', 'Посадка в Океане Бурь; ковш роет траншеи', 'Дауылдар мұхитына қонды; шөміш ор қазды'), 'nasa-surveyor3'],
    ['1969-11-20', T('Apollo 12 astronauts remove its TV camera, scoop and cables', 'Астронавты «Аполлона-12» снимают телекамеру, ковш и кабели', '«Аполлон-12» астронавтары телекамераны, шөмішті және кабельдерді шешіп алды'), 'nasa-a12-s3'],
    ['1972', T('NASA publishes the analysis of the returned parts', 'NASA публикует анализ возвращённых деталей', 'NASA қайтарылған бөлшектердің талдауын жариялады'), 'ntrs-sp284'],
  ],
  imp: {
    sci: [T('Its scoop dug trenches and showed how firm the lunar soil is.', 'Ковш вырыл траншеи и показал, насколько прочен лунный грунт.', 'Шөміш ор қазып, Ай топырағының қаншалықты берік екенін көрсетті.'), ['nasa-surveyor3']],
    tech: [T('Parts brought home by Apollo 12 showed what 31 months on the Moon do to materials.', 'Детали, привезённые «Аполлоном-12», показали, что 31 месяц на Луне делает с материалами.', '«Аполлон-12» әкелген бөлшектер Айда өткен 31 айдың материалдарға әсерін көрсетті.'), ['ntrs-sp284']],
    fut: [T('Surveyor landings helped NASA prepare the Apollo landings.', 'Посадки «Сервейеров» помогли NASA подготовить высадки «Аполлонов».', '«Сервейерлердің» қонуы NASA-ға «Аполлон» қонуларын дайындауға көмектесті.'), ['lpi-surveyor']],
    hist: [T('The only robot on another world that people have visited.', 'Единственный робот на другом небесном теле, к которому пришли люди.', 'Басқа аспан денесінде адамдар барған жалғыз робот.'), ['footpads2019', 'nasa-a12-s3']],
    edu: [T('The TV camera returned by Apollo 12 is shown at the Smithsonian National Air and Space Museum.', 'Телекамера, которую привёз «Аполлон-12», хранится в Национальном музее авиации и космонавтики США.', '«Аполлон-12» әкелген телекамера АҚШ-тың Ұлттық авиация және ғарыш музейінде тұр.'), ['nasa-a12-s3']],
  },
  chg: [T('Surveyor showed that the lunar surface could carry a spacecraft — and Surveyor 3 later became a long-term test of hardware on the Moon.', '«Сервейеры» показали, что лунный грунт выдержит аппарат, а «Сервейер-3» стал долгим испытанием техники на Луне.', '«Сервейерлер» Ай топырағы аппаратты көтере алатынын көрсетті, ал «Сервейер-3» Айдағы техниканың ұзақ сынағына айналды.'), ['lpi-surveyor', 'ntrs-sp284']],
  val: [T('Five successful landings out of seven gave Apollo the ground truth it needed; Surveyor 3 also became an unplanned materials experiment.', 'Пять удачных посадок из семи дали «Аполлону» нужные данные о грунте, а «Сервейер-3» стал ещё и незапланированным опытом с материалами.', 'Жеті қонудың бесеуі сәтті болып, «Аполлонға» қажетті деректер берді; «Сервейер-3» материалдармен жоспарланбаған тәжірибеге де айналды.'), ['lpi-surveyor', 'ntrs-sp284']],
  ver: {
    ok: T('Landed softly, sent pictures and dug into the soil.', 'Мягко сел, передал снимки и копал грунт.', 'Жұмсақ қонып, суреттер жіберді және топырақ қазды.'),
    no: T('No missed objective is documented in our sources.', 'Невыполненных задач в наших источниках не указано.', 'Біздің дереккөздерде орындалмаған міндет көрсетілмеген.'),
    top: T('Showed that the Apollo landing surface was firm enough.', 'Показал, что грунт достаточно прочен для «Аполлонов».', 'Топырақтың «Аполлондар» үшін жеткілікті берік екенін көрсетті.'),
    why: T('People came back to it — the only robot ever visited on another world.', 'К нему пришли люди — это единственный такой робот на другом небесном теле.', 'Оған адамдар келді — басқа аспан денесіндегі осындай жалғыз робот.'),
  },
  art: [T('The lander still stands in the Ocean of Storms, without the TV camera and scoop that Apollo 12 took home.', 'Аппарат по-прежнему стоит в Океане Бурь — без телекамеры и ковша, которые увёз «Аполлон-12».', 'Аппарат әлі Дауылдар мұхитында тұр — «Аполлон-12» алып кеткен телекамера мен шөмішсіз.'), ['nasa-a12-s3', 'lroc-938']],
  cost: [{ amt: 469e6, cur: 'USD', yr: T('1960s, then-year dollars', '1960-е, в ценах тех лет', '1960 жылдар, сол кездегі бағамен'), scope: T('Entire Surveyor programme: seven spacecraft (1960–1968) — not Surveyor 3 alone', 'Вся программа «Сервейер»: семь аппаратов (1960–1968), а не только «Сервейер-3»', 'Бүкіл «Сервейер» бағдарламасы: жеті аппарат (1960–1968), тек «Сервейер-3» емес'), conf: 'official', ref: 'ntrs-sp4901' }],
});

M({
  id: 'apollo-11', site: 'apollo11', planet: 'moon', model: 'apollo-lunar-module',
  name: T('Apollo 11', 'Аполлон-11', 'Аполлон-11'), agency: 'NASA', country: 'USA', type: 'crewed',
  launch: '1969-07-16', arrive: '1969-07-20', end: '1969-07-24', outcome: 'success', op: 'completed', phys: 'soft', still: true,
  coords: { lat: 0.67416, lon: 23.47314, conf: 'confirmed', ref: 'lroc-fs59' },
  obj: T('Land people on the Moon and bring them safely home — the goal set by President Kennedy in 1961.', 'Высадить людей на Луну и вернуть их домой — цель, поставленная президентом Кеннеди в 1961 году.', 'Адамдарды Айға қондырып, үйге аман қайтару — 1961 жылы президент Кеннеди қойған мақсат.'),
  tl: [
    ['1961-05-25', T('Kennedy sets the goal of a lunar landing', 'Кеннеди ставит цель высадиться на Луну', 'Кеннеди Айға қону мақсатын қойды'), 'nasa-a11-overview'],
    ['1969-07-16', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-a11'],
    ['1969-07-20', T('Eagle lands at Tranquility Base', 'Модуль «Игл» садится на базе Спокойствия', '«Игл» модулі Тыныштық базасына қонды'), 'nasa-a11-overview'],
    ['1969-07-21', T('First steps on the Moon', 'Первые шаги по Луне', 'Айдағы алғашқы қадамдар'), 'nasa-a11-overview'],
    ['1969-07-24', T('Splashdown in the Pacific', 'Приводнение в Тихом океане', 'Тынық мұхитқа қонды'), 'nasa-a11'],
  ],
  imp: {
    sci: [T('Brought back the first lunar rocks and soil for laboratory study.', 'Привёз первые лунные камни и грунт для лабораторий.', 'Зертханаларға алғашқы Ай тастары мен топырағын әкелді.'), ['lspet1969']],
    tech: [T('Left a laser reflector that observatories still use to measure the Earth–Moon distance.', 'Оставил лазерный отражатель, по которому до сих пор измеряют расстояние до Луны.', 'Жер мен Ай арақашықтығын әлі өлшеп жүрген лазерлік шағылыстырғыш қалдырды.'), ['ntrs-sp214', 'jpl-llr']],
    fut: [T('Its laser reflector started a measurement series that has run for more than 50 years.', 'Его отражатель начал серию измерений, которая идёт больше 50 лет.', 'Оның шағылыстырғышы 50 жылдан астам жалғасып келе жатқан өлшеулерді бастады.'), ['jpl-llr', 'dickey1994']],
    hist: [T('The first time humans walked on another world (20–21 July 1969).', 'Впервые люди прошли по другому миру (20–21 июля 1969 года).', 'Адамдар алғаш рет басқа әлемде жүрді (1969 жылғы 20–21 шілде).'), ['nasa-a11-overview']],
    edu: [T('The plaque on the landing stage says the crew “came in peace for all mankind”.', 'На табличке посадочной ступени написано, что экипаж пришёл «с миром от имени всего человечества».', 'Қону сатысындағы тақтайшада экипаж «бүкіл адамзат атынан бейбітшілікпен келді» деп жазылған.'), ['nasa-a11-overview']],
  },
  chg: [T('After Apollo 11, landing people on another world was a proven capability, not a dream.', 'После «Аполлона-11» высадка людей на другой мир стала доказанной возможностью, а не мечтой.', '«Аполлон-11»-ден кейін адамдарды басқа әлемге қондыру арман емес, дәлелденген мүмкіндікке айналды.'), ['nasa-a11-overview']],
  val: [T('It crowned a programme that NASA reported in 1973 as costing $25.4 billion in then-year dollars; its science included the first samples and an experiment that still runs.', 'Он стал вершиной программы, стоимость которой NASA в 1973 году оценило в 25,4 млрд долларов в ценах тех лет; научный итог — первые образцы и опыт, который идёт до сих пор.', 'Ол NASA 1973 жылы сол кездегі бағамен 25,4 млрд доллар деп бағалаған бағдарламаның шыңы болды; ғылыми нәтижесі — алғашқы үлгілер және әлі жалғасып жатқан тәжірибе.'), ['dreier2019', 'lspet1969', 'jpl-llr']],
  ver: {
    ok: T('Landing, moonwalk, samples and a safe return.', 'Посадка, выход на Луну, образцы и безопасное возвращение.', 'Қону, Айда жүру, үлгілер және аман оралу.'),
    no: T('No primary objective was missed.', 'Все главные задачи выполнены.', 'Барлық негізгі міндеттер орындалды.'),
    top: T('The first people on the Moon.', 'Первые люди на Луне.', 'Айдағы алғашқы адамдар.'),
    why: T('It showed what exploration can achieve.', 'Он показал, на что способно исследование космоса.', 'Ол ғарышты зерттеудің не істей алатынын көрсетті.'),
  },
  art: [T('The descent stage of the lunar module Eagle, the laser reflector, a seismometer, a plaque and a fallen flag remain at Tranquility Base.', 'На базе Спокойствия остались посадочная ступень модуля «Игл», лазерный отражатель, сейсмометр, табличка и упавший флаг.', 'Тыныштық базасында «Игл» модулінің қону сатысы, лазерлік шағылыстырғыш, сейсмометр, тақтайша және құлаған ту қалды.'), ['lroc-fs59', 'lroc-537', 'ntrs-sp214']],
  cost: [
    { amt: 25.4e9, cur: 'USD', yr: T('1960–1973, then-year dollars', '1960–1973, в ценах тех лет', '1960–1973, сол кездегі бағамен'), scope: T('Entire Project Apollo as reported by NASA to Congress in 1973 — not the cost of Apollo 11 alone', 'Вся программа «Аполлон» по отчёту NASA Конгрессу в 1973 году — не стоимость одного «Аполлона-11»', 'NASA-ның 1973 жылғы Конгреске есебі бойынша бүкіл «Аполлон» бағдарламасы — тек «Аполлон-11» емес'), conf: 'official', ref: 'dreier2019' },
    { amt: 25.8e9, cur: 'USD', yr: T('1960–1973, then-year dollars', '1960–1973, в ценах тех лет', '1960–1973, сол кездегі бағамен'), scope: T('Reconstruction of Project Apollo including indirect costs (facilities, salaries, tracking)', 'Реконструкция расходов на «Аполлон» с косвенными затратами (сооружения, зарплаты, связь)', '«Аполлон» шығындарын жанама шығындармен қайта есептеу (ғимараттар, жалақы, байланыс)'), conf: 'estimate', ref: 'dreier-data' },
  ],
});

M({
  id: 'luna-17-lunokhod-1', site: 'lunokhod1', planet: 'moon', model: null,
  name: T('Luna 17 / Lunokhod 1', 'Луна-17 / Луноход-1', 'Луна-17 / Луноход-1'), agency: 'Lavochkin', country: 'USSR', type: 'rover',
  launch: '1970-11-10', arrive: '1970-11-17', end: '1971-09-14', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: 38.3151, lon: -35.0081, conf: 'confirmed', ref: 'lroc-650' },
  obj: T('Drive a remote-controlled rover across the Moon to study its soil, radiation and terrain — at first planned as a scout for Soviet cosmonaut landings.', 'Провести по Луне управляемый с Земли луноход и изучить грунт, радиацию и рельеф; сначала его задумывали как разведчика для высадки советских космонавтов.', 'Жерден басқарылатын луноходты Айда жүргізіп, топырақты, радиацияны және бедерді зерттеу; алғашында ол кеңес ғарышкерлерінің қонуына барлаушы ретінде ойластырылған.'),
  tl: [
    ['1970-11-10', T('Launch from Baikonur', 'Запуск с Байконура', 'Байқоңырдан ұшырылды'), 'nssdc-luna17'],
    ['1970-11-17', T('Luna 17 lands in the Sea of Rains; the rover drives off', '«Луна-17» садится в Море Дождей; луноход съезжает на грунт', '«Луна-17» Жаңбыр теңізіне қонды; луноход топыраққа түсті'), 'nssdc-luna17'],
    ['1971-09-14', T('Last successful communication session', 'Последний успешный сеанс связи', 'Соңғы сәтті байланыс сеансы'), 'rg2025'],
    ['1971-10-04', T('Operations officially end', 'Работа официально завершена', 'Жұмыс ресми түрде аяқталды'), 'nssdc-luna17'],
    ['2010-03-17', T('LRO images reveal the rover and its tracks', 'Луноход и колея найдены на снимках LRO', 'LRO суреттерінен луноход пен оның ізі табылды'), 'lroc-11'],
    ['2010-04-22', T('First laser echo from its reflector in almost 40 years', 'Первое лазерное эхо от отражателя почти за 40 лет', 'Шамамен 40 жылдағы шағылыстырғыштан алғашқы лазер жаңғырығы'), 'murphy2011'],
  ],
  imp: {
    sci: [T('Its probe and X-ray spectrometer measured how firm the soil is and what it is made of.', 'Пенетрометр и рентгеновский спектрометр измерили прочность и состав грунта.', 'Пенетрометр мен рентгендік спектрометр топырақтың беріктігі мен құрамын өлшеді.'), ['nssdc-lunokhod1', 'basilevsky2021']],
    tech: [T('The first wheeled robot driven remotely on another world, steered by a five-person crew through a 2.6-second round-trip delay.', 'Первый колёсный робот на другом мире, которым управлял экипаж из пяти человек при задержке сигнала 2,6 секунды туда и обратно.', 'Басқа әлемдегі алғашқы дөңгелекті робот: оны бес адамнан тұратын экипаж барып-қайту кідірісі 2,6 секунд сигналмен басқарды.'), ['nssdc-luna17', 'rg2025']],
    fut: [T('Its French-made reflector joined the lunar laser ranging network that is still in use.', 'Его французский отражатель вошёл в сеть лазерной локации Луны, которая работает до сих пор.', 'Оның француз шағылыстырғышы әлі жұмыс істеп тұрған Айды лазерлік локациялау желісіне қосылды.'), ['murphy2011', 'battat2023']],
    hist: [T('The first rover on another celestial body.', 'Первый планетоход на другом небесном теле.', 'Басқа аспан денесіндегі алғашқы планетоход.'), ['nssdc-luna17', 'siddiqi2018']],
    edu: [T('Its rediscovery in 2010 was widely reported as the return of a “lost” rover.', 'Его находку в 2010 году широко описывали как возвращение «потерянного» лунохода.', 'Оның 2010 жылы табылуы «жоғалған» луноходтың оралуы ретінде кеңінен жазылды.'), ['physorg2010']],
  },
  chg: [T('It proved that a machine driven from Earth could explore another world for months.', 'Он доказал, что управляемая с Земли машина может месяцами исследовать другой мир.', 'Ол Жерден басқарылатын машина басқа әлемді айлар бойы зерттей алатынын дәлелдеді.'), ['nssdc-luna17']],
  val: [T('In 11 lunar days it returned more than 20,000 images and over 500 soil tests — and its reflector still serves science.', 'За 11 лунных дней он передал больше 20 000 снимков и провёл больше 500 проб грунта, а его отражатель до сих пор служит науке.', '11 ай күнінде ол 20 000-нан астам сурет жіберіп, 500-ден астам топырақ сынағын жасады, ал шағылыстырғышы әлі ғылымға қызмет етеді.'), ['nssdc-luna17', 'murphy2011']],
  ver: {
    ok: T('Worked 11 lunar days instead of 3 and drove about 10 km.', 'Проработал 11 лунных дней вместо 3 и проехал около 10 км.', '3 орнына 11 ай күні жұмыс істеп, шамамен 10 км жүрді.'),
    no: T('Contact was lost in September 1971; no return was ever planned.', 'Связь пропала в сентябре 1971 года; возвращение не планировалось.', '1971 жылғы қыркүйекте байланыс үзілді; қайтару жоспарланбаған.'),
    top: T('The first rover on another world.', 'Первый планетоход на другом мире.', 'Басқа әлемдегі алғашқы планетоход.'),
    why: T('Half a century later it still sends laser light back to Earth.', 'Спустя полвека он всё ещё возвращает лазерный свет на Землю.', 'Жарты ғасырдан кейін де ол лазер сәулесін Жерге қайтарып тұр.'),
  },
  art: [T('The rover stands a few kilometres north of its landing platform in the Sea of Rains; its reflector still returns laser pulses.', 'Луноход стоит в нескольких километрах к северу от посадочной платформы в Море Дождей; его отражатель по-прежнему возвращает лазерные импульсы.', 'Луноход Жаңбыр теңізінде қону платформасынан бірнеше шақырым солтүстікте тұр; оның шағылыстырғышы лазер импульстарын әлі қайтарады.'), ['lroc-650', 'murphy2011']],
  cost: [],
});

M({
  id: 'luna-21-lunokhod-2', site: 'lunokhod2', planet: 'moon', model: null,
  name: T('Luna 21 / Lunokhod 2', 'Луна-21 / Луноход-2', 'Луна-21 / Луноход-2'), agency: 'Lavochkin', country: 'USSR', type: 'rover',
  launch: '1973-01-08', arrive: '1973-01-15', end: '1973-05-10', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: 25.83, lon: 30.914, conf: 'confirmed', ref: 'lroc-699' },
  obj: T('Explore a varied area at the edge of the Sea of Serenity with an improved rover, sending images and measuring soil, magnetic fields and radiation.', 'Исследовать разнообразный район на краю Моря Ясности на улучшенном луноходе: снимать, измерять грунт, магнитное поле и радиацию.', 'Жетілдірілген луноходпен Айқындық теңізінің шетіндегі әртүрлі аймақты зерттеу: суретке түсіру, топырақты, магнит өрісі мен радиацияны өлшеу.'),
  tl: [
    ['1973-01-08', T('Launch', 'Запуск', 'Ұшырылды'), 'nssdc-luna21'],
    ['1973-01-15', T('Landing in Le Monnier crater', 'Посадка в кратере Лемонье', 'Лемонье кратеріне қонды'), 'nssdc-luna21'],
    ['1973-05-10', T('Contact lost', 'Связь потеряна', 'Байланыс үзілді'), 'smithsonian-lk2'],
    ['1993-12', T('Rover and lander sold at Sotheby’s to Richard Garriott', 'Луноход и платформа проданы на Sotheby’s Ричарду Гэрриоту', 'Луноход пен платформа Sotheby’s аукционында Ричард Гэрриотқа сатылды'), 'space-garriott'],
    ['2014-07', T('Opportunity passes its distance record', 'Opportunity обгоняет его рекорд дальности', 'Opportunity оның қашықтық рекордын басып озды'), 'jpl-record2014'],
  ],
  imp: {
    sci: [T('Measured soil, magnetic fields and light along a route of about 39 km.', 'Изучал грунт, магнитное поле и освещённость на пути около 39 км.', 'Шамамен 39 км жол бойы топырақты, магнит өрісін және жарықтылықты зерттеді.'), ['karachevtseva2017', 'nssdc-luna21']],
    tech: [T('Odometry (about 37 km) and later orbital mapping (about 39 km) show how hard it is to measure distance on another world.', 'Одометр (около 37 км) и поздние карты по снимкам (около 39 км) показывают, как трудно мерить путь на другом мире.', 'Одометр (шамамен 37 км) мен кейінгі орбиталық карта (шамамен 39 км) басқа әлемде жолды өлшеудің қиындығын көрсетеді.'), ['karachevtseva2017']],
    fut: [T('Its reflector is still used for laser ranging, although it returns a weaker signal.', 'Его отражатель до сих пор используют для лазерной локации, хотя сигнал слабее.', 'Оның шағылыстырғышы лазерлік локацияда әлі қолданылады, бірақ сигналы әлсіздеу.'), ['courde2017']],
    hist: [T('Its distance record stood for 41 years, until Opportunity passed it in 2014.', 'Его рекорд дальности держался 41 год — до 2014 года, когда его обогнал Opportunity.', 'Оның қашықтық рекорды 41 жыл тұрды — 2014 жылы Opportunity басып озғанға дейін.'), ['jpl-record2014']],
    edu: [T('In 1993 it was sold at Sotheby’s, together with its lander, to game developer Richard Garriott.', 'В 1993 году его вместе с платформой продали на Sotheby’s разработчику игр Ричарду Гэрриоту.', '1993 жылы ол платформасымен бірге Sotheby’s аукционында ойын әзірлеушісі Ричард Гэрриотқа сатылды.'), ['space-garriott']],
  },
  chg: [T('It showed that a rover could cover tens of kilometres on the Moon — a distance unbeaten for four decades.', 'Он показал, что луноход может пройти по Луне десятки километров — этот результат не могли превзойти сорок лет.', 'Ол луноходтың Айда ондаған шақырым жүре алатынын көрсетті — бұл нәтижені қырық жыл бойы ешкім асыра алмады.'), ['jpl-record2014']],
  val: [T('About four months of driving produced a 39 km survey and a reflector still used today.', 'Около четырёх месяцев езды дали обзор маршрута длиной 39 км и отражатель, который служит до сих пор.', 'Шамамен төрт айлық жүріс 39 км маршрутқа шолу және әлі қызмет етіп тұрған шағылыстырғыш берді.'), ['karachevtseva2017', 'courde2017']],
  ver: {
    ok: T('Drove about 39 km and returned images and measurements.', 'Проехал около 39 км, передал снимки и измерения.', 'Шамамен 39 км жүріп, суреттер мен өлшеулер жіберді.'),
    no: T('Contact was lost on 10 May 1973, the day after the rover’s lid picked up soil inside a crater.', 'Связь пропала 10 мая 1973 года — на следующий день после того, как крышка лунохода зачерпнула грунт в кратере.', 'Байланыс 1973 жылғы 10 мамырда үзілді — луноход қақпағы кратерде топырақ ілгеннің ертеңінде.'),
    top: T('A distance record that lasted 41 years.', 'Рекорд дальности, продержавшийся 41 год.', '41 жыл тұрған қашықтық рекорды.'),
    why: T('It still reflects laser light from Earth.', 'Он всё ещё отражает лазерный свет с Земли.', 'Ол Жерден келген лазер сәулесін әлі шағылыстырады.'),
  },
  art: [T('The rover is parked about 15 km in a straight line from its lander; both have belonged to Richard Garriott since 1993.', 'Луноход стоит примерно в 15 км по прямой от посадочной платформы; с 1993 года оба принадлежат Ричарду Гэрриоту.', 'Луноход қону платформасынан түзу сызықпен шамамен 15 км жерде тұр; 1993 жылдан бері екеуі де Ричард Гэрриоттікі.'), ['lroc-699', 'space-garriott']],
  cost: [],
  costNote: T('The 1993 auction price of $68,500 for the rover and lander is a sale price, not a mission cost.', 'Цена 68 500 долларов на аукционе 1993 года — это цена продажи, а не стоимость миссии.', '1993 жылғы аукциондағы 68 500 доллар — сату бағасы, миссия құны емес.'),
  costNoteRef: 'space-garriott',
});

M({
  id: 'apollo-17', site: 'apollo17', planet: 'moon', model: 'apollo-lunar-module',
  name: T('Apollo 17', 'Аполлон-17', 'Аполлон-17'), agency: 'NASA', country: 'USA', type: 'crewed',
  launch: '1972-12-07', arrive: '1972-12-11', end: '1972-12-19', outcome: 'success', op: 'completed', phys: 'soft', still: true,
  coords: { lat: 20.1911, lon: 30.7723, conf: 'confirmed', ref: 'lroc-938' },
  obj: T('Explore the Taurus–Littrow valley for ancient highland rocks and possible volcanic deposits — the last mission of the Apollo programme.', 'Исследовать долину Таурус — Литтров: найти древние породы гор и возможные вулканические отложения. Это последняя миссия программы «Аполлон».', 'Таурус — Литтров алқабын зерттеу: көне тау жыныстары мен ықтимал жанартау шөгінділерін іздеу. Бұл «Аполлон» бағдарламасының соңғы миссиясы.'),
  tl: [
    ['1972-12-07', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-a17'],
    ['1972-12-11', T('Landing in the Taurus–Littrow valley', 'Посадка в долине Таурус — Литтров', 'Таурус — Литтров алқабына қонды'), 'nasa-a17'],
    ['1972-12-12', T('Orange soil found during the second moonwalk', 'Во время второго выхода найден оранжевый грунт', 'Екінші шығуда қызғылт сары топырақ табылды'), 'ntrs-sp330'],
    ['1972-12-14', T('Liftoff from the Moon', 'Старт с Луны', 'Айдан көтерілді'), 'nasa-a17'],
    ['1972-12-19', T('Splashdown', 'Приводнение', 'Суға қонды'), 'nasa-a17'],
  ],
  imp: {
    sci: [T('Geologist Harrison Schmitt found orange soil made of volcanic glass beads.', 'Геолог Харрисон Шмитт нашёл оранжевый грунт из вулканических стеклянных шариков.', 'Геолог Харрисон Шмитт жанартаулық шыны түйіршіктерінен тұратын қызғылт сары топырақ тапты.'), ['jsc-74220', 'ntrs-sp330']],
    tech: [T('The lunar rover carried the crew about 35.7 km on three excursions.', 'Лунный автомобиль провёз экипаж около 35,7 км за три выхода.', 'Ай автомобилі экипажды үш шығуда шамамен 35,7 км жүргізді.'), ['nasa-hist-a17']],
    fut: [T('Its samples, including the orange soil, remain a reference collection for lunar science.', 'Его образцы, включая оранжевый грунт, остаются эталонной коллекцией для изучения Луны.', 'Оның үлгілері, соның ішінде қызғылт сары топырақ, Ай ғылымы үшін эталон жинақ болып қала береді.'), ['jsc-74220']],
    hist: [T('The last time people walked on the Moon, as of 2026.', 'Последний раз, когда люди ходили по Луне (на 2026 год).', 'Адамдардың Айда соңғы рет жүруі (2026 жылғы жағдай бойынша).'), ['nasa-hist-a17']],
    edu: [T('The rover’s TV camera broadcast the liftoff from the Moon to Earth.', 'Телекамера автомобиля показала Земле старт с Луны.', 'Автомобильдің телекамерасы Айдан көтерілуді Жерге көрсетті.'), ['nasa-a17']],
  },
  chg: [T('It closed the first era of human exploration of the Moon; no one has walked there since.', 'Он завершил первую эпоху высадок людей на Луну; с тех пор по ней никто не ходил.', 'Ол адамдардың Айға қонуының алғашқы дәуірін аяқтады; содан бері онда ешкім жүрген жоқ.'), ['nasa-hist-a17']],
  val: [T('Three days on the surface, 35.7 km of driving and the orange soil — the finale of a programme NASA reported as costing $25.4 billion in total.', 'Три дня на поверхности, 35,7 км пути и оранжевый грунт — финал программы, общую стоимость которой NASA назвало в 25,4 млрд долларов.', 'Беттегі үш күн, 35,7 км жол және қызғылт сары топырақ — NASA жалпы құнын 25,4 млрд доллар деп атаған бағдарламаның финалы.'), ['nasa-hist-a17', 'dreier2019']],
  ver: {
    ok: T('All three excursions completed; samples returned.', 'Все три выхода выполнены; образцы доставлены.', 'Үш шығудың бәрі орындалды; үлгілер жеткізілді.'),
    no: T('No primary objective was missed.', 'Все главные задачи выполнены.', 'Барлық негізгі міндеттер орындалды.'),
    top: T('Volcanic orange soil.', 'Вулканический оранжевый грунт.', 'Жанартаулық қызғылт сары топырақ.'),
    why: T('The last footprints on the Moon — for now.', 'Последние следы на Луне — пока что.', 'Айдағы соңғы іздер — әзірге.'),
  },
  art: [T('The descent stage of the lunar module Challenger, the lunar rover and the ALSEP science station remain in the valley.', 'В долине остались посадочная ступень модуля «Челленджер», лунный автомобиль и научная станция ALSEP.', 'Алқапта «Челленджер» модулінің қону сатысы, Ай автомобилі және ALSEP ғылыми станциясы қалды.'), ['lroc-1278', 'nasa-a17']],
  cost: [
    { amt: 25.4e9, cur: 'USD', yr: T('1960–1973, then-year dollars', '1960–1973, в ценах тех лет', '1960–1973, сол кездегі бағамен'), scope: T('Entire Project Apollo as reported by NASA to Congress in 1973 — not Apollo 17 alone', 'Вся программа «Аполлон» по отчёту NASA Конгрессу в 1973 году — не только «Аполлон-17»', 'NASA-ның 1973 жылғы Конгреске есебі бойынша бүкіл «Аполлон» бағдарламасы — тек «Аполлон-17» емес'), conf: 'official', ref: 'dreier2019' },
  ],
});

M({
  id: 'lunar-reconnaissance-orbiter', site: null, orbiter: 'lro', planet: 'moon', model: 'lunar-reconnaissance-orbiter',
  name: T('Lunar Reconnaissance Orbiter (LRO)', 'Лунный разведывательный орбитальный аппарат (LRO)', 'Айды барлайтын орбиталық аппарат (LRO)'), agency: 'NASA (GSFC)', country: 'USA', type: 'orbiter',
  launch: '2009-06-18', arrive: '2009-06-23', end: null, outcome: 'success', op: 'operational', phys: 'orbit', still: false,
  coords: null,
  obj: T('Map the Moon in detail for future landings: safe sites, cold traps that may hold ice and the radiation environment.', 'Подробно нанести Луну на карту для будущих посадок: безопасные места, холодные ловушки, где может быть лёд, и радиация.', 'Болашақ қонулар үшін Айды толық картаға түсіру: қауіпсіз орындар, мұз сақталуы мүмкін суық тұзақтар және радиация.'),
  story: T('LRO has circled the Moon since June 2009. Its cameras photographed the Apollo landing sites, found the “lost” Lunokhod 1 and keep spotting new craters. It is a working orbiter, not a surface artifact.',
    'LRO летает вокруг Луны с июня 2009 года. Его камеры сфотографировали места посадок «Аполлонов», нашли «потерянный» Луноход-1 и замечают новые кратеры. Это работающий орбитальный аппарат, а не техника на поверхности.',
    'LRO 2009 жылғы маусымнан бері Айды айналып жүр. Оның камералары «Аполлондардың» қону орындарын түсірді, «жоғалған» Луноход-1-ді тапты және жаңа кратерлерді байқап жүр. Бұл беттегі техника емес, жұмыс істеп тұрған орбиталық аппарат.'),
  tl: [
    ['2009-06-18', T('Launch together with the LCROSS impactor', 'Запуск вместе с ударным зондом LCROSS', 'LCROSS соққы зондымен бірге ұшырылды'), 'nasa-lro'],
    ['2009-06-23', T('Enters lunar orbit', 'Выход на орбиту Луны', 'Ай орбитасына шықты'), 'nasa-lro'],
    ['2009-10-09', T('LCROSS impact: water detected in Cabeus crater', 'Удар LCROSS: в кратере Кабеус найдена вода', 'LCROSS соққысы: Кабеус кратерінен су табылды'), 'colaprete2010'],
    ['2010-03-17', T('LROC images reveal Luna 17 and Lunokhod 1', 'На снимках LROC найдены «Луна-17» и Луноход-1', 'LROC суреттерінен «Луна-17» мен Луноход-1 табылды'), 'lroc-11'],
    ['2026', T('Still working after 17 years', 'Работает уже 17 лет', '17 жылдан бері жұмыс істеп тұр'), 'lpi-lro17'],
  ],
  imp: {
    sci: [T('Its Diviner radiometer found extremely cold, permanently shadowed craters near the south pole, where ice can survive.', 'Радиометр Diviner нашёл у южного полюса очень холодные вечно затенённые кратеры, где может сохраняться лёд.', 'Diviner радиометрі оңтүстік полюс маңынан мұз сақталуы мүмкін мәңгі көлеңкелі өте суық кратерлер тапты.'), ['paige2010']],
    tech: [T('Its camera can see objects about half a metre across from orbit.', 'Его камера различает с орбиты предметы размером около полуметра.', 'Оның камерасы орбитадан шамамен жарты метрлік заттарды ажырата алады.'), ['robinson2010']],
    fut: [T('Its maps are used to choose landing sites for new missions.', 'Его карты используют для выбора мест посадки новых миссий.', 'Оның карталары жаңа миссиялардың қону орнын таңдауға қолданылады.'), ['chin2007']],
    hist: [T('The longest-lived lunar orbiter, as of 2026.', 'Самый долгоживущий спутник Луны (на 2026 год).', 'Айдың ең ұзақ жұмыс істеген жасанды серігі (2026 жылғы жағдай бойынша).'), ['nasa-lro']],
    edu: [T('Its photos of the Apollo sites show the hardware that is still there.', 'Его снимки мест посадок «Аполлонов» показывают технику, которая всё ещё там.', 'Оның «Аполлон» қону орындарының суреттері әлі сонда тұрған техниканы көрсетеді.'), ['lroc-1278']],
  },
  chg: [T('It turned the Moon into a mapped, monitored place, where even old spacecraft can be found again.', 'Он превратил Луну в нанесённое на карту и наблюдаемое место, где можно найти даже старые аппараты.', 'Ол Айды картаға түсірілген және бақыланатын орынға айналдырды: онда тіпті ескі аппараттарды да табуға болады.'), ['lroc-11', 'robinson2010']],
  val: [T('A project cost of about $500 million (2009) has so far bought 17 years of mapping, the rediscovery of lost hardware and newly formed craters.', 'Проект стоимостью около 500 млн долларов (2009) дал уже 17 лет картографирования, находку потерянной техники и новые кратеры.', 'Құны шамамен 500 млн доллар (2009) жоба 17 жылдық картаға түсіру, жоғалған техниканы табу және жаңа кратерлер берді.'), ['lro-presskit2009', 'lpi-lro17']],
  ver: {
    ok: T('Mapping goals met; the mission has been extended many times.', 'Задачи картографирования выполнены; миссию много раз продлевали.', 'Картаға түсіру міндеттері орындалды; миссия талай рет ұзартылды.'),
    no: T('No missed objective is documented in our sources.', 'Невыполненных задач в наших источниках не указано.', 'Біздің дереккөздерде орындалмаған міндет көрсетілмеген.'),
    top: T('Detailed global maps and the temperatures of cold traps.', 'Подробные карты всей Луны и температуры холодных ловушек.', 'Бүкіл Айдың толық карталары және суық тұзақтардың температурасы.'),
    why: T('It keeps watch over everything humanity left on the Moon.', 'Он присматривает за всем, что люди оставили на Луне.', 'Ол адамдар Айда қалдырғанның бәрін бақылап жүр.'),
  },
  art: [T('Not a surface artifact: LRO is a working spacecraft in lunar orbit.', 'Это не техника на поверхности: LRO — работающий аппарат на орбите Луны.', 'Бұл беттегі техника емес: LRO — Ай орбитасында жұмыс істеп тұрған аппарат.'), ['nasa-lro']],
  cost: [
    { amt: 500e6, cur: 'USD', yr: T('2009', '2009', '2009'), scope: T('LRO project life-cycle cost, approximately, as stated in the June 2009 press kit', 'Полная стоимость проекта LRO, примерно, по пресс-киту июня 2009 года', '2009 жылғы маусымдағы пресс-кит бойынша LRO жобасының шамамен толық құны'), conf: 'official', ref: 'lro-presskit2009' },
    { amt: 15.5e6, cur: 'USD', yr: T('2026', '2026', '2026'), scope: T('Three-year contract to operate the LROC camera (May 2026)', 'Трёхлетний контракт на работу камеры LROC (май 2026)', 'LROC камерасының жұмысына үш жылдық келісімшарт (2026 жылғы мамыр)'), conf: 'official', ref: 'nasa-lro-2026' },
  ],
});
