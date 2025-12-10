import { createMachine } from '@xstate/fsm';

export type BotState = 'start' | 'info' | 'begin';

export const botMachine = createMachine<{ userId: number }, { type: 'GO_TO_INFO' } | { type: 'GO_TO_BEGIN' } | { type: 'GO_BACK' } | { type: 'OPEN_WEBAPP' }>(
  {
    id: 'bot',
    initial: 'start',
    context: { userId: 0 },
    states: {
      start: {
        on: {
          GO_TO_INFO: 'info',
          GO_TO_BEGIN: 'begin',
          OPEN_WEBAPP: 'start',
        },
      },
      info: {
        on: {
          GO_BACK: 'start',
        },
      },
      begin: {
        on: {
          GO_BACK: 'start',
        },
      },
    },
  }
);

