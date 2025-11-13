export interface User {
  id: string;
  name: string;
  age: number;
  city: string;
  photos: string[];
  interests: string[];
  bio?: string;
}

export interface CurrentUser extends User {
  phoneNumber?: string;
  email?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    age: 25,
    city: 'Москва',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop'
    ],
    interests: ['Путешествия', 'Фотография', 'Йога', 'Кулинария'],
    bio: 'Люблю путешествовать и открывать новые места. Фотограф в душе.'
  },
  {
    id: '2',
    name: 'Михаил Иванов',
    age: 28,
    city: 'Санкт-Петербург',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
    ],
    interests: ['Спорт', 'Музыка', 'Программирование', 'Кино'],
    bio: 'IT-специалист, увлекаюсь спортом и музыкой. Ищу интересное общение.'
  },
  {
    id: '3',
    name: 'Елена Смирнова',
    age: 23,
    city: 'Екатеринбург',
    photos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=600&fit=crop'
    ],
    interests: ['Искусство', 'Танцы', 'Книги', 'Кофе'],
    bio: 'Художница и танцовщица. Обожаю уютные кафе и хорошие книги.'
  },
  {
    id: '4',
    name: 'Дмитрий Козлов',
    age: 30,
    city: 'Новосибирск',
    photos: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop'
    ],
    interests: ['Бизнес', 'Автомобили', 'Гольф', 'Винтаж'],
    bio: 'Предприниматель. Ценю качественные вещи и интересных людей.'
  },
  {
    id: '5',
    name: 'София Волкова',
    age: 26,
    city: 'Казань',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=600&fit=crop'
    ],
    interests: ['Мода', 'Красота', 'Психология', 'Театр'],
    bio: 'Стилист и психолог. Помогаю людям раскрыть свою красоту.'
  },
  {
    id: '6',
    name: 'Алиса Морозова',
    age: 22,
    city: 'Москва',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop'
    ],
    interests: ['Танцы', 'Театр', 'Фотография', 'Путешествия'],
    bio: 'Актриса театра и кино. Люблю выражать эмоции через искусство.'
  },
  {
    id: '7',
    name: 'Виктория Белова',
    age: 24,
    city: 'Санкт-Петербург',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'
    ],
    interests: ['Спорт', 'Бизнес', 'Психология', 'Мода'],
    bio: 'Предпринимательница. Верю в силу позитивного мышления и упорства.'
  },
  {
    id: '8',
    name: 'Кристина Лебедева',
    age: 21,
    city: 'Екатеринбург',
    photos: [
      'https://images.unsplash.com/photo-1498529605908-f357a9af7bf5?w=400&h=600&fit=crop'
    ],
    interests: ['Фотография', 'Социальные сети', 'Музыка', 'Кофе'],
    bio: 'Блогер и фотограф. Делюсь позитивом и красотой каждый день!'
  },
  {
    id: '9',
    name: 'Анастасия Зайцева',
    age: 23,
    city: 'Новосибирск',
    photos: [
      'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=400&h=600&fit=crop'
    ],
    interests: ['Красота', 'Здоровье', 'Йога', 'Косметология'],
    bio: 'Косметолог. Забочусь о красоте и здоровье кожи. Практикую йогу.'
  },
  {
    id: '10',
    name: 'Дарья Романова',
    age: 25,
    city: 'Казань',
    photos: [
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=600&fit=crop'
    ],
    interests: ['Мода', 'Стиль', 'Искусство', 'Винтаж'],
    bio: 'Стилист и модель. Создаю уникальные образы и помогаю найти свой стиль.'
  },
  {
    id: '11',
    name: 'Полина Орлова',
    age: 27,
    city: 'Челябинск',
    photos: [
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop'
    ],
    interests: ['Книги', 'Кулинария', 'Садоводство', 'Психология'],
    bio: 'Психолог и писательница. Изучаю человеческую природу и пишу романы.'
  },
  {
    id: '12',
    name: 'Мария Киселева',
    age: 29,
    city: 'Ростов-на-Дону',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop'
    ],
    interests: ['Медицина', 'Спорт', 'Путешествия', 'Волонтерство'],
    bio: 'Врач-кардиолог. Помогаю людям быть здоровыми. Люблю активный отдых.'
  },
  {
    id: '13',
    name: 'Екатерина Новикова',
    age: 24,
    city: 'Воронеж',
    photos: [
      'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop'
    ],
    interests: ['Дизайн', 'Архитектура', 'Искусство', 'Кофе'],
    bio: 'Архитектор и дизайнер интерьеров. Создаю пространства для жизни.'
  },
  {
    id: '14',
    name: 'Валерия Соколова',
    age: 26,
    city: 'Самара',
    photos: [
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=600&fit=crop'
    ],
    interests: ['Музыка', 'Концерты', 'Гитара', 'Поэзия'],
    bio: 'Музыкант и поэт. Пишу песни и выступаю в местных клубах.'
  },
  {
    id: '15',
    name: 'Ольга Федорова',
    age: 28,
    city: 'Омск',
    photos: [
      'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?w=400&h=600&fit=crop'
    ],
    interests: ['Журналистика', 'Политика', 'Книги', 'Театр'],
    bio: 'Журналист и редактор. Исследую важные социальные темы.'
  }
];

export const currentUserMock: CurrentUser = {
  id: 'current',
  name: 'Алексей Сидоров',
  age: 27,
  city: 'Москва',
  photos: [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=600&fit=crop'
  ],
  interests: ['Технологии', 'Спорт', 'Путешествия'],
  phoneNumber: '+7 (999) 123-45-67',
  email: 'alexey@example.com',
  bio: 'Разработчик мобильных приложений. Люблю активный отдых.'
};

export const interestsList = [
  'Путешествия', 'Спорт', 'Музыка', 'Кино', 'Книги', 'Кулинария',
  'Фотография', 'Искусство', 'Танцы', 'Йога', 'Программирование',
  'Бизнес', 'Мода', 'Психология', 'Театр', 'Кофе', 'Винтаж',
  'Автомобили', 'Гольф', 'Красота', 'Технологии'
];

export const cities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
  'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск',
  'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь'
];
