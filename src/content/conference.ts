/**
 * ВСЁ СОДЕРЖИМОЕ САЙТА — В ЭТОМ ФАЙЛЕ.
 * Чтобы поменять текст, время, спикеров или песни, правьте только здесь.
 * Значения с пометкой «уточняется» — заглушки, их нужно заменить.
 */

export const conference = {
  title: "Я знаю, в Кого я уверовал",
  titleLines: ["Я знаю,", "в Кого я", "уверовал"],
  label: "Региональная молодёжная конференция",
  verse: "2 Тимофею 1:12",
  verseText:
    "…ибо я знаю, в Кого уверовал, и уверен, что Он силён сохранить залог мой на оный день.",
  /** ISO-дата и часовой пояс места проведения — от них считается «Сейчас идёт» */
  date: "2026-10-31",
  timeZone: "Europe/Chisinau",
  dateHuman: "31 октября 2026",
  dateShort: "31.10.2026",
  weekday: "Суббота",
  registrationStart: "09:00",
  start: "10:00",
  city: "г. Рыбница",
  venue: "Дом Молитвы",
  address: "ул. Кирова, 152",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%A0%D1%8B%D0%B1%D0%BD%D0%B8%D1%86%D0%B0%2C+%D1%83%D0%BB.+%D0%9A%D0%B8%D1%80%D0%BE%D0%B2%D0%B0+152",
  about:
    "В мире, где люди теряют ориентиры, растворяясь в бесконечной суете и утрачивая свои цели, в погоне за временным забывая о главном, особенно важно понимать: в Кого мы уверовали?",
  /** Почему выбран такой девиз */
  whyTitle: "Почему «Я знаю, в Кого я уверовал»",
  why:
    "Эти слова апостол Павел написал Тимофею из заключения, незадолго до конца своего пути. Он потерял свободу, многие оставили его — но он не стыдился, потому что знал не «во что», а в Кого верит. Мы хотим, чтобы каждый участник ушёл с той же уверенностью: наша вера — это доверие живому Богу, Который силён сохранить то, что мы Ему доверили.",
  newThisYear:
    "В этом году мы добавили ещё один блок, чтобы сделать встречу полезнее и практичнее: во второй части нас ждут мастер-классы, где можно не только вдохновиться, но и получить конкретные инструменты для служения в повседневной жизни.",
} as const;

export type ScheduleItem = {
  start: string; // "HH:MM"
  end: string;
  title: string;
  place?: string;
  note?: string;
  href?: string;
};

export type ScheduleBlock = {
  title: string;
  items: ScheduleItem[];
};

/** Программа по частям (как в печатном расписании) */
export const program: ScheduleBlock[] = [
  {
    title: "Регистрация",
    items: [{ start: "09:00", end: "10:00", title: "Регистрация участников", note: "Получите бейдж" }],
  },
  {
    title: "Часть 1. Утреннее служение",
    items: [
      { start: "10:00", end: "10:15", title: "Открытие конференции" },
      { start: "10:15", end: "10:45", title: "Блок прославления № 1", href: "/songs/" },
      { start: "10:45", end: "10:50", title: "Хор — первое участие" },
      { start: "10:50", end: "11:00", title: "Сольные участия № 1 и № 2" },
      { start: "11:00", end: "11:45", title: "Первая проповедь" },
      { start: "11:45", end: "11:50", title: "Хор — второе участие" },
      { start: "11:50", end: "12:10", title: "Перерыв" },
    ],
  },
  {
    title: "Часть 2. Мастер-класс и обед",
    items: [
      { start: "12:10", end: "12:15", title: "Вступление к мастер-классу" },
      { start: "12:15", end: "13:15", title: "Мастер-класс", note: "По аудиториям", href: "/masterclasses/" },
      { start: "13:15", end: "14:35", title: "Обед и обеденное общение" },
    ],
  },
  {
    title: "Часть 3. Вечернее служение",
    items: [
      { start: "14:35", end: "14:40", title: "Сбор участников" },
      { start: "14:40", end: "15:10", title: "Блок прославления № 2", href: "/songs/" },
      { start: "15:10", end: "15:15", title: "Хор — первое участие" },
      { start: "15:15", end: "15:25", title: "Сольные участия № 3 и № 4" },
      { start: "15:25", end: "16:10", title: "Вторая проповедь" },
      { start: "16:10", end: "16:15", title: "Хор — второе участие" },
      { start: "16:15", end: "16:35", title: "Заключение и общая молитва" },
    ],
  },
];

/** Плоский список всех пунктов — для «Сейчас идёт» */
export const schedule: ScheduleItem[] = program.flatMap((b) => b.items);

export type Speaker = {
  slug: string;
  firstName: string;
  lastName: string;
  roles: string[];
  church: string;
  photo: string;
  /** Тема проповеди (если известна) */
  topic?: string;
  /** Когда проповедует — например «Первая проповедь, 11:00» */
  when?: string;
  /** Основные мысли проповеди — заполняется после конференции (можно по аудиозаписи) */
  summary?: string[];
  /** Ссылка на запись проповеди (YouTube, аудио) */
  recordingUrl?: string;
};

export const speakers: Speaker[] = [
  {
    slug: "zimmermann",
    firstName: "Андреас",
    lastName: "Циммерманн",
    roles: ["Пастор / Пресвитер", "Ответственный руководитель молодёжи"],
    church: "Церковь г. Шпайер, Германия",
    photo: "/img/speaker-zimmermann.webp",
  },
  {
    slug: "jost",
    firstName: "Даниэль",
    lastName: "Юст",
    roles: ["Диакон", "Молодёжный руководитель"],
    church: "Церковь г. Швегенхайм, Германия",
    photo: "/img/speaker-jost.webp",
  },
];

export type Masterclass = {
  slug: string;
  title: string;
  short: string;
  description: string;
  host: string;
  room: string;
  time: string;
  image: string;
  forWhom: string;
  /** Материалы от ведущего: презентации, конспекты, ссылки */
  materials?: { title: string; url: string }[];
};

const mcTime = "12:15–13:15";
const room = "Аудитория уточняется";

export const masterclasses: Masterclass[] = [
  {
    slug: "leadership",
    title: "Молодёжное лидерство",
    short: "Ответственность, вызовы и развитие служения.",
    description:
      "Ответственность лидера, вызовы молодёжного служения и пути его развития.",
    forWhom:
      "Молодёжным лидерам, руководителям и тем, кто готовится к лидерскому служению.",
    host: "Гости из Германии",
    room,
    time: mcTime,
    image: "/img/mc-leadership.webp",
  },
  {
    slug: "education",
    title: "Духовное образование",
    short: "Почему важно изучать Божье Слово?",
    description:
      "Зачем системно изучать Библию, как читать её с пониманием и какие есть пути для духовного образования и роста.",
    forWhom: "Всем, кто хочет глубже понимать Писание.",
    host: "Игорь Семёнов",
    room,
    time: mcTime,
    image: "/img/mc-education.webp",
  },
  {
    slug: "soul-care",
    title: "Душепопечительство",
    short: "Как поддерживать и сопровождать людей в церкви?",
    description:
      "Что такое душепопечительство, как выслушать человека в трудной ситуации, поддержать его Словом Божьим и молитвой и при этом сохранить собственное сердце.",
    forWhom: "Тем, кто служит людям: лидерам, служителям и всем, кто хочет научиться поддерживать других.",
    host: "Валентин Кирка",
    room,
    time: mcTime,
    image: "/img/mc-preaching.webp",
  },
  {
    slug: "media",
    title: "Медиаслужение",
    short: "Современные технологии на служении Церкви.",
    description:
      "Трансляции, звук, свет, соцсети и дизайн — как использовать современные технологии, чтобы служить Церкви и доносить Евангелие.",
    forWhom: "Тем, кто служит в медиа, звуке, трансляциях или соцсетях церкви.",
    host: "Кристина Плукчи",
    room,
    time: mcTime,
    image: "/img/mc-media.webp",
  },
  {
    slug: "children",
    title: "Воскресная школа и лагеря",
    short: "Как служить детям и подросткам?",
    description:
      "Служение в воскресной школе и христианских лагерях: как говорить с детьми и подростками о Боге, готовить занятия и быть для них примером.",
    forWhom: "Учителям воскресной школы, вожатым и всем, кто служит детям.",
    host: "Жетта Георгиу",
    room,
    time: mcTime,
    image: "/img/mc-children.webp",
  },
  {
    slug: "music",
    title: "Музыкальное служение",
    short: "Хор, прославление и участие в богослужении.",
    description:
      "Служение хора и группы прославления, подготовка к богослужению и сердце музыканта, который служит Богу и церкви.",
    forWhom: "Певцам хора, музыкантам и участникам групп прославления.",
    host: "Вадим Кирка и Александр Орлов",
    room,
    time: mcTime,
    image: "/img/worship.webp",
  },
];

export type Song = {
  slug: string;
  title: string;
  author?: string;
  /** Блок прославления: 1 — утреннее служение, 2 — вечернее */
  block: 1 | 2;
  // Текст песни — в файле src/content/lyrics/<slug>.txt
};

export const songs: Song[] = [
  { slug: "prihodi-ko-mne", title: "Приходи ко мне, Господь мой", block: 1 },
  { slug: "vse-ot-nego", title: "Всё от Него и Им сотворено", block: 1 },
  { slug: "ya-zhdu-dozhd", title: "Я жду, когда прольётся дождь", block: 1 },
  { slug: "ego-imya-iisus", title: "Его имя Иисус", block: 1 },
  { slug: "preklonyayus", title: "Преклоняюсь", block: 2 },
  { slug: "byl-put-zakryt", title: "Был путь закрыт", block: 2 },
  { slug: "provedi-skvoz-vneshniy-dvor", title: "Проведи сквозь внешний двор", block: 2 },
  { slug: "agnets-zaklannyy", title: "Агнец закланный", block: 2 },
];

/** Песни по блокам прославления — для списков */
export const songBlocks = [
  { title: "Блок прославления № 1", songs: songs.filter((s) => s.block === 1) },
  { title: "Блок прославления № 2", songs: songs.filter((s) => s.block === 2) },
];
