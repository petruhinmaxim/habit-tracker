import redis from '../redis.js';
import logger from '../../utils/logger.js';

const STATE_PREFIX = 'state:';

export async function saveState(userId: number, state: string) {
  try {
    await redis.set(`${STATE_PREFIX}${userId}`, state);
    logger.debug(`State saved for user ${userId}: ${state}`);
  } catch (error) {
    logger.error('Error saving state:', error);
    throw error;
  }
}

export async function getState(userId: number): Promise<string | null> {
  try {
    const state = await redis.get(`${STATE_PREFIX}${userId}`);
    return state;
  } catch (error) {
    logger.error('Error getting state:', error);
    return null;
  }
}

export async function clearState(userId: number) {
  try {
    await redis.del(`${STATE_PREFIX}${userId}`);
    logger.debug(`State cleared for user ${userId}`);
  } catch (error) {
    logger.error('Error clearing state:', error);
    throw error;
  }
}

