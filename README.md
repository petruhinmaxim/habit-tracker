# Habit Tracker Telegram Bot

Телеграм бот для мотивации и трекинга тренировок с веб-приложением.

## Технологии

- **grammy** - фреймворк для Telegram ботов
- **Next.js** - веб-приложение
- **PostgreSQL** - база данных
- **Drizzle ORM** - ORM для работы с БД
- **Winston** - логирование
- **XState** - управление состоянием
- **Redis** - хранение состояния
- **Docker** - контейнеризация

## Структура проекта

```
habit-tracker/
├── bot/              # Telegram бот
├── webapp/           # Next.js веб-приложение
├── docker-compose.yml
└── package.json
```

## Установка и запуск

### Предварительные требования

- Node.js 18+ и npm
- Docker и Docker Compose
- Telegram Bot Token (получить у [@BotFather](https://t.me/BotFather))

### Шаги установки

1. **Установите зависимости:**
```bash
# Установка зависимостей для всех workspace
npm install

# Или установите зависимости для каждого проекта отдельно:
cd bot && npm install && cd ..
cd webapp && npm install && cd ..
```

2. **Создайте файл `.env` в корне проекта** со следующим содержимым:
```env
# Telegram Bot
BOT_TOKEN=your_bot_token_here

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=habit_tracker
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habit_tracker

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# WebApp
NEXT_PUBLIC_WEBAPP_URL=http://localhost:3000
WEBAPP_SECRET=your_webapp_secret_here

# Environment
NODE_ENV=development
LOG_LEVEL=info
```

3. **Запустите Docker контейнеры (PostgreSQL и Redis):**
```bash
npm run docker:up
```

Подождите несколько секунд, пока контейнеры запустятся.

4. **Сгенерируйте и примените миграции базы данных:**
```bash
npm run db:generate
npm run db:migrate
```

5. **Запустите бота и веб-приложение:**
```bash
npm run dev
```

Бот будет доступен в Telegram, а веб-приложение по адресу http://localhost:3000

## Переменные окружения

- `BOT_TOKEN` - токен Telegram бота (получить у @BotFather)
- `DATABASE_URL` - строка подключения к PostgreSQL
- `REDIS_URL` - строка подключения к Redis
- `NEXT_PUBLIC_WEBAPP_URL` - URL веб-приложения

## Настройка WebApp в Telegram

Для работы WebApp в Telegram необходимо:

1. **Развернуть веб-приложение** на публичном URL (например, используя Vercel, Railway, или другой хостинг)
2. **Настроить WebApp URL в боте:**
   - Откройте [@BotFather](https://t.me/BotFather) в Telegram
   - Отправьте команду `/mybots`
   - Выберите вашего бота
   - Выберите "Bot Settings" → "Menu Button"
   - Установите URL вашего веб-приложения

Или используйте кнопку WebApp в коде бота (уже настроена в `bot/src/scenes/start.scene.ts`)

## Команды

- `npm run dev` - запуск бота и веб-приложения в режиме разработки
- `npm run build` - сборка проекта
- `npm run docker:up` - запуск Docker контейнеров
- `npm run docker:down` - остановка Docker контейнеров
- `npm run db:generate` - генерация миграций
- `npm run db:migrate` - применение миграций
- `npm run db:studio` - открыть Drizzle Studio для просмотра БД

## Структура проекта

```
habit-tracker/
├── bot/                    # Telegram бот
│   ├── src/
│   │   ├── db/            # Схема БД и миграции
│   │   ├── config/        # Конфигурация (logger, redis)
│   │   ├── services/      # Сервисы (user, state)
│   │   ├── scenes/        # Сцены бота
│   │   ├── handlers/      # Обработчики событий
│   │   ├── machines/      # XState машины
│   │   └── index.ts       # Точка входа
│   ├── drizzle/           # Миграции (генерируются)
│   └── package.json
├── webapp/                 # Next.js веб-приложение
│   ├── app/               # Next.js App Router
│   ├── public/            # Статические файлы
│   └── package.json
├── docker-compose.yml      # Docker конфигурация
└── package.json           # Root package.json
```

## Особенности реализации

- **База данных**: Все пользователи сохраняются в PostgreSQL при первом взаимодействии с ботом
- **Уникальность**: `telegram_id` имеет уникальное ограничение в БД
- **Состояние**: Состояние пользователя хранится в Redis
- **XState**: Машина состояний готова к использованию (можно расширить для сложных сценариев)
- **Логирование**: Все события логируются через Winston
- **WebApp интеграция**: Данные из WebApp отправляются в бот через Telegram WebApp API

