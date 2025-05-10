// server/src/utils/logger.ts
export const log = {
  warn: (message: string) => console.warn(message),
  error: (message: string, err: Error) => {
    console.error(message, err);
  },
};
