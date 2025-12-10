import { Bot } from 'grammy';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';
import { setupStartScene } from './scenes/start.scene.js';
import { setupWebAppHandler } from './handlers/webapp.handler.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try multiple paths for .env file
const possiblePaths = [
  resolve(process.cwd(), '../.env'), // From bot/ to root
  resolve(process.cwd(), '.env'),    // If run from root
  join(__dirname, '../../.env'),     // Relative to this file
];

let envPath: string | undefined;
for (const path of possiblePaths) {
  if (existsSync(path)) {
    envPath = path;
    break;
  }
}

if (envPath) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    logger.warn(`Warning: Could not load .env from ${envPath}:`, result.error.message);
  } else {
    logger.info(`Loaded .env from: ${envPath}`);
  }
} else {
  // Fallback: try to load from default locations
  dotenv.config();
  logger.warn('Warning: .env file not found in expected locations, using default dotenv.config()');
  logger.warn('Tried paths:', possiblePaths);
}

if (!process.env.BOT_TOKEN) {
  logger.error('BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

const bot = new Bot(process.env.BOT_TOKEN);

// Настройка сцен
setupStartScene(bot);
setupWebAppHandler(bot);

// Обработка ошибок
bot.catch((err) => {
  logger.error('Bot error:', err);
});

// Запуск бота
bot.start({
  onStart: (botInfo) => {
    logger.info(`Bot @${botInfo.username} started successfully!`);
  },
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

