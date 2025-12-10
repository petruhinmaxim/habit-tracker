import { Bot, Context } from 'grammy';
import logger from '../utils/logger.js';

export function setupWebAppHandler(bot: Bot) {
  bot.on('message', async (ctx: Context) => {
    // Обработка данных из WebApp
    if (ctx.message?.web_app?.data) {
      try {
        const data = JSON.parse(ctx.message.web_app.data);
        
        if (data.text) {
          await ctx.reply(
            `📱 Сообщение из WebApp:\n\n${data.text}`
          );
          logger.info(`Received WebApp data from user ${ctx.from?.id}: ${data.text}`);
        }
      } catch (error) {
        logger.error('Error parsing WebApp data:', error);
        await ctx.reply('Произошла ошибка при обработке данных из WebApp.');
      }
    }
  });
}

