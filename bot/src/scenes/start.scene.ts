import { Bot, Context, InlineKeyboard } from 'grammy';
import { saveOrUpdateUser } from '../db/services/user.service.js';
import { saveState } from '../db/services/state.service.js';
import logger from '../utils/logger.js';

export function setupStartScene(bot: Bot) {
  bot.command('start', async (ctx: Context) => {
    try {
      const user = ctx.from;
      if (!user) return;

      // Сохраняем пользователя в БД
      await saveOrUpdateUser(user);
      
      // Сохраняем состояние
      await saveState(user.id, 'start');

      const keyboard = new InlineKeyboard()
        .text('ℹ️ Инфо', 'go_to_info')
        .text('🚀 Начать', 'go_to_begin')
        .row()
        .webApp('📱 Открыть WebApp', process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000');

      await ctx.reply(
        `👋 Привет, ${user.first_name || 'друг'}!\n\n` +
        `Добро пожаловать в бота для мотивации и трекинга тренировок! 💪\n\n` +
        `Здесь ты сможешь:\n` +
        `• Отслеживать свои тренировки\n` +
        `• Получать мотивацию\n` +
        `• Достигать своих целей\n\n` +
        `Выбери действие:`,
        { reply_markup: keyboard }
      );
    } catch (error) {
      logger.error('Error in start command:', error);
      await ctx.reply('Произошла ошибка. Попробуй позже.');
    }
  });

  // Обработка кнопок
  bot.callbackQuery('go_to_info', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      'ℹ️ Информация\n\n' +
      'Этот бот поможет тебе:\n' +
      '• Отслеживать регулярность тренировок\n' +
      '• Мотивировать тебя к достижению целей\n' +
      '• Анализировать прогресс\n\n' +
      'Используй кнопки для навигации.',
      {
        reply_markup: new InlineKeyboard().text('⬅️ Назад', 'go_back_to_start'),
      }
    );
    if (ctx.from) {
      await saveState(ctx.from.id, 'info');
    }
  });

  bot.callbackQuery('go_to_begin', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      '🚀 Начнем!\n\n' +
      'Готов начать свой путь к здоровому образу жизни?\n\n' +
      'Следующие шаги:\n' +
      '1. Установи цель\n' +
      '2. Выбери тип тренировок\n' +
      '3. Начни отслеживать прогресс\n\n' +
      'Вместе мы достигнем твоих целей! 💪',
      {
        reply_markup: new InlineKeyboard().text('⬅️ Назад', 'go_back_to_start'),
      }
    );
    if (ctx.from) {
      await saveState(ctx.from.id, 'begin');
    }
  });

  bot.callbackQuery('go_back_to_start', async (ctx) => {
    await ctx.answerCallbackQuery();
    const user = ctx.from;
    if (!user) return;

    await saveState(user.id, 'start');

    const keyboard = new InlineKeyboard()
      .text('ℹ️ Инфо', 'go_to_info')
      .text('🚀 Начать', 'go_to_begin')
      .row()
      .webApp('📱 Открыть WebApp', process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000');

    await ctx.editMessageText(
      `👋 Привет, ${user.first_name || 'друг'}!\n\n` +
      `Добро пожаловать в бота для мотивации и трекинга тренировок! 💪\n\n` +
      `Здесь ты сможешь:\n` +
      `• Отслеживать свои тренировки\n` +
      `• Получать мотивацию\n` +
      `• Достигать своих целей\n\n` +
      `Выбери действие:`,
      { reply_markup: keyboard }
    );
  });
}

