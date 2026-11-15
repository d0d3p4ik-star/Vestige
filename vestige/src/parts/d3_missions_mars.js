/* =====================================================================================
   ПРОФИЛИ МИССИЙ (Марс и другие миры)
   ===================================================================================== */
const COST_VIKING = { amt: 1.06e9, cur: 'USD', yr: T('1970s, then-year dollars', '1970-е, в ценах тех лет', '1970 жылдар, сол кездегі бағамен'), scope: T('Entire Viking project: two orbiters and two landers', 'Весь проект «Викинг»: два орбитальных и два посадочных аппарата', 'Бүкіл «Викинг» жобасы: екі орбиталық және екі қонатын аппарат'), conf: 'official', ref: 'nasa-hist-viking45' };
const COST_MER = { amt: 820e6, cur: 'USD', yr: T('2003–2004, pre-launch figure', '2003–2004, оценка до запуска', '2003–2004, ұшыруға дейінгі баға'), scope: T('Whole Mars Exploration Rover project — both Spirit and Opportunity: $645M development and instruments, $100M launches, $75M operations and science (prime mission only)', 'Весь проект Mars Exploration Rover — и Spirit, и Opportunity: 645 млн на разработку и приборы, 100 млн на запуски, 75 млн на управление и науку (только основная миссия)', 'Бүкіл Mars Exploration Rover жобасы — Spirit те, Opportunity де: 645 млн әзірлеу мен құралдарға, 100 млн ұшыруға, 75 млн басқару мен ғылымға (тек негізгі миссия)'), conf: 'official', ref: 'mer-presskit2004' };

M({
  id: 'viking-1', site: 'viking1', planet: 'mars', model: 'viking-lander',
  name: T('Viking 1', 'Викинг-1', 'Викинг-1'), agency: 'NASA', country: 'USA', type: 'lander',
  launch: '1975-08-20', arrive: '1976-07-20', end: '1982-11-19', outcome: 'success', op: 'lost', phys: 'soft', still: true,
  coords: { lat: 22.273, lon: -47.946, conf: 'confirmed', ref: 'hirise-vl1' },
  obj: T('Land safely on Mars, photograph the surface and test the soil for signs of life.', 'Безопасно сесть на Марс, снять поверхность и проверить грунт на признаки жизни.', 'Марсқа аман қонып, бетін түсіріп, топырақты тіршілік белгілеріне тексеру.'),
  tl: [
    ['1975-08-20', T('Launch', 'Запуск', 'Ұшырылды'), 'nssdc-vl1'],
    ['1976-07-20', T('Landing in Chryse Planitia', 'Посадка на равнине Хриса', 'Хриса жазығына қонды'), 'nssdc-vl1'],
    ['1982-11-19', T('A faulty command overwrites the antenna software; contact is lost', 'Ошибочная команда стирает программу антенны; связь пропадает', 'Қате команда антенна бағдарламасын өшірді; байланыс үзілді'), 'mudgway1983'],
    ['1983-04-12', T('JPL ends attempts to restore contact', 'JPL прекращает попытки восстановить связь', 'JPL байланысты қалпына келтіру әрекетін тоқтатты'), 'jpl-vl1-1983'],
    ['2006-11-22', T('HiRISE photographs the lander from orbit', 'HiRISE фотографирует аппарат с орбиты', 'HiRISE аппаратты орбитадан түсірді'), 'hirise-vl1'],
  ],
  imp: {
    sci: [T('The first detailed pictures from the surface and the first test of Martian soil for life — with no clear answer.', 'Первые подробные снимки с поверхности и первая проверка грунта на жизнь — без ясного ответа.', 'Беттен алғашқы толық суреттер және топырақты тіршілікке алғашқы тексеру — нақты жауапсыз.'), ['mutch1976', 'klein1976']],
    tech: [T('The first US soft landing on Mars, using an aeroshell, a parachute and retro-rockets.', 'Первая мягкая посадка США на Марс: аэрооболочка, парашют и тормозные двигатели.', 'АҚШ-тың Марсқа алғашқы жұмсақ қонуы: аэроқабық, парашют және тежегіш қозғалтқыштар.'), ['nasa-viking1']],
    fut: [T('Its puzzling biology results are still re-examined and shaped how later missions approached the search for life.', 'Его загадочные биологические результаты пересматривают до сих пор; они повлияли на то, как позже искали жизнь.', 'Оның жұмбақ биологиялық нәтижелері әлі қайта қаралады; олар кейінгі тіршілік іздеу тәсілдеріне әсер етті.'), ['mckay2025', 'navarro2010']],
    hist: [T('Worked on the surface for more than six years.', 'Работал на поверхности больше шести лет.', 'Бетте алты жылдан астам жұмыс істеді.'), ['nasa-viking1']],
    edu: [T('Its panoramas gave the public the first close look at the Martian landscape.', 'Его панорамы впервые показали людям марсианский пейзаж вблизи.', 'Оның панорамалары адамдарға Марс табиғатын алғаш жақыннан көрсетті.'), ['mutch1976']],
  },
  chg: [T('Mars turned from a dot in telescopes into a landscape that could be studied rock by rock.', 'Марс превратился из точки в телескопе в пейзаж, который можно изучать камень за камнем.', 'Марс телескоптағы нүктеден тас-тасқа дейін зерттеуге болатын табиғатқа айналды.'), ['mutch1976']],
  val: [T('Viking cost about $1.06 billion for two orbiters and two landers (then-year); Lander 1 alone worked for more than six years.', '«Викинг» стоил около 1,06 млрд долларов за два орбитальных и два посадочных аппарата (в ценах тех лет); один только «Викинг-1» работал больше шести лет.', '«Викинг» екі орбиталық және екі қонатын аппарат үшін шамамен 1,06 млрд доллар тұрды (сол кездегі бағамен); «Викинг-1»-дің өзі алты жылдан астам жұмыс істеді.'), ['nasa-hist-viking45', 'nasa-viking1']],
  ver: {
    ok: T('Landed, took pictures and studied soil and weather for years.', 'Сел, снимал, годами изучал грунт и погоду.', 'Қонып, суретке түсірді, жылдар бойы топырақ пен ауа райын зерттеді.'),
    no: T('The life-detection experiments gave no clear answer.', 'Опыты по поиску жизни не дали ясного ответа.', 'Тіршілік іздеу тәжірибелері нақты жауап бермеді.'),
    top: T('The first long-lived station on Mars.', 'Первая долгоживущая станция на Марсе.', 'Марстағы алғашқы ұзақ жұмыс істеген станция.'),
    why: T('It set the questions Mars missions still try to answer.', 'Он задал вопросы, на которые марсианские миссии отвечают до сих пор.', 'Ол Марс миссиялары әлі жауап іздеп жүрген сұрақтарды қойды.'),
  },
  art: [T('The lander stands in western Chryse Planitia; HiRISE photographed it from orbit in 2006.', 'Аппарат стоит на западе равнины Хриса; в 2006 году его сфотографировал с орбиты HiRISE.', 'Аппарат Хриса жазығының батысында тұр; 2006 жылы оны орбитадан HiRISE түсірді.'), ['hirise-vl1']],
  cost: [COST_VIKING],
});

M({
  id: 'viking-2', site: 'viking2', planet: 'mars', model: 'viking-lander',
  name: T('Viking 2', 'Викинг-2', 'Викинг-2'), agency: 'NASA', country: 'USA', type: 'lander',
  launch: '1975-09-09', arrive: '1976-09-03', end: '1980-04-11', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: 47.6673, lon: 134.2809, conf: 'confirmed', ref: 'nssdc-vl2' },
  obj: T('Land at a second, more northern site to compare with Viking 1 and repeat the soil and life experiments.', 'Сесть во втором, более северном месте, чтобы сравнить с «Викингом-1» и повторить опыты с грунтом и поиском жизни.', '«Викинг-1»-мен салыстыру және топырақ пен тіршілік іздеу тәжірибелерін қайталау үшін екінші, солтүстіктегі жерге қону.'),
  story: T('Viking 2 landed on 3 September 1976 in Utopia Planitia, far to the north of its twin. It photographed frost on the ground, carried the only Viking seismometer that worked and kept a weather record until April 1980.',
    '«Викинг-2» сел 3 сентября 1976 года на равнине Утопия, намного севернее своего близнеца. Он снял иней на грунте, нёс единственный работавший сейсмометр «Викингов» и вёл запись погоды до апреля 1980 года.',
    '«Викинг-2» 1976 жылғы 3 қыркүйекте егізінен әлдеқайда солтүстіктегі Утопия жазығына қонды. Ол жердегі қырауды түсірді, «Викингтердің» жұмыс істеген жалғыз сейсмометрін алып жүрді және 1980 жылғы сәуірге дейін ауа райын жазды.'),
  tl: [
    ['1975-09-09', T('Launch', 'Запуск', 'Ұшырылды'), 'nssdc-vl2'],
    ['1976-09-03', T('Landing in Utopia Planitia', 'Посадка на равнине Утопия', 'Утопия жазығына қонды'), 'nssdc-vl2'],
    ['1977-09-13', T('Frost photographed on the ground', 'Снят иней на грунте', 'Жердегі қырау түсірілді'), 'jpl-pia00530'],
    ['1980-04-11', T('Lander shut down', 'Аппарат отключён', 'Аппарат сөндірілді'), 'nasa-viking2'],
    ['2006-11-21', T('HiRISE photographs the lander from orbit', 'HiRISE фотографирует аппарат с орбиты', 'HiRISE аппаратты орбитадан түсірді'), 'hirise-vl2'],
  ],
  imp: {
    sci: [T('Photographed water frost on the surface — the first clear sign of frost seen by a lander camera.', 'Снял водяной иней — первый явный иней, замеченный камерой посадочного аппарата.', 'Су қырауын түсірді — қонатын аппарат камерасы байқаған алғашқы анық қырау.'), ['jpl-pia00530']],
    tech: [T('Carried the only Viking seismometer that worked on the surface.', 'Нёс единственный сейсмометр «Викингов», который работал на поверхности.', 'Бетте жұмыс істеген «Викингтердің» жалғыз сейсмометрін алып жүрді.'), ['lorenz2017']],
    fut: [T('Its seismic and frost records are still re-analysed with modern methods.', 'Его сейсмические записи и снимки инея до сих пор заново изучают современными методами.', 'Оның сейсмикалық жазбалары мен қырау суреттері қазіргі әдістермен әлі қайта зерттеледі.'), ['lazarewicz2023', 'chevrier2025']],
    hist: [T('Operated for more than three and a half years.', 'Работал больше трёх с половиной лет.', 'Үш жарым жылдан астам жұмыс істеді.'), ['nasa-viking2']],
    edu: [T('With Viking 1 it produced the first long weather record on another planet.', 'Вместе с «Викингом-1» вёл первую долгую запись погоды на другой планете.', '«Викинг-1»-мен бірге басқа ғаламшардағы ауа райының алғашқы ұзақ жазбасын жасады.'), ['lorenz2017']],
  },
  chg: [T('Two distant sites showed how Martian weather and frost change with latitude and season.', 'Два далёких места показали, как погода и иней на Марсе меняются с широтой и временем года.', 'Екі алыс орын Марстағы ауа райы мен қыраудың ендік пен маусымға қарай өзгеретінін көрсетті.'), ['lorenz2017', 'jpl-pia00530']],
  val: [T('Within the same $1.06 billion Viking project, Lander 2 added frost, seismic and weather data from a second site.', 'В рамках того же проекта «Викинг» за 1,06 млрд долларов второй аппарат добавил данные об инее, сейсмике и погоде из второго места.', 'Сол 1,06 млрд долларлық «Викинг» жобасы аясында екінші аппарат екінші орыннан қырау, сейсмика және ауа райы деректерін қосты.'), ['nasa-hist-viking45', 'lorenz2017']],
  ver: {
    ok: T('Landed and worked for three and a half years.', 'Сел и проработал три с половиной года.', 'Қонып, үш жарым жыл жұмыс істеді.'),
    no: T('Its life-detection experiments, like Viking 1’s, gave no clear answer.', 'Опыты по поиску жизни, как и у «Викинга-1», не дали ясного ответа.', '«Викинг-1» сияқты, тіршілік іздеу тәжірибелері нақты жауап бермеді.'),
    top: T('Frost on Mars.', 'Иней на Марсе.', 'Марстағы қырау.'),
    why: T('Its data are still producing new science.', 'Его данные до сих пор приносят новые научные результаты.', 'Оның деректері әлі жаңа ғылыми нәтиже береді.'),
  },
  art: [T('The lander remains in Utopia Planitia; HiRISE photographed it in 2006.', 'Аппарат стоит на равнине Утопия; в 2006 году его снял HiRISE.', 'Аппарат Утопия жазығында тұр; 2006 жылы оны HiRISE түсірді.'), ['hirise-vl2']],
  cost: [COST_VIKING],
});

M({
  id: 'mars-3', site: 'mars3', planet: 'mars', model: null,
  name: T('Mars 3', 'Марс-3', 'Марс-3'), agency: 'Lavochkin', country: 'USSR', type: 'lander',
  launch: '1971-05-28', arrive: '1971-12-02', end: '1971-12-02', outcome: 'partial', op: 'lost', phys: 'soft', still: true,
  coords: { lat: -45, lon: -158, conf: 'approximate', ref: 'jpl-mars3-2013' },
  obj: T('Make the first soft landing on Mars and send pictures from the surface, while the orbiter studied the planet from above.', 'Совершить первую мягкую посадку на Марс и передать снимки с поверхности, а орбитальный аппарат должен был изучать планету сверху.', 'Марсқа алғашқы жұмсақ қонып, беттен суреттер жіберу; орбиталық аппарат ғаламшарды жоғарыдан зерттеуі тиіс еді.'),
  tl: [
    ['1971-05-28', T('Launch', 'Запуск', 'Ұшырылды'), 'nssdc-mars3'],
    ['1971-12-02', T('Soft landing; transmission starts about 90 seconds later and soon stops', 'Мягкая посадка; передача начинается примерно через 90 секунд и вскоре обрывается', 'Жұмсақ қону; хабар шамамен 90 секундтан кейін басталып, көп ұзамай үзілді'), 'nssdc-mars3'],
    ['2013-04-11', T('Possible hardware identified in HiRISE images (not confirmed)', 'На снимках HiRISE найдены возможные детали (не подтверждено)', 'HiRISE суреттерінен ықтимал бөлшектер табылды (расталмаған)'), 'jpl-mars3-2013'],
    ['2024', T('New analysis suggests the signal lasted at least 62 seconds', 'Новый анализ: сигнал длился не меньше 62 секунд', 'Жаңа талдау: сигнал кемінде 62 секундқа созылған'), 'gektin2024'],
  ],
  imp: {
    sci: [T('The lander returned no usable surface data; the orbiter studied Mars from orbit.', 'Посадочный аппарат не передал полезных данных с поверхности; орбитальный изучал Марс с орбиты.', 'Қонатын аппарат беттен пайдалы дерек жібере алмады; орбиталық аппарат Марсты орбитадан зерттеді.'), ['perminov1999']],
    tech: [T('The first soft landing on Mars: parachute, retro-rockets and protective shell worked.', 'Первая мягкая посадка на Марс: сработали парашют, тормозные двигатели и защитная оболочка.', 'Марсқа алғашқы жұмсақ қону: парашют, тежегіш қозғалтқыштар және қорғаныш қабық жұмыс істеді.'), ['nssdc-mars3', 'perminov1999']],
    fut: [T('It carried PrOP-M, a small rover on a cable; no data from it was ever received.', 'На борту был PrOP-M — маленький марсоход на кабеле; данных от него так и не получили.', 'Бортында кабельге байланған шағын PrOP-M марсоходы болды; одан ешқандай дерек алынбады.'), ['perminov1999']],
    hist: [T('The first spacecraft to land softly on Mars and transmit from the surface (2 December 1971).', 'Первый аппарат, мягко севший на Марс и передавший сигнал с поверхности (2 декабря 1971 года).', 'Марсқа жұмсақ қонып, беттен сигнал жіберген алғашқы аппарат (1971 жылғы 2 желтоқсан).'), ['nssdc-mars3']],
    edu: [T('In 2013 volunteers found a possible image of its hardware in a crowdsourced search.', 'В 2013 году добровольцы нашли возможный снимок его деталей в коллективном поиске.', '2013 жылы еріктілер ұжымдық іздеуде оның бөлшектерінің ықтимал суретін тапты.'), ['ps-mars3', 'jpl-mars3-2013']],
  },
  chg: [T('It showed that a landing on Mars was possible, even though the station fell silent almost at once.', 'Он показал, что посадка на Марс возможна, хотя станция почти сразу замолчала.', 'Ол Марсқа қонуға болатынын көрсетті, бірақ станция бірден дерлік үнсіз қалды.'), ['nssdc-mars3']],
  val: [T('An engineering success — a soft landing — with almost no scientific return from the surface.', 'Инженерный успех — мягкая посадка — почти без научных данных с поверхности.', 'Инженерлік жетістік — жұмсақ қону — беттен ғылыми деректер жоқтың қасы.'), ['perminov1999']],
  ver: {
    ok: T('Soft landing achieved.', 'Мягкая посадка удалась.', 'Жұмсақ қону сәтті болды.'),
    no: T('Surface operations failed almost immediately; the cause is unknown. Sources disagree on how long the signal lasted (14.5 s, about 20 s or at least 62 s).', 'Работа на поверхности оборвалась почти сразу; причина неизвестна. Источники расходятся в длительности сигнала (14,5 с, около 20 с или не меньше 62 с).', 'Беттегі жұмыс бірден дерлік үзілді; себебі белгісіз. Дереккөздер сигнал ұзақтығы туралы әртүрлі айтады (14,5 с, шамамен 20 с немесе кемінде 62 с).'),
    top: T('The first soft landing on Mars.', 'Первая мягкая посадка на Марс.', 'Марсқа алғашқы жұмсақ қону.'),
    why: T('A brave first step that ended in a mystery.', 'Смелый первый шаг, который закончился загадкой.', 'Жұмбақпен аяқталған батыл алғашқы қадам.'),
  },
  art: [T('The lander lies on the floor of Ptolemaeus crater, near 45° S, 158° W; a candidate site found in 2013 is not confirmed.', 'Аппарат лежит на дне кратера Птолемей, около 45° ю. ш., 158° з. д.; возможное место, найденное в 2013 году, не подтверждено.', 'Аппарат Птолемей кратерінің түбінде, шамамен 45° о. е., 158° б. б. жатыр; 2013 жылы табылған ықтимал орын расталмаған.'), ['jpl-mars3-2013', 'hirise-mars3', 'gektin2024', 'perminov1999']],
  cost: [],
});

M({
  id: 'mars-pathfinder', site: 'pathfinder', planet: 'mars', model: null,
  name: T('Mars Pathfinder and Sojourner', 'Mars Pathfinder и Sojourner', 'Mars Pathfinder және Sojourner'), agency: 'NASA / JPL', country: 'USA', type: 'rover',
  launch: '1996-12-04', arrive: '1997-07-04', end: '1997-09-27', outcome: 'success', op: 'lost', phys: 'soft', still: true,
  coords: { lat: 19.13, lon: -33.22, conf: 'confirmed', ref: 'hirise-mpf' },
  obj: T('Demonstrate a low-cost way to land on Mars with airbags and test a small rover.', 'Показать недорогой способ сесть на Марс на воздушных подушках и испытать маленький марсоход.', 'Марсқа ауа жастықтарымен арзан қонудың жолын көрсетіп, шағын марсоходты сынау.'),
  tl: [
    ['1996-12-04', T('Launch', 'Запуск', 'Ұшырылды'), 'nssdc-mpf'],
    ['1997-07-04', T('Airbag landing in Ares Vallis', 'Посадка на подушках в долине Арес', 'Арес алқабына жастықпен қонды'), 'golombek1997'],
    ['1997-07-06', T('Sojourner’s wheels touch Mars', 'Колёса Sojourner касаются Марса', 'Sojourner дөңгелектері Марсқа тиді'), 'nssdc-sojourner'],
    ['1997-09-27', T('Last data transmission (sol 83)', 'Последняя передача данных (83-й сол)', 'Соңғы дерек жіберу (83-сол)'), 'nasafacts-mpf'],
  ],
  imp: {
    sci: [T('Sojourner analysed rocks and soil; the lander recorded weather and dust.', 'Sojourner изучал камни и грунт; посадочный аппарат записывал погоду и пыль.', 'Sojourner тастар мен топырақты зерттеді; қонатын аппарат ауа райы мен шаңды жазды.'), ['matijevic1997', 'golombek1997']],
    tech: [T('Proved the airbag landing later used by Spirit and Opportunity.', 'Отработал посадку на подушках, которую потом использовали Spirit и Opportunity.', 'Кейін Spirit пен Opportunity қолданған жастықпен қонуды дәлелдеді.'), ['golombek1997', 'crisp2003']],
    fut: [T('Led directly to the larger Mars Exploration Rovers, which reused its airbag landing.', 'Прямо привёл к большим марсоходам Mars Exploration Rover, которые унаследовали его посадку на подушках.', 'Оның жастықпен қонуын қайта қолданған үлкен Mars Exploration Rover марсоходтарына тікелей жол ашты.'), ['crisp2003']],
    hist: [T('The first rover on Mars (1997).', 'Первый марсоход (1997).', 'Алғашқы марсоход (1997).'), ['nssdc-sojourner']],
    edu: [T('Its pictures from Mars drew huge online audiences in July 1997.', 'Его снимки с Марса собрали огромную аудиторию в интернете в июле 1997 года.', 'Оның Марс суреттері 1997 жылғы шілдеде интернетте орасан көп көрерменді жинады.'), ['nasa-pathfinder20']],
  },
  chg: [T('It showed that a Mars landing did not need a billion-dollar budget.', 'Он показал, что для посадки на Марс не нужен бюджет в миллиард долларов.', 'Ол Марсқа қону үшін миллиард долларлық бюджет қажет емес екенін көрсетті.'), ['nasafacts-mpf', 'nasa-hist-viking45']],
  val: [T('About $265 million in total bought a landing, the first Mars rover and 83 sols of data.', 'Около 265 млн долларов в сумме дали посадку, первый марсоход и 83 сола данных.', 'Барлығы шамамен 265 млн доллар қонуды, алғашқы марсоходты және 83 сол дерегін берді.'), ['nasafacts-mpf']],
  ver: {
    ok: T('Landing, rover drives, science and weather data.', 'Посадка, поездки марсохода, научные и погодные данные.', 'Қону, марсоход жүрістері, ғылыми және ауа райы деректері.'),
    no: T('No missed objective is documented in our sources.', 'Невыполненных задач в наших источниках не указано.', 'Біздің дереккөздерде орындалмаған міндет көрсетілмеген.'),
    top: T('The first Mars rover and the airbag landing.', 'Первый марсоход и посадка на подушках.', 'Алғашқы марсоход және жастықпен қону.'),
    why: T('It opened the rover era on Mars.', 'С него началась эпоха марсоходов.', 'Марсоходтар дәуірі осыдан басталды.'),
  },
  art: [T('The Carl Sagan Memorial Station and Sojourner remain in Ares Vallis.', 'Мемориальная станция Карла Сагана и Sojourner остаются в долине Арес.', 'Карл Саган мемориалдық станциясы мен Sojourner Арес алқабында қалды.'), ['hirise-mpf', 'nssdc-sojourner']],
  cost: [
    { amt: 265e6, cur: 'USD', yr: T('then-year dollars', 'в ценах тех лет', 'сол кездегі бағамен'), scope: T('Total mission, including launch and operations', 'Вся миссия, включая запуск и управление', 'Бүкіл миссия, ұшыру мен басқаруды қоса'), conf: 'official', ref: 'nasafacts-mpf' },
    { amt: 150e6, cur: 'USD', yr: T('then-year dollars', 'в ценах тех лет', 'сол кездегі бағамен'), scope: T('Lander development and construction', 'Разработка и постройка посадочного аппарата', 'Қонатын аппаратты әзірлеу және жасау'), conf: 'official', ref: 'nasafacts-mpf' },
    { amt: 25e6, cur: 'USD', yr: T('then-year dollars', 'в ценах тех лет', 'сол кездегі бағамен'), scope: T('Sojourner rover', 'Марсоход Sojourner', 'Sojourner марсоходы'), conf: 'official', ref: 'nasafacts-mpf' },
  ],
});

M({
  id: 'mars-odyssey', site: null, orbiter: 'odyssey', planet: 'mars', model: 'mars-odyssey',
  name: T('2001 Mars Odyssey', '2001 Mars Odyssey', '2001 Mars Odyssey'), agency: 'NASA / JPL', country: 'USA', type: 'orbiter',
  launch: '2001-04-07', arrive: '2001-10-24', end: null, outcome: 'success', op: 'operational', phys: 'orbit', still: false,
  coords: null,
  obj: T('Map the chemistry and minerals of Mars from orbit, look for water and measure radiation; later serve as a communications relay.', 'Составить с орбиты карты химии и минералов Марса, искать воду и измерять радиацию; позже — служить ретранслятором связи.', 'Орбитадан Марстың химиясы мен минералдарын картаға түсіру, су іздеу және радиацияны өлшеу; кейін байланыс ретрансляторы болу.'),
  story: T('Odyssey has circled Mars since October 2001. It found water ice just under the surface near the poles and has relayed data from Spirit, Opportunity and other surface missions. It is a working orbiter, not a surface artifact.',
    'Odyssey летает вокруг Марса с октября 2001 года. Он нашёл водяной лёд прямо под поверхностью у полюсов и пересылал на Землю данные Spirit, Opportunity и других наземных миссий. Это работающий орбитальный аппарат, а не техника на поверхности.',
    'Odyssey 2001 жылғы қазаннан бері Марсты айналып жүр. Ол полюстер маңында бет астындағы су мұзын тапты және Spirit, Opportunity мен басқа беттік миссиялардың деректерін Жерге жеткізді. Бұл беттегі техника емес, жұмыс істеп тұрған орбиталық аппарат.'),
  tl: [
    ['2001-04-07', T('Launch', 'Запуск', 'Ұшырылды'), 'nssdc-ody'],
    ['2001-10-24', T('Enters Mars orbit', 'Выход на орбиту Марса', 'Марс орбитасына шықты'), 'nssdc-ody'],
    ['2002', T('Neutron and gamma-ray maps reveal ice-rich ground', 'Карты нейтронов и гамма-лучей показывают богатый льдом грунт', 'Нейтрондар мен гамма-сәулелер карталары мұзға бай топырақты көрсетті'), 'boynton2002'],
    ['2004-01', T('Becomes the main relay for Spirit and Opportunity', 'Становится главным ретранслятором для Spirit и Opportunity', 'Spirit пен Opportunity үшін басты ретрансляторға айналды'), 'nasa-relay'],
    ['2026-04', T('NASA marks 25 years since launch', 'NASA отмечает 25 лет со дня запуска', 'NASA ұшырылғанына 25 жыл толғанын атап өтті'), 'nasa-ody-25'],
  ],
  imp: {
    sci: [T('Found hydrogen-rich, icy ground near both poles.', 'Нашёл богатый водородом, ледяной грунт у обоих полюсов.', 'Екі полюс маңынан сутекке бай, мұзды топырақ тапты.'), ['boynton2002', 'feldman2002']],
    tech: [T('Became a long-lived communications relay for surface missions.', 'Стал долговечным ретранслятором связи для наземных миссий.', 'Беттік миссиялар үшін ұзақ жұмыс істейтін байланыс ретрансляторына айналды.'), ['nasa-ody-100k', 'nasa-relay']],
    fut: [T('Its ice maps helped motivate Phoenix, which confirmed ice under the surface in 2008.', 'Его карты льда стали одним из поводов для миссии Phoenix, которая в 2008 году подтвердила лёд под поверхностью.', 'Оның мұз карталары 2008 жылы бет астындағы мұзды растаған Phoenix миссиясына түрткі болды.'), ['smith2009', 'boynton2002']],
    hist: [T('The longest-working spacecraft at Mars, as of 2026.', 'Самый долгоработающий аппарат у Марса (на 2026 год).', 'Марс маңында ең ұзақ жұмыс істеп келе жатқан аппарат (2026 жылғы жағдай бойынша).'), ['nasa-ody']],
    edu: [T('NASA marked a quarter-century of its work in April 2026.', 'В апреле 2026 года NASA отметило четверть века его работы.', '2026 жылғы сәуірде NASA оның ширек ғасырлық жұмысын атап өтті.'), ['nasa-ody-25']],
  },
  chg: [T('Mars was shown to hold large amounts of water ice just beneath its surface.', 'Выяснилось, что прямо под поверхностью Марса много водяного льда.', 'Марс бетінің астында көп су мұзы бар екені анықталды.'), ['boynton2002']],
  val: [T('For $297 million (2001 budget) humanity gained a quarter-century of mapping and a relay that carried data from six surface missions.', 'За 297 млн долларов (бюджет 2001 года) человечество получило четверть века карт и ретранслятор, который передавал данные шести наземных миссий.', '297 млн долларға (2001 жылғы бюджет) адамзат ширек ғасырлық карталар мен алты беттік миссияның деректерін жеткізген ретранслятор алды.'), ['ody-presskit2001', 'nasa-ody-100k']],
  ver: {
    ok: T('Mapping and relay goals met; still working.', 'Задачи картографирования и связи выполнены; работает до сих пор.', 'Картаға түсіру мен байланыс міндеттері орындалды; әлі жұмыс істейді.'),
    no: T('No missed objective is documented in our sources.', 'Невыполненных задач в наших источниках не указано.', 'Біздің дереккөздерде орындалмаған міндет көрсетілмеген.'),
    top: T('Ice just under the surface.', 'Лёд прямо под поверхностью.', 'Бет астындағы мұз.'),
    why: T('It quietly carried the rovers’ voices home.', 'Он тихо доносил до Земли голоса марсоходов.', 'Ол марсоходтардың үнін Жерге үнсіз жеткізіп отырды.'),
  },
  art: [T('Not a surface artifact: Odyssey is a working spacecraft in Mars orbit.', 'Это не техника на поверхности: Odyssey — работающий аппарат на орбите Марса.', 'Бұл беттегі техника емес: Odyssey — Марс орбитасында жұмыс істеп тұрған аппарат.'), ['nasa-ody']],
  cost: [{ amt: 297e6, cur: 'USD', yr: T('2001, pre-launch figure', '2001, оценка до запуска', '2001, ұшыруға дейінгі баға'), scope: T('Total before launch: spacecraft and instruments ($165M), launch ($53M), operations ($79M); extended missions excluded', 'Всего до запуска: аппарат и приборы (165 млн), запуск (53 млн), управление (79 млн); продления не включены', 'Ұшыруға дейін барлығы: аппарат пен құралдар (165 млн), ұшыру (53 млн), басқару (79 млн); ұзартулар кірмейді'), conf: 'official', ref: 'ody-presskit2001' }],
});

M({
  id: 'spirit', site: 'spirit', planet: 'mars', model: 'mer-rover',
  name: T('Spirit (MER-A)', 'Spirit (MER-A)', 'Spirit (MER-A)'), agency: 'NASA / JPL', country: 'USA', type: 'rover',
  launch: '2003-06-10', arrive: '2004-01-04', end: '2010-03-22', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: -14.5692, lon: 175.4729, conf: 'confirmed', ref: 'nasa-spirit', note: T('Landing site. The rover stopped at “Troy”; its final coordinates are not listed in our sources.', 'Место посадки. Марсоход остановился у «Трои»; её точные координаты в наших источниках не приведены.', 'Қону орны. Марсоход «Троя» маңында тоқтады; оның нақты координаттары біздің дереккөздерде жоқ.') },
  obj: T('Search the rocks and soil of Gusev crater for evidence of past water.', 'Искать в камнях и грунте кратера Гусев следы древней воды.', 'Гусев кратерінің тастары мен топырағынан ежелгі су іздерін іздеу.'),
  tl: [
    ['2003-06-10', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-spirit'],
    ['2004-01-04', T('Landing in Gusev crater', 'Посадка в кратере Гусев', 'Гусев кратеріне қонды'), 'nasa-spirit'],
    ['2007-05-21', T('Nearly pure silica discovery announced', 'Объявлено об открытии почти чистого кремнезёма', 'Таза дерлік кремнезем табылғаны жарияланды'), 'nasa-07-118'],
    ['2009-05-06', T('Gets stuck in soft soil at “Troy”', 'Застревает в рыхлом грунте у «Трои»', '«Троя» маңында борпылдақ топыраққа батып қалды'), 'jpl-spirit-2011'],
    ['2010-03-22', T('Last contact', 'Последняя связь', 'Соңғы байланыс'), 'jpl-spirit-2011'],
    ['2011-05-25', T('Mission declared complete', 'Миссия объявлена завершённой', 'Миссия аяқталды деп жарияланды'), 'jpl-spirit-2011'],
  ],
  imp: {
    sci: [T('Found nearly pure silica — a trace of ancient hot springs or steam vents.', 'Нашёл почти чистый кремнезём — след древних горячих источников или паровых выходов.', 'Таза дерлік кремнезем тапты — ежелгі ыстық бұлақтардың немесе бу шығатын жерлердің ізі.'), ['squyres2008', 'nasa-07-118']],
    tech: [T('Kept working for years by driving backwards with a stuck wheel and recovering from a memory fault.', 'Годами продолжал работу: ездил задом с заклинившим колесом и пережил сбой памяти.', 'Жылдар бойы жұмысын жалғастырды: кептелген дөңгелекпен кері жүрді және жад ақауынан айықты.'), ['reeves2005', 'nasa-spirit']],
    fut: [T('Its silica deposits are now compared with hot-spring deposits on Earth that hold signs of life.', 'Его залежи кремнезёма сравнивают с отложениями горячих источников на Земле, где сохраняются следы жизни.', 'Оның кремнезем шөгінділері тіршілік іздері сақталған Жердегі ыстық бұлақ шөгінділерімен салыстырылады.'), ['ruff2016']],
    hist: [T('Worked more than six years instead of the planned 90 sols.', 'Проработал больше шести лет вместо запланированных 90 солов.', 'Жоспарланған 90 солдың орнына алты жылдан астам жұмыс істеді.'), ['jpl-spirit-2011']],
    edu: [T('A schoolgirl’s essay gave Spirit and Opportunity their names in 2003.', 'Имена Spirit и Opportunity в 2003 году дало сочинение школьницы.', 'Spirit пен Opportunity атауларын 2003 жылы бір оқушы қыздың шығармасы берді.'), ['jpl-naming2003']],
  },
  chg: [T('Even a damaged rover could make a major discovery: its dragging wheel uncovered the silica.', 'Даже повреждённый марсоход может сделать открытие: волочащееся колесо вскрыло кремнезём.', 'Зақымданған марсоход та жаңалық аша алады: сүйретілген дөңгелек кремнеземді ашып берді.'), ['squyres2008']],
  val: [T('Half of an ~$820 million two-rover project (pre-launch figure) delivered six years of geology, including the silica discovery.', 'Половина проекта из двух марсоходов стоимостью около 820 млн долларов (оценка до запуска) дала шесть лет геологии и открытие кремнезёма.', 'Екі марсоходтан тұратын шамамен 820 млн долларлық жобаның жартысы (ұшыруға дейінгі баға) алты жылдық геология мен кремнезем жаңалығын берді.'), ['mer-presskit2004', 'squyres2008']],
  ver: {
    ok: T('Found evidence of past water; drove 7.73 km.', 'Нашёл следы древней воды; проехал 7,73 км.', 'Ежелгі су іздерін тапты; 7,73 км жүрді.'),
    no: T('It got stuck in 2009 and could not be freed.', 'В 2009 году застрял, и освободить его не удалось.', '2009 жылы батып қалды да, оны босату мүмкін болмады.'),
    top: T('Silica from ancient hot water.', 'Кремнезём от древней горячей воды.', 'Ежелгі ыстық судан қалған кремнезем.'),
    why: T('It never stopped working until it couldn’t.', 'Он работал до последней возможности.', 'Ол соңғы мүмкіндігіне дейін жұмыс істеді.'),
  },
  art: [T('The rover stands at “Troy”, beside the Home Plate plateau in Gusev crater, where it got stuck in 2009.', 'Марсоход стоит у «Трои», рядом с плато Хоум-Плейт в кратере Гусев, где он застрял в 2009 году.', 'Марсоход Гусев кратеріндегі Хоум-Плейт үстіртінің жанындағы «Трояда» тұр, ол 2009 жылы осы жерде батып қалды.'), ['jpl-spirit-2011']],
  cost: [COST_MER],
});

M({
  id: 'opportunity', site: 'opportunity', planet: 'mars', model: 'mer-rover',
  name: T('Opportunity (MER-B)', 'Opportunity (MER-B)', 'Opportunity (MER-B)'), agency: 'NASA / JPL', country: 'USA', type: 'rover',
  launch: '2003-07-08', arrive: '2004-01-25', end: '2018-06-10', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: -2.335, lon: -5.348, conf: 'approximate', ref: 'hirise-oppy2018', note: T('Centre of a 2018 orbital image of the rover in Perseverance Valley — approximate.', 'Центр снимка 2018 года с марсоходом в долине Персеверанс — приблизительно.', 'Персеверанс алқабындағы марсоход түсірілген 2018 жылғы суреттің ортасы — шамамен.') },
  obj: T('Find out whether Meridiani Planum, where orbiters had seen hematite, was once wet.', 'Выяснить, была ли когда-то вода на равнине Меридиана, где с орбиты заметили гематит.', 'Орбитадан гематит байқалған Меридиана жазығында бір кездері су болған-болмағанын анықтау.'),
  tl: [
    ['2003-07-08', T('Launch (UTC)', 'Запуск (UTC)', 'Ұшырылды (UTC)'), 'nssdc-oppy'],
    ['2004-01-25', T('Landing in Eagle crater (UTC)', 'Посадка в кратере Игл (UTC)', 'Игл кратеріне қонды (UTC)'), 'nssdc-oppy'],
    ['2004-03-02', T('Evidence that the area was once wet announced', 'Объявлено, что здесь когда-то была вода', 'Бұл жерде бір кездері су болғаны жарияланды'), 'jpl-oppy-wet2004'],
    ['2011', T('Reaches the rim of Endeavour crater', 'Добирается до края кратера Индевор', 'Индевор кратерінің жиегіне жетті'), 'squyres2012'],
    ['2014-07', T('Passes Lunokhod 2’s distance record', 'Обгоняет рекорд дальности «Лунохода-2»', '«Луноход-2» қашықтық рекордын басып озды'), 'jpl-record2014'],
    ['2018-06-10', T('Last contact during a global dust storm', 'Последняя связь во время глобальной пыльной бури', 'Ғаламдық шаң дауылы кезіндегі соңғы байланыс'), 'jpl-oppy-2019'],
    ['2019-02-13', T('Mission declared over', 'Миссия объявлена завершённой', 'Миссия аяқталды деп жарияланды'), 'jpl-oppy-2019'],
  ],
  imp: {
    sci: [T('Proved that water once soaked the rocks of Meridiani Planum, and later found gypsum veins left by gentler water.', 'Доказал, что породы Меридианы когда-то пропитывала вода, а позже нашёл гипсовые жилы, оставленные более мягкой водой.', 'Меридиана жыныстарын бір кездері су сіңдіргенін дәлелдеді, кейін жұмсағырақ су қалдырған гипс тамырларын тапты.'), ['squyres2004', 'squyres2012']],
    tech: [T('Ran for almost 15 years on solar power, helped by wind that cleaned its panels.', 'Почти 15 лет работал на солнечной энергии — помогал ветер, очищавший панели.', 'Күн энергиясымен 15 жылға жуық жұмыс істеді — панельдерін тазалаған жел көмектесті.'), ['six-things-oppy', 'jpl-oppy-2019']],
    fut: [T('Its 45.16 km record set the benchmark that Perseverance beat in 2026.', 'Его рекорд 45,16 км стал планкой, которую Perseverance превзошёл в 2026 году.', 'Оның 45,16 км рекорды Perseverance 2026 жылы асқан межеге айналды.'), ['jpl-perse-record']],
    hist: [T('Held the off-world distance record from 2014 to 2026.', 'Держал рекорд дальности на другом мире с 2014 по 2026 год.', '2014 жылдан 2026 жылға дейін басқа әлемдегі қашықтық рекордын ұстады.'), ['jpl-record2014', 'jpl-perse-record']],
    edu: [T('Named, with its twin Spirit, after a schoolgirl’s essay in a 2003 NASA contest.', 'Назван вместе с близнецом Spirit по сочинению школьницы на конкурсе NASA 2003 года.', 'Егізі Spirit-пен бірге 2003 жылғы NASA байқауындағы оқушы қыздың шығармасы бойынша аталды.'), ['jpl-naming2003']],
  },
  chg: [T('Mars was shown to have had liquid water at the surface in the past — first acidic, later milder.', 'Стало ясно, что на поверхности Марса когда-то была жидкая вода — сначала кислая, потом мягче.', 'Марс бетінде бір кездері сұйық су болғаны белгілі болды — алдымен қышқыл, кейін жұмсағырақ.'), ['squyres2004', 'klingelhofer2004', 'squyres2012']],
  val: [T('Its half of the ~$820 million project delivered 5,111 sols instead of 90 and 45 km instead of 1 km.', 'Его половина проекта стоимостью около 820 млн долларов дала 5111 солов вместо 90 и 45 км вместо 1 км.', 'Шамамен 820 млн долларлық жобаның оған тиесілі жартысы 90 солдың орнына 5111 сол және 1 км орнына 45 км берді.'), ['mer-presskit2004', 'jpl-oppy-2019']],
  ver: {
    ok: T('Found strong evidence of past water; far outlived its plan.', 'Нашёл убедительные следы древней воды; проработал намного дольше плана.', 'Ежелгі судың сенімді іздерін тапты; жоспардан әлдеқайда ұзақ жұмыс істеді.'),
    no: T('It could not survive the 2018 global dust storm.', 'Не пережил глобальную пыльную бурю 2018 года.', '2018 жылғы ғаламдық шаң дауылынан аман қала алмады.'),
    top: T('Proof of past water on Mars.', 'Доказательство древней воды на Марсе.', 'Марстағы ежелгі судың дәлелі.'),
    why: T('A 90-day rover that worked for almost 15 years.', 'Марсоход на 90 дней, который проработал почти 15 лет.', '90 күнге жасалып, 15 жылға жуық жұмыс істеген марсоход.'),
  },
  art: [T('The rover rests in Perseverance Valley on the western rim of Endeavour crater.', 'Марсоход стоит в долине Персеверанс на западном краю кратера Индевор.', 'Марсоход Индевор кратерінің батыс жиегіндегі Персеверанс алқабында тұр.'), ['jpl-oppy-2019', 'hirise-oppy2018']],
  cost: [COST_MER],
});

M({
  id: 'phoenix', site: 'phoenix', planet: 'mars', model: null,
  name: T('Phoenix', 'Phoenix', 'Phoenix'), agency: 'NASA / JPL / University of Arizona', country: 'USA', type: 'lander',
  launch: '2007-08-04', arrive: '2008-05-25', end: '2008-11-02', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: 68.22, lon: -125.75, conf: 'confirmed', ref: 'nasa-phx' },
  obj: T('Dig into the arctic plains of Mars to touch the ice seen from orbit and check whether the area could have been habitable.', 'Раскопать арктические равнины Марса, добраться до льда, замеченного с орбиты, и понять, мог ли этот район быть пригоден для жизни.', 'Марстың арктикалық жазығын қазып, орбитадан байқалған мұзға жету және бұл аймақ тіршілікке қолайлы болған-болмағанын анықтау.'),
  tl: [
    ['2007-08-04', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-phx'],
    ['2008-05-25', T('Landing in the northern plains', 'Посадка на северных равнинах', 'Солтүстік жазықтарға қонды'), 'nasa-phx'],
    ['2008-07-31', T('Water ice confirmed', 'Подтверждён водяной лёд', 'Су мұзы расталды'), 'jpl-phx-water'],
    ['2008-11-02', T('Last signal as winter approaches', 'Последний сигнал перед зимой', 'Қыс алдындағы соңғы сигнал'), 'jpl-phx-2010'],
    ['2010-05-24', T('Mission formally ended; images show a damaged solar panel', 'Миссия официально завершена; снимки показывают повреждённую панель', 'Миссия ресми аяқталды; суреттер зақымданған панельді көрсетті'), 'jpl-phx-2010'],
  ],
  imp: {
    sci: [T('Confirmed water ice just under the surface and found perchlorate salts in the soil.', 'Подтвердил водяной лёд прямо под поверхностью и нашёл в грунте перхлораты.', 'Бет астындағы су мұзын растап, топырақтан перхлораттар тапты.'), ['smith2009', 'hecht2009']],
    tech: [T('Its robotic arm dug trenches and delivered samples to an oven and a wet-chemistry laboratory.', 'Его манипулятор рыл траншеи и доставлял пробы в печь и в химическую лабораторию.', 'Оның манипуляторы ор қазып, сынамаларды пешке және химиялық зертханаға жеткізді.'), ['smith2009', 'hecht2009']],
    fut: [T('Perchlorate, found by Phoenix, changed how scientists read the Viking results.', 'Перхлораты, найденные Phoenix, изменили взгляд учёных на результаты «Викингов».', 'Phoenix тапқан перхлораттар ғалымдардың «Викингтер» нәтижелеріне көзқарасын өзгертті.'), ['navarro2010']],
    hist: [T('Landed farther north than any other Mars mission.', 'Сел севернее всех других марсианских миссий.', 'Басқа Марс миссияларының бәрінен солтүстікке қонды.'), ['nasa-phx']],
    edu: [T('Its laser instrument saw snow falling from Martian clouds.', 'Его лазерный прибор увидел снег, падающий из марсианских облаков.', 'Оның лазерлік құралы Марс бұлттарынан жауған қарды көрді.'), ['jpl-phx-snow']],
  },
  chg: [T('Water ice on Mars was touched and confirmed, not just inferred from orbit.', 'Лёд на Марсе потрогали и подтвердили, а не только вычислили по данным с орбиты.', 'Марстағы мұзды тек орбитадан болжап қана қоймай, ұстап көріп, растады.'), ['smith2009', 'jpl-phx-water']],
  val: [T('About $420 million (plus $37 million from Canada) bought direct confirmation of ice and a new picture of Martian soil chemistry.', 'Около 420 млн долларов (плюс 37 млн от Канады) дали прямое подтверждение льда и новую картину химии марсианского грунта.', 'Шамамен 420 млн доллар (Канададан тағы 37 млн) мұздың тікелей расталуын және Марс топырағы химиясының жаңа бейнесін берді.'), ['phx-presskit2008', 'smith2009', 'hecht2009']],
  ver: {
    ok: T('Ice and soil-chemistry goals met.', 'Задачи по льду и химии грунта выполнены.', 'Мұз бен топырақ химиясы бойынша міндеттер орындалды.'),
    no: T('It could not survive the polar winter — it was not designed to.', 'Не пережил полярную зиму — он и не был на это рассчитан.', 'Поляр қысынан аман шыға алмады — ол бұған есептелмеген еді.'),
    top: T('Ice confirmed under the surface.', 'Подтверждён лёд под поверхностью.', 'Бет астындағы мұз расталды.'),
    why: T('It touched Martian ice for the first time.', 'Он впервые прикоснулся к марсианскому льду.', 'Ол Марс мұзына алғаш рет жанасты.'),
  },
  art: [T('The lander stands at about 68° N in the northern plains; orbital images show a broken solar panel.', 'Аппарат стоит на северных равнинах, около 68° с. ш.; снимки с орбиты показывают сломанную солнечную панель.', 'Аппарат солтүстік жазықтарда, шамамен 68° с. е. тұр; орбиталық суреттер сынған күн панелін көрсетеді.'), ['jpl-phx-2010', 'nasa-phx']],
  cost: [
    { amt: 420e6, cur: 'USD', yr: T('2008', '2008', '2008'), scope: T('US investment: development, science instruments, launch and operations', 'Вклад США: разработка, научные приборы, запуск и управление', 'АҚШ үлесі: әзірлеу, ғылыми құралдар, ұшыру және басқару'), conf: 'official', ref: 'phx-presskit2008' },
    { amt: 37e6, cur: 'USD', yr: T('2008', '2008', '2008'), scope: T('Canadian Space Agency investment in the weather station', 'Вклад Канадского космического агентства в метеостанцию', 'Канада ғарыш агенттігінің метеостанцияға үлесі'), conf: 'official', ref: 'phx-presskit2008' },
  ],
});

M({
  id: 'insight', site: 'insight', planet: 'mars', model: 'insight-deployed',
  name: T('InSight', 'InSight', 'InSight'), agency: 'NASA / JPL, CNES, DLR', country: 'USA', type: 'lander',
  launch: '2018-05-05', arrive: '2018-11-26', end: '2022-12-15', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: { lat: 4.502, lon: 135.623, conf: 'confirmed', ref: 'golombek2020' },
  obj: T('Listen to marsquakes and measure the planet’s heat and wobble to learn how rocky planets are built inside.', 'Слушать марсотрясения и измерять тепло и покачивание планеты, чтобы понять, как устроены каменные планеты внутри.', 'Каменді ғаламшарлардың іші қалай құрылғанын білу үшін марс сілкіністерін тыңдап, ғаламшардың жылуы мен тербелісін өлшеу.'),
  tl: [
    ['2018-05-05', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-insight'],
    ['2018-11-26', T('Landing in Elysium Planitia', 'Посадка на равнине Элизий', 'Элизий жазығына қонды'), 'nasa-insight'],
    ['2019-04-06', T('First marsquake recorded', 'Записано первое марсотрясение', 'Алғашқы марс сілкінісі жазылды'), 'banerdt2020'],
    ['2021-01-09', T('Heat probe campaign ends at about 37 cm', 'Работа теплового зонда завершена на глубине около 37 см', 'Жылу зондының жұмысы шамамен 37 см тереңдікте аяқталды'), 'spohn2022'],
    ['2022-05-04', T('Largest marsquake recorded', 'Записано самое сильное марсотрясение', 'Ең күшті марс сілкінісі жазылды'), 'kawamura2022'],
    ['2022-12-15', T('Last contact; mission ended on 21 December', 'Последняя связь; 21 декабря миссия завершена', 'Соңғы байланыс; 21 желтоқсанда миссия аяқталды'), 'jpl-insight-2022'],
  ],
  imp: {
    sci: [T('Recorded 1,319 marsquakes and measured the crust and the liquid core.', 'Записал 1319 марсотрясений и измерил кору и жидкое ядро.', '1319 марс сілкінісін жазып, қыртыс пен сұйық ядроны өлшеді.'), ['jpl-insight-1319', 'stahler2021', 'knapmeyer2021']],
    tech: [T('Placed a seismometer directly on the Martian ground with a robotic arm.', 'Поставил сейсмометр прямо на марсианский грунт с помощью манипулятора.', 'Манипулятормен сейсмометрді тікелей Марс топырағына қойды.'), ['banerdt2020']],
    fut: [T('Its data still produce new results, such as a proposed solid inner core (2025).', 'Его данные до сих пор дают новые результаты — например, предполагаемое твёрдое внутреннее ядро (2025).', 'Оның деректері әлі жаңа нәтижелер береді — мысалы, болжамды қатты ішкі ядро (2025).'), ['bi2025']],
    hist: [T('The first mission dedicated to the deep interior of Mars.', 'Первая миссия, посвящённая недрам Марса.', 'Марс қойнауына арналған алғашқы миссия.'), ['banerdt2020']],
    edu: [T('NASA uses its results in classroom materials about how planets are built.', 'NASA использует его результаты в учебных материалах о строении планет.', 'NASA оның нәтижелерін ғаламшарлардың құрылысы туралы оқу материалдарында қолданады.'), ['jpl-edu-insight']],
  },
  chg: [T('Mars got a measured interior: crust, mantle and core sizes from real seismic data.', 'Недра Марса впервые измерены: толщина коры, мантии и размер ядра — по настоящим сейсмоданным.', 'Марс қойнауы алғаш өлшенді: қыртыс, мантия қалыңдығы және ядро өлшемі — нақты сейсмикалық деректермен.'), ['stahler2021', 'knapmeyer2021']],
  val: [T('A US investment of $813.8 million, plus about $180 million from France and Germany, delivered the first seismic picture of another planet’s interior.', 'Вклад США в 813,8 млн долларов и около 180 млн от Франции и Германии дали первую сейсмическую картину недр другой планеты.', 'АҚШ-тың 813,8 млн доллар үлесі және Франция мен Германиядан шамамен 180 млн басқа ғаламшар қойнауының алғашқы сейсмикалық бейнесін берді.'), ['ins-facts', 'stahler2021']],
  ver: {
    ok: T('Seismology and rotation goals met.', 'Задачи сейсмологии и измерения вращения выполнены.', 'Сейсмология және айналуды өлшеу міндеттері орындалды.'),
    no: T('The heat probe reached only about 37 cm instead of several metres, so heat flow was not measured.', 'Тепловой зонд ушёл лишь на 37 см вместо нескольких метров, поэтому тепловой поток не измерен.', 'Жылу зонды бірнеше метр орнына тек шамамен 37 см ғана енді, сондықтан жылу ағыны өлшенбеді.'),
    top: T('The first look inside Mars.', 'Первый взгляд внутрь Марса.', 'Марстың ішіне алғашқы көзқарас.'),
    why: T('It heard Mars shake 1,319 times.', 'Он услышал, как Марс вздрогнул 1319 раз.', 'Ол Марстың 1319 рет дірілдегенін естіді.'),
  },
  art: [T('The lander and its seismometer remain in Elysium Planitia, covered in dust.', 'Аппарат и его сейсмометр стоят на равнине Элизий, покрытые пылью.', 'Аппарат пен оның сейсмометрі шаң басқан күйде Элизий жазығында тұр.'), ['jpl-insight-2022', 'golombek2020']],
  cost: [
    { amt: 813.8e6, cur: 'USD', yr: T('2018', '2018', '2018'), scope: T('US investment, as stated in the landing press kit', 'Вклад США по пресс-киту посадки', 'Қону пресс-киті бойынша АҚШ үлесі'), conf: 'official', ref: 'ins-facts' },
    { amt: 180e6, cur: 'USD', yr: T('2018, approximate', '2018, примерно', '2018, шамамен'), scope: T('Contributions from France (CNES) and Germany (DLR)', 'Вклад Франции (CNES) и Германии (DLR)', 'Франция (CNES) мен Германияның (DLR) үлесі'), conf: 'official', ref: 'ins-facts' },
    { amt: 18.5e6, cur: 'USD', yr: T('2018', '2018', '2018'), scope: T('MarCO relay cubesats, funded separately', 'Кубсаты-ретрансляторы MarCO, финансировались отдельно', 'MarCO ретранслятор-кубсаттары, бөлек қаржыландырылды'), conf: 'official', ref: 'ins-facts' },
  ],
});

M({
  id: 'curiosity', site: 'curiosity', planet: 'mars', model: 'curiosity',
  name: T('Curiosity (Mars Science Laboratory)', 'Curiosity (Mars Science Laboratory)', 'Curiosity (Mars Science Laboratory)'), agency: 'NASA / JPL', country: 'USA', type: 'rover',
  launch: '2011-11-26', arrive: '2012-08-06', end: null, outcome: 'success', op: 'operational', phys: 'soft', still: true,
  coords: { lat: -4.5895, lon: 137.4416, conf: 'confirmed', ref: 'mmgis-msl', note: T('Landing point (Bradbury Landing). The rover is now far away, on Mount Sharp.', 'Точка посадки (Брэдбери). Сейчас марсоход далеко отсюда, на горе Шарп.', 'Қону нүктесі (Брэдбери). Қазір марсоход бұл жерден алыста, Шарп тауында.') },
  obj: T('Find out whether Gale crater ever offered conditions suitable for microbial life.', 'Выяснить, были ли когда-нибудь в кратере Гейл условия, пригодные для микробов.', 'Гейл кратерінде бір кездері микробтарға қолайлы жағдай болған-болмағанын анықтау.'),
  tl: [
    ['2011-11-26', T('Launch', 'Запуск', 'Ұшырылды'), 'nasa-msl'],
    ['2012-08-06', T('“Sky crane” landing in Gale crater', 'Посадка в кратере Гейл с помощью «небесного крана»', '«Аспан краны» көмегімен Гейл кратеріне қонды'), 'msl-presskit2012'],
    ['2013-03-12', T('Ancient habitable lake announced', 'Объявлено о древнем озере, пригодном для жизни', 'Тіршілікке қолайлы ежелгі көл жарияланды'), 'jpl-msl-2013'],
    ['2014-09-11', T('Reaches the base of Mount Sharp', 'Добирается до подножия горы Шарп', 'Шарп тауының етегіне жетті'), 'jpl-msl-sharp2014'],
    ['2026-08-29', T('Sol 5,000 on Mars', '5000-й сол на Марсе', 'Марстағы 5000-шы сол'), 'jpl-pia26700'],
  ],
  imp: {
    sci: [T('Showed that Gale crater once held a lake with the chemistry life needs; later found complex organic molecules.', 'Показал, что в кратере Гейл было озеро с нужной для жизни химией; позже нашёл сложные органические молекулы.', 'Гейл кратерінде тіршілікке қажетті химиясы бар көл болғанын көрсетті; кейін күрделі органикалық молекулалар тапты.'), ['grotzinger2014', 'freissinet2025']],
    tech: [T('The first “sky crane” landing, lowering a rover of almost a tonne on cables.', 'Первая посадка «небесным краном»: марсоход массой почти в тонну опустили на тросах.', 'Алғашқы «аспан краны» қонуы: салмағы бір тоннаға жуық марсоход арқанмен түсірілді.'), ['msl-presskit2012']],
    fut: [T('Measured the radiation future astronauts would face, and its design was reused for Perseverance.', 'Измерил радиацию, с которой столкнутся будущие астронавты; его конструкцию повторили в Perseverance.', 'Болашақ астронавтар кездесетін радиацияны өлшеді; оның құрылымы Perseverance-те қайталанды.'), ['hassler2014', 'farley2020']],
    hist: [T('Has worked more than 5,000 Martian days (2026).', 'Проработал больше 5000 марсианских суток (2026).', '5000-нан астам Марс тәулігі жұмыс істеді (2026).'), ['jpl-pia26700']],
    edu: [T('NASA marked its 5,000th Martian day in 2026 with a panoramic “postcard”.', 'В 2026 году NASA отметило его 5000-й сол панорамной «открыткой».', '2026 жылы NASA оның 5000-шы солын панорамалық «ашықхатпен» атап өтті.'), ['jpl-pia26700']],
  },
  chg: [T('The question changed from “was there water?” to “could life have lived there?” — and for ancient Gale the answer was yes.', 'Вопрос сменился с «была ли вода?» на «могла ли там жить жизнь?» — и для древнего Гейла ответ оказался «да».', 'Сұрақ «су болды ма?» дегеннен «онда тіршілік бола алды ма?» дегенге ауысты — ежелгі Гейл үшін жауап «иә» болды.'), ['grotzinger2014', 'jpl-msl-2013']],
  val: [T('$2.5 billion through landing has delivered 14 years of exploration, an ancient habitable lake and the first radiation record on the surface.', '2,5 млрд долларов до посадки дали 14 лет исследований, древнее пригодное для жизни озеро и первые замеры радиации на поверхности.', 'Қонуға дейінгі 2,5 млрд доллар 14 жылдық зерттеу, тіршілікке қолайлы ежелгі көл және беттегі радиацияның алғашқы өлшемін берді.'), ['msl-presskit2012', 'grotzinger2014', 'hassler2014']],
  ver: {
    ok: T('Habitability goal achieved; still driving.', 'Задача о пригодности для жизни решена; марсоход всё ещё едет.', 'Тіршілікке қолайлылық міндеті шешілді; марсоход әлі жүріп келеді.'),
    no: T('No biosignature confirmed (not one of its main goals).', 'Признаки жизни не подтверждены (это не было главной целью).', 'Тіршілік белгілері расталмады (бұл басты мақсат емес еді).'),
    top: T('An ancient lake that could have hosted life.', 'Древнее озеро, где могла бы жить жизнь.', 'Тіршілік бола алатын ежелгі көл.'),
    why: T('It showed that Mars once could have hosted life.', 'Он показал, что на Марсе когда-то могла существовать жизнь.', 'Ол Марста бір кездері тіршілік бола алғанын көрсетті.'),
  },
  art: [T('Still working: the rover is climbing Mount Sharp, far from its landing point at Bradbury Landing.', 'Марсоход работает: он поднимается на гору Шарп, далеко от места посадки.', 'Марсоход жұмыс істеп тұр: ол қону орнынан алыста, Шарп тауына көтеріліп келеді.'), ['nasa-msl', 'mmgis-msl']],
  cost: [
    { amt: 2.5e9, cur: 'USD', yr: T('2012', '2012', '2012'), scope: T('Mission through landing in 2012, including $1.8 billion for spacecraft development and science; extended missions excluded', 'Миссия до посадки в 2012 году, в том числе 1,8 млрд на разработку и науку; продления не включены', '2012 жылғы қонуға дейінгі миссия, оның ішінде әзірлеу мен ғылымға 1,8 млрд; ұзартулар кірмейді'), conf: 'official', ref: 'msl-presskit2012' },
    { amt: 2.5e9, cur: 'USD', yr: T('2011', '2011', '2011'), scope: T('Project cost examined in the 2011 Inspector General audit', 'Стоимость проекта, проверенная аудитом генерального инспектора в 2011 году', '2011 жылы бас инспектор аудиті тексерген жоба құны'), conf: 'audited', ref: 'oig-ig11019' },
  ],
});

M({
  id: 'perseverance', site: 'perseverance', planet: 'mars', model: null,
  name: T('Perseverance (Mars 2020)', 'Perseverance (Mars 2020)', 'Perseverance (Mars 2020)'), agency: 'NASA / JPL', country: 'USA', type: 'rover',
  launch: '2020-07-30', arrive: '2021-02-18', end: null, outcome: 'success', op: 'operational', phys: 'soft', still: true,
  coords: { lat: 18.4446, lon: 77.4509, conf: 'confirmed', ref: 'mmgis-m2020', note: T('Landing point (Octavia E. Butler Landing).', 'Точка посадки (Октавия Батлер).', 'Қону нүктесі (Октавия Батлер).') },
  obj: T('Search for signs of ancient life in Jezero crater and collect rock samples for possible return to Earth.', 'Искать следы древней жизни в кратере Езеро и собирать образцы пород для возможной доставки на Землю.', 'Езеро кратерінен ежелгі тіршілік іздерін іздеу және Жерге жеткізу үшін жыныс үлгілерін жинау.'),
  tl: [
    ['2020-07-30', T('Launch', 'Запуск', 'Ұшырылды'), 'm2020-presskit2021'],
    ['2021-02-18', T('Landing in Jezero crater', 'Посадка в кратере Езеро', 'Езеро кратеріне қонды'), 'm2020-presskit2021'],
    ['2021-04-19', T('Ingenuity makes the first powered flight on another planet', 'Ingenuity совершает первый управляемый полёт на другой планете', 'Ingenuity басқа ғаламшардағы алғашқы басқарылатын ұшуды жасады'), 'jpl-ingenuity'],
    ['2023-01-29', T('Sample depot completed at Three Forks', 'Хранилище образцов «Три развилки» готово', '«Үш айырық» үлгілер қоймасы дайын болды'), 'jpl-depot'],
    ['2024-07-21', T('“Cheyava Falls” rock cored (“Sapphire Canyon” sample)', 'Взят керн камня «Чеява-Фолс» (образец «Сапфировый каньон»)', '«Чеява-Фолс» тасынан керн алынды («Сапфир шатқалы» үлгісі)'), 'hurowitz2025'],
    ['2026-10-11', T('Off-world distance record: 45.22 km', 'Рекорд дальности на другом мире: 45,22 км', 'Басқа әлемдегі қашықтық рекорды: 45,22 км'), 'jpl-perse-record'],
  ],
  imp: {
    sci: [T('Its “Sapphire Canyon” sample holds a potential biosignature — features that could have a biological origin, but are not proof of life.', 'Образец «Сапфировый каньон» содержит возможный признак жизни — то, что могло бы иметь биологическое происхождение, но не доказательство жизни.', '«Сапфир шатқалы» үлгісінде тіршіліктің ықтимал белгісі бар — биологиялық шығу тегі болуы мүмкін, бірақ тіршіліктің дәлелі емес.'), ['hurowitz2025']],
    tech: [T('Drove more than 90% of its route with AutoNav and made oxygen from the Martian air with MOXIE.', 'Прошёл больше 90% пути на автопилоте AutoNav и получил кислород из марсианского воздуха прибором MOXIE.', 'Жолдың 90%-дан астамын AutoNav автонавигациясымен жүріп, MOXIE құралымен Марс ауасынан оттегі алды.'), ['jpl-perse-record', 'jpl-moxie', 'verma2023']],
    fut: [T('Left a depot of sealed sample tubes for a future return mission.', 'Оставил хранилище запечатанных пробирок для будущей миссии доставки.', 'Болашақ жеткізу миссиясы үшін мөрленген сынауықтар қоймасын қалдырды.'), ['jpl-depot']],
    hist: [T('Set the off-world driving record (45.22 km) on 11 October 2026.', 'Установил рекорд дальности на другом мире (45,22 км) 11 октября 2026 года.', '2026 жылғы 11 қазанда басқа әлемдегі қашықтық рекордын (45,22 км) орнатты.'), ['jpl-perse-record']],
    edu: [T('Carried the first microphones that recorded the sounds of Mars.', 'Привёз первые микрофоны, записавшие звуки Марса.', 'Марс дыбыстарын жазған алғашқы микрофондарды әкелді.'), ['maurice2022']],
  },
  chg: [T('The search for life moved from habitability to collecting samples that could one day be studied on Earth.', 'Поиск жизни перешёл от вопроса о пригодности к сбору образцов, которые однажды можно будет изучить на Земле.', 'Тіршілік іздеу қолайлылық мәселесінен бір күні Жерде зерттеуге болатын үлгілерді жинауға ауысты.'), ['farley2020']],
  val: [T('About $2.7 billion (build, launch and prime mission) has produced cached samples, a distance record and a potential biosignature.', 'Около 2,7 млрд долларов (создание, запуск и основная миссия) дали собранные образцы, рекорд дальности и возможный признак жизни.', 'Шамамен 2,7 млрд доллар (жасау, ұшыру және негізгі миссия) жиналған үлгілер, қашықтық рекорды және тіршіліктің ықтимал белгісін берді.'), ['m2020-presskit2021', 'hurowitz2025', 'jpl-perse-record']],
  ver: {
    ok: T('Sampling and exploration goals met so far; still working.', 'Задачи по сбору образцов и исследованию пока выполняются; марсоход работает.', 'Үлгі жинау мен зерттеу міндеттері әзірге орындалуда; марсоход жұмыс істеп тұр.'),
    no: T('Sample return is not scheduled: the NASA–ESA Mars Sample Return programme is listed as cancelled (2026).', 'Доставка образцов не запланирована: программа NASA и ESA Mars Sample Return значится отменённой (2026).', 'Үлгілерді жеткізу жоспарланбаған: NASA мен ESA-ның Mars Sample Return бағдарламасы тоқтатылған деп көрсетілген (2026).'),
    top: T('A potential biosignature.', 'Возможный признак жизни.', 'Тіршіліктің ықтимал белгісі.'),
    why: T('It may have found the best clue yet to life on Mars.', 'Возможно, он нашёл лучшую на сегодня подсказку о жизни на Марсе.', 'Ол Марстағы тіршілік туралы бүгінгі ең жақсы белгіні тапқан болуы мүмкін.'),
  },
  art: [T('Still working in and around Jezero crater; ten sealed sample tubes wait at the Three Forks depot.', 'Работает в кратере Езеро и вокруг него; десять запечатанных пробирок ждут в хранилище «Три развилки».', 'Езеро кратерінде және оның маңында жұмыс істеп жүр; он мөрленген сынауық «Үш айырық» қоймасында күтіп тұр.'), ['jpl-depot']],
  cost: [
    { amt: 2.4e9, cur: 'USD', yr: T('2021', '2021', '2021'), scope: T('Building and launching the mission', 'Создание и запуск миссии', 'Миссияны жасау және ұшыру'), conf: 'official', ref: 'm2020-presskit2021' },
    { amt: 300e6, cur: 'USD', yr: T('2021', '2021', '2021'), scope: T('Landing and prime-mission operations', 'Посадка и основная миссия', 'Қону және негізгі миссия'), conf: 'official', ref: 'm2020-presskit2021' },
  ],
});

/* ---------- Другие миры ---------- */
M({
  id: 'venera-13', site: null, planet: 'venus', model: null,
  name: T('Venera 13', 'Венера-13', 'Венера-13'), agency: 'Lavochkin', country: 'USSR', type: 'lander',
  launch: '1981-10-30', arrive: '1982-03-01', end: '1982-03-01', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: null,
  obj: T('Land on Venus, photograph the surface in colour and analyse the soil.', 'Сесть на Венеру, снять поверхность в цвете и исследовать грунт.', 'Шолпанға қонып, бетін түрлі түсте түсіру және топырақты зерттеу.'),
  story: T('Venera 13 worked on the surface of Venus for 127 minutes, in heat of about 460 °C and crushing pressure, and sent the first colour panoramas of that world.', '«Венера-13» проработала на поверхности Венеры 127 минут при жаре около 460 °C и огромном давлении и передала первые цветные панорамы этого мира.', '«Венера-13» Шолпан бетінде шамамен 460 °C ыстықта және орасан қысымда 127 минут жұмыс істеп, сол әлемнің алғашқы түрлі түсті панорамаларын жіберді.'),
  tl: [
    ['1981-10-30', T('Launch', 'Запуск', 'Ұшырылды'), 'siddiqi2018'],
    ['1982-03-01', T('Landing; works for 127 minutes', 'Посадка; аппарат работает 127 минут', 'Қону; аппарат 127 минут жұмыс істеді'), 'siddiqi2018'],
    ['1984', T('Soil composition results published', 'Опубликован состав грунта', 'Топырақ құрамы жарияланды'), 'surkov1984'],
  ],
  imp: {
    sci: [T('Measured the chemical composition of Venus rock on the spot.', 'Измерила химический состав венерианского грунта на месте.', 'Шолпан жынысының химиялық құрамын орнында өлшеді.'), ['surkov1984']],
    tech: [T('Survived 127 minutes in heat of about 460 °C and crushing pressure.', 'Продержалась 127 минут при жаре около 460 °C и огромном давлении.', 'Шамамен 460 °C ыстықта және орасан қысымда 127 минут шыдады.'), ['siddiqi2018']],
    fut: null,
    hist: [T('The first colour pictures from the surface of Venus.', 'Первые цветные снимки с поверхности Венеры.', 'Шолпан бетінен алғашқы түрлі түсті суреттер.'), ['siddiqi2018']],
    edu: null,
  },
  chg: [T('Venus went from a cloud-covered mystery to a place with a photographed surface.', 'Венера из скрытой облаками загадки превратилась в место со снятой поверхностью.', 'Шолпан бұлтпен жабылған жұмбақтан беті суретке түскен орынға айналды.'), ['siddiqi2018']],
  val: [T('Two hours of data from one of the harshest places in the Solar System.', 'Два часа данных из одного из самых суровых мест Солнечной системы.', 'Күн жүйесінің ең қатал жерлерінің бірінен екі сағаттық дерек.'), ['siddiqi2018']],
  ver: {
    ok: T('Landed, took colour pictures and analysed the soil.', 'Села, сняла цветные панорамы и исследовала грунт.', 'Қонып, түрлі түсті суреттер түсіріп, топырақты зерттеді.'),
    no: T('No missed objective is documented in our sources.', 'Невыполненных задач в наших источниках не указано.', 'Біздің дереккөздерде орындалмаған міндет көрсетілмеген.'),
    top: T('The first colour panoramas of Venus.', 'Первые цветные панорамы Венеры.', 'Шолпанның алғашқы түрлі түсті панорамалары.'),
    why: T('No machine had seen the surface of Venus in colour before.', 'До неё ни один аппарат не видел поверхность Венеры в цвете.', 'Одан бұрын ешбір аппарат Шолпан бетін түрлі түсте көрмеген.'),
  },
  art: [T('The lander remains on the surface of Venus.', 'Аппарат остался на поверхности Венеры.', 'Аппарат Шолпан бетінде қалды.'), ['siddiqi2018']],
  cost: [],
});

M({
  id: 'huygens', site: null, planet: 'titan', model: null,
  name: T('Huygens', 'Гюйгенс', 'Гюйгенс'), agency: 'ESA', country: 'Europe', type: 'lander',
  launch: '1997-10-15', arrive: '2005-01-14', end: '2005-01-14', outcome: 'success', op: 'ended', phys: 'soft', still: true,
  coords: null,
  obj: T('Descend through Titan’s thick atmosphere, measure it and land on the surface of Saturn’s largest moon.', 'Спуститься сквозь плотную атмосферу Титана, изучить её и сесть на поверхность самого большого спутника Сатурна.', 'Титанның тығыз атмосферасы арқылы түсіп, оны зерттеп, Сатурнның ең үлкен серігінің бетіне қону.'),
  story: T('Huygens rode to Saturn on the Cassini orbiter. On 14 January 2005 it parachuted for about two and a half hours through Titan’s haze and sent data from the surface for another 72 minutes.', '«Гюйгенс» долетел до Сатурна на аппарате «Кассини». 14 января 2005 года он около двух с половиной часов спускался на парашюте сквозь дымку Титана и ещё 72 минуты передавал данные с поверхности.', '«Гюйгенс» Сатурнға «Кассини» аппаратымен жетті. 2005 жылғы 14 қаңтарда ол Титан тұманы арқылы парашютпен шамамен екі жарым сағат түсіп, беттен тағы 72 минут дерек жіберді.'),
  tl: [
    ['1997-10-15', T('Launch with Cassini', 'Запуск вместе с «Кассини»', '«Кассинимен» бірге ұшырылды'), 'esa-cassini-fs'],
    ['2004-12-25', T('Separates from Cassini', 'Отделяется от «Кассини»', '«Кассиниден» бөлінді'), 'lebreton2005'],
    ['2005-01-14', T('Descent and landing on Titan; 72 minutes of surface data', 'Спуск и посадка на Титан; 72 минуты данных с поверхности', 'Титанға түсу және қону; беттен 72 минут дерек'), 'lebreton2005'],
  ],
  imp: {
    sci: [T('Photographed river channels and rounded pebbles shaped by liquid methane.', 'Сфотографировал русла и окатанные камешки, созданные жидким метаном.', 'Сұйық метан жасаған арналар мен домаланған ұсақ тастарды түсірді.'), ['tomasko2005']],
    tech: [T('The only landing ever made in the outer Solar System.', 'Единственная посадка во внешней Солнечной системе.', 'Күн жүйесінің сыртқы бөлігіндегі жалғыз қону.'), ['esa-huygens10']],
    fut: null,
    hist: [T('The first landing on a moon other than our own.', 'Первая посадка на спутник другой планеты.', 'Басқа ғаламшар серігіне алғашқы қону.'), ['lebreton2005']],
    edu: null,
  },
  chg: [T('Titan was revealed as a world with Earth-like landscapes carved by methane instead of water.', 'Титан оказался миром с земными пейзажами, только вырезанными метаном вместо воды.', 'Титан жер тәрізді табиғаты бар, бірақ оны су емес, метан қашаған әлем болып шықты.'), ['tomasko2005', 'esa-cassini-fs']],
  val: [T('Part of the $3.9 billion Cassini–Huygens mission; the probe itself returned a few hours of unique data.', 'Часть миссии «Кассини — Гюйгенс» стоимостью 3,9 млрд долларов; сам зонд передал несколько часов уникальных данных.', '3,9 млрд долларлық «Кассини — Гюйгенс» миссиясының бөлігі; зондтың өзі бірнеше сағаттық бірегей дерек берді.'), ['nasa-cassini-qf', 'lebreton2005']],
  ver: {
    ok: T('Descent and landing succeeded; surface data returned.', 'Спуск и посадка удались; данные с поверхности получены.', 'Түсу мен қону сәтті болды; беттен деректер алынды.'),
    no: T('One of its two radio channels was lost, so part of the planned data never arrived.', 'Один из двух радиоканалов был потерян, и часть запланированных данных не пришла.', 'Екі радиоарнаның бірі жоғалып, жоспарланған деректердің бір бөлігі келмеді.'),
    top: T('The first pictures from Titan’s surface.', 'Первые снимки с поверхности Титана.', 'Титан бетінен алғашқы суреттер.'),
    why: T('The most distant landing humanity has made.', 'Самая далёкая посадка в истории человечества.', 'Адамзат тарихындағы ең алыс қону.'),
  },
  art: [T('The probe remains on the surface of Titan.', 'Зонд остался на поверхности Титана.', 'Зонд Титан бетінде қалды.'), ['lebreton2005']],
  cost: [{ amt: 3.9e9, cur: 'USD', yr: T('total, as stated by NASA', 'итог по данным NASA', 'NASA деректері бойынша жалпы'), scope: T('Entire Cassini–Huygens mission (orbiter, probe, launch and operations), including ESA and ASI contributions — not Huygens alone', 'Вся миссия «Кассини — Гюйгенс» (орбитальный аппарат, зонд, запуск и управление) с вкладом ESA и ASI — не только «Гюйгенс»', 'Бүкіл «Кассини — Гюйгенс» миссиясы (орбиталық аппарат, зонд, ұшыру және басқару) ESA мен ASI үлесімен — тек «Гюйгенс» емес'), conf: 'official', ref: 'nasa-cassini-qf' }],
});

M({
  id: 'philae', site: null, planet: 'comet', model: null,
  name: T('Philae (Rosetta)', 'Филы («Розетта»)', 'Филы («Розетта»)'), agency: 'ESA', country: 'Europe', type: 'lander',
  launch: '2004-03-02', arrive: '2014-11-12', end: '2014-11-15', outcome: 'partial', op: 'ended', phys: 'soft', still: true,
  coords: null,
  obj: T('Make the first landing on a comet nucleus and analyse its surface material.', 'Впервые сесть на ядро кометы и изучить вещество её поверхности.', 'Комета ядросына алғаш қонып, оның бетіндегі затты зерттеу.'),
  story: T('Philae travelled ten years with the Rosetta spacecraft. On 12 November 2014 it touched comet 67P/Churyumov–Gerasimenko, bounced twice and came to rest in shadow, working for about 64 hours on its battery.', 'Филы десять лет летел вместе с аппаратом «Розетта». 12 ноября 2014 года он коснулся кометы Чурюмова — Герасименко, дважды отскочил и остановился в тени, проработав около 64 часов на батарее.', 'Филы «Розетта» аппаратымен бірге он жыл ұшты. 2014 жылғы 12 қарашада ол Чурюмов — Герасименко кометасына тиіп, екі рет секіріп, көлеңкеде тоқтады да, батареямен шамамен 64 сағат жұмыс істеді.'),
  tl: [
    ['2004-03-02', T('Launch with Rosetta', 'Запуск вместе с «Розеттой»', '«Розеттамен» бірге ұшырылды'), 'esa-rosetta-eom'],
    ['2014-11-12', T('Lands on comet 67P after bouncing twice', 'Садится на комету 67P, дважды отскочив', 'Екі рет секіріп, 67P кометасына қонды'), 'biele2015'],
    ['2014-11-15', T('Battery runs down after about 64 hours', 'Батарея садится примерно через 64 часа', 'Батарея шамамен 64 сағаттан кейін отырды'), 'bibring2015'],
    ['2016-09', T('Found in Rosetta images, wedged in a dark crack', 'Найден на снимках «Розетты» в тёмной расщелине', '«Розетта» суреттерінен қараңғы жарықшақтан табылды'), 'esa-rosetta-eom'],
  ],
  imp: {
    sci: [T('Measured organic compounds and the mechanical properties of the comet’s surface.', 'Измерил органические соединения и механические свойства поверхности кометы.', 'Органикалық қосылыстарды және комета бетінің механикалық қасиеттерін өлшеді.'), ['bibring2015']],
    tech: [T('Showed how hard it is to anchor on a comet: its harpoons did not fire and it bounced twice.', 'Показал, как трудно закрепиться на комете: гарпуны не выстрелили, и он дважды отскочил.', 'Кометаға бекінудің қиындығын көрсетті: гарпундар атылмай, ол екі рет секірді.'), ['biele2015']],
    fut: null,
    hist: [T('The first soft landing on a comet (12 November 2014).', 'Первая мягкая посадка на комету (12 ноября 2014 года).', 'Кометаға алғашқы жұмсақ қону (2014 жылғы 12 қараша).'), ['bibring2015']],
    edu: null,
  },
  chg: [T('A comet became a place one can land on, not just fly past.', 'Комета стала местом, куда можно сесть, а не только пролететь мимо.', 'Комета тек жанынан ұшып өтетін емес, қонуға болатын орынға айналды.'), ['bibring2015']],
  val: [T('Philae’s share was €220 million of Rosetta’s €1.4 billion; it returned about 64 hours of first-hand data.', 'Доля Филы — 220 млн евро из 1,4 млрд евро «Розетты»; он передал около 64 часов данных с места.', 'Филының үлесі — «Розеттаның» 1,4 млрд еуросының 220 млн-ы; ол орнынан шамамен 64 сағаттық дерек жіберді.'), ['esa-rosetta-fs', 'bibring2015']],
  ver: {
    ok: T('Landed and returned the first data from a comet’s surface.', 'Сел и передал первые данные с поверхности кометы.', 'Қонып, комета бетінен алғашқы деректерді жіберді.'),
    no: T('It came to rest in shadow, so its batteries could not recharge for long operations.', 'Он остановился в тени, и батареи не смогли зарядиться для долгой работы.', 'Ол көлеңкеде тоқтап, батареялары ұзақ жұмысқа зарядтала алмады.'),
    top: T('The first landing on a comet.', 'Первая посадка на комету.', 'Кометаға алғашқы қону.'),
    why: T('A bouncing, brave first touch of a comet.', 'Смелое, хоть и подпрыгивающее, первое касание кометы.', 'Кометаға секіре-секіре болса да батыл алғашқы жанасу.'),
  },
  art: [T('The lander remains wedged in a dark crack on comet 67P/Churyumov–Gerasimenko.', 'Аппарат остался в тёмной расщелине на комете Чурюмова — Герасименко.', 'Аппарат Чурюмов — Герасименко кометасындағы қараңғы жарықшақта қалды.'), ['esa-rosetta-eom']],
  cost: [
    { amt: 1.4e9, cur: 'EUR', yr: T('mission total', 'итог миссии', 'миссия бойынша барлығы'), scope: T('Entire Rosetta mission: launch, spacecraft, payload including Philae, operations', 'Вся миссия «Розетта»: запуск, аппарат, приборы вместе с Филы, управление', 'Бүкіл «Розетта» миссиясы: ұшыру, аппарат, Филыны қоса құралдар, басқару'), conf: 'official', ref: 'esa-rosetta-fs' },
    { amt: 220e6, cur: 'EUR', yr: T('included above', 'входит в сумму выше', 'жоғарыдағы сомаға кіреді'), scope: T('Total Philae lander costs', 'Все затраты на посадочный аппарат Филы', 'Филы қонатын аппаратына жұмсалған барлық шығын'), conf: 'official', ref: 'esa-rosetta-fs' },
  ],
});

/* ---------- Дополнительные источники, на которые ссылаются профили ---------- */
REF_LIST.push(
  ['nasa-pathfinder20', ['mars-pathfinder'], 'history', 2017, 'The Day the Internet Stood Still', 'NASA (Brian Dunbar)', 'https://www.nasa.gov/specials/pathfinder20/', 'v',
    { en: 'Huge online interest in the first Pathfinder images', ru: 'Огромный интерес в интернете к первым снимкам Pathfinder', kk: 'Pathfinder-дің алғашқы суреттеріне интернеттегі орасан қызығушылық' }],
  ['jpl-naming2003', ['spirit', 'opportunity'], 'history', 2003, 'Girl With Dreams Names Mars Rovers ‘Spirit’ and ‘Opportunity’ (archived copy)', 'NASA/JPL', 'https://web.archive.org/web/20240416013634/https://mars.nasa.gov/mer/newsroom/pressreleases/20030608a.html', 'n',
    { en: 'The rovers were named after a schoolgirl’s winning essay', ru: 'Марсоходы назвали по сочинению школьницы, победившему в конкурсе', kk: 'Марсоходтар байқауда жеңген оқушы қыздың шығармасы бойынша аталды' }],
  ['jpl-oppy-wet2004', ['opportunity'], 'result', 2004, 'Opportunity Rover Finds Strong Evidence Meridiani Planum Was Wet', 'NASA JPL', 'https://www.jpl.nasa.gov/news/opportunity-rover-finds-strong-evidence-meridiani-planum-was-wet/', 'v',
    { en: 'Announcement of water evidence (2 March 2004)', ru: 'Сообщение о следах воды (2 марта 2004)', kk: 'Су іздері туралы хабар (2004 жылғы 2 наурыз)' }],
  ['hirise-oppy2018', ['opportunity'], 'data', 2018, 'HiRISE ESP_056955_1775: Opportunity Rover in Western Endeavour Crater', 'HiRISE / University of Arizona', 'https://www.uahirise.org/ESP_056955_1775', 'v',
    { en: 'Orbital image of the rover in Perseverance Valley (2018)', ru: 'Снимок марсохода в долине Персеверанс с орбиты (2018)', kk: 'Персеверанс алқабындағы марсоходтың орбиталық суреті (2018)' }],
  ['jpl-phx-snow', ['phoenix'], 'result', 2008, 'NASA Mars Lander Sees Falling Snow, Soil Data Suggest Liquid Past', 'NASA JPL', 'https://www.jpl.nasa.gov/news/nasa-mars-lander-sees-falling-snow-soil-data-suggest-liquid-past/', 'v',
    { en: 'Snow detected falling from clouds', ru: 'Замечен снег, падающий из облаков', kk: 'Бұлттан жауған қар байқалды' }],
  ['kawamura2022', ['insight'], 'paper', 2022, 'S1222a — The Largest Marsquake Detected by InSight', 'T. Kawamura et al. (Geophysical Research Letters)', 'https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2022GL101543', 'v',
    { en: 'The largest marsquake recorded (4 May 2022)', ru: 'Самое сильное записанное марсотрясение (4 мая 2022)', kk: 'Жазылған ең күшті марс сілкінісі (2022 жылғы 4 мамыр)' }],
  ['jpl-msl-sharp2014', ['curiosity'], 'result', 2014, 'NASA’s Mars Curiosity Rover Arrives at Martian Mountain', 'NASA JPL', 'https://www.jpl.nasa.gov/news/nasas-mars-curiosity-rover-arrives-at-martian-mountain/', 'v',
    { en: 'Arrival at the base of Mount Sharp (September 2014)', ru: 'Прибытие к подножию горы Шарп (сентябрь 2014)', kk: 'Шарп тауының етегіне келу (2014 жылғы қыркүйек)' }],
  ['mmgis-m2020', ['perseverance'], 'data', 2026, 'M20_waypoints.json (traverse data)', 'NASA MMGIS', 'https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json', 'v',
    { en: 'Landing point and route of the rover', ru: 'Точка посадки и маршрут марсохода', kk: 'Марсоходтың қону нүктесі мен маршруты' }],
  ['nasa-ody-25', ['mars-odyssey'], 'result', 2026, 'Odyssey Celebrates 25 Years', 'NASA Science', 'https://science.nasa.gov/mission/odyssey/odyssey-celebrates-25-years/', 'v',
    { en: 'Quarter-century anniversary (April 2026)', ru: 'Четверть века работы (апрель 2026)', kk: 'Ширек ғасырлық мерейтой (2026 жылғы сәуір)' }],
);
