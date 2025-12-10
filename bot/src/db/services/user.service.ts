import { db } from '../postgres/index.js';
import { users, type NewUser } from '../postgres/schema.js';
import { eq } from 'drizzle-orm';
import logger from '../../utils/logger.js';

export async function saveOrUpdateUser(telegramUser: any) {
  try {
    const userData: NewUser = {
      telegramId: telegramUser.id,
      firstName: telegramUser.first_name || null,
      lastName: telegramUser.last_name || null,
      username: telegramUser.username || null,
      languageCode: telegramUser.language_code || null,
      isBot: telegramUser.is_bot || false,
      isPremium: telegramUser.is_premium || false,
      updatedAt: new Date(),
    };

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, telegramUser.id))
      .limit(1);

    if (existingUser.length > 0) {
      await db
        .update(users)
        .set(userData)
        .where(eq(users.telegramId, telegramUser.id));
      logger.info(`User updated: ${telegramUser.id}`);
    } else {
      await db.insert(users).values(userData);
      logger.info(`User created: ${telegramUser.id}`);
    }
  } catch (error) {
    logger.error('Error saving user:', error);
    throw error;
  }
}

