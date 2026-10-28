export type Zone = {
  id: string;
  name: string;
  description: string;
  capacity: string;
  maxSeats: number;
  icon: string;
  features: string[];
};

export const zones: Zone[] = [
  {
    id: 'quiet',
    name: 'Тихая зона',
    description: 'Идеально для самостоятельной учебы и подготовки к экзаменам. Полная тишина и концентрация.',
    capacity: '10 мест',
    maxSeats: 10,
    icon: 'BookOpen',
    features: ['Изолированное помещение', 'Настольные лампы', 'Розетки у каждого места', 'Wi-Fi'],
  },
  {
    id: 'team',
    name: 'Проектный офис',
    description: 'Пространство для командной работы, хакатонов и групповых проектов. Маркерные доски и широкие столы.',
    capacity: '3 стола',
    maxSeats: 3,
    icon: 'Users',
    features: ['Маркерные доски', 'Большие столы', 'Монитор для презентаций', 'Wi-Fi'],
  },
  {
    id: 'meeting',
    name: 'Переговорная / Мини-лекторий',
    description: 'Для питчей, мастер-классов и выступлений. Проектор, звук и seating на 20 человек.',
    capacity: '20 мест',
    maxSeats: 20,
    icon: 'Presentation',
    features: ['Проектор 4K', 'Звуковая система', 'Микрофон-петличка', 'Питч-стенд'],
  },
];

export type Equipment = {
  id: string;
  name: string;
  category: 'camera' | 'audio' | 'lighting';
  icon: string;
  price: string;
  freeForSchool: boolean;
  description: string;
  specs: string[];
};

export const equipmentList: Equipment[] = [
  {
    id: 'sony-camera',
    name: 'Зеркальная камера Sony A7 III',
    category: 'camera',
    icon: 'Camera',
    price: '100 сом/час',
    freeForSchool: true,
    description: 'Профессиональная беззеркальная камера с полнокадровым сенсором. Идеальна для съёмки школьных репортажей и проектов.',
    specs: ['24.2 МП полнокадровый сенсор', '4K видео 30fps', 'Штатив Manfrotto в комплекте', 'Объектив 24-70mm f/2.8'],
  },
  {
    id: 'studio-mics',
    name: 'Студийные микрофоны',
    category: 'audio',
    icon: 'Mic',
    price: '50 сом/час',
    freeForSchool: true,
    description: 'Набор из петличек и настольных микрофонов для записи подкастов и озвучки видео.',
    specs: ['Rode PodMic — настольный', 'Петличные микрофоны Rode Wireless GO', 'Pop-фильтр', 'Звуковая карта Focusrite'],
  },
  {
    id: 'lighting-kit',
    name: 'Набор кольцевого света и хромакей',
    category: 'lighting',
    icon: 'Lightbulb',
    price: '40 сом/час',
    freeForSchool: true,
    description: 'Полный осветительный набор для студийной съёмки с зелёным фоном для замены заднего плана.',
    specs: ['Кольцевой свет 45см', 'Хромакей зелёный 3×2м', 'Две софтбокса 60×90см', 'Стойки и крепления'],
  },
];

export const timeSlots = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
  '19:00 - 21:00',
];

export type PortfolioItem = {
  id: string;
  title: string;
  type: 'podcast' | 'video' | 'project';
  description: string;
  author: string;
  date: string;
  duration: string;
  cover: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Школьные новости: Октябрь',
    type: 'video',
    description: 'Еженедельный новостной выпуск о жизни школы.',
    author: 'Медиацентр 11-Б',
    date: '2026-10-20',
    duration: '8:24',
    cover: 'school-news',
  },
  {
    id: '2',
    title: 'Подкаст «Один вопрос с учителем»',
    type: 'podcast',
    description: 'Серия интервью с преподавателями об их пути в профессию.',
    author: 'Айгерим К., 10-А',
    date: '2026-10-15',
    duration: '34:10',
    cover: 'podcast-interview',
  },
  {
    id: '3',
    title: 'Питч проекта «Эко-апп»',
    type: 'project',
    description: 'Презентация школьного стартапа по сортировке отходов.',
    author: 'Команда GreenCode',
    date: '2026-10-12',
    duration: '5:00',
    cover: 'eco-pitch',
  },
  {
    id: '4',
    title: 'Документальный: «Один день в школе»',
    type: 'video',
    description: 'Короткометражка о распорядке школьного дня глазами ученика.',
    author: 'Бекзат С., 11-А',
    date: '2026-10-08',
    duration: '12:45',
    cover: 'doc-school-day',
  },
  {
    id: '5',
    title: 'Подкаст «Молодые изобретатели»',
    type: 'podcast',
    description: 'Разговор с участниками робототехнического кружка.',
    author: 'Динара М., 9-В',
    date: '2026-10-05',
    duration: '27:33',
    cover: 'inventors-podcast',
  },
  {
    id: '6',
    title: 'Стартап «TutorMatch»',
    type: 'project',
    description: 'Платформа для поиска репетиторов среди старшеклассников.',
    author: 'Команда NexusLab',
    date: '2026-10-01',
    duration: '7:15',
    cover: 'tutor-startup',
  },
];
