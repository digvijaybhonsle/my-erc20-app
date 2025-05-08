// server/src/utils/logger.ts
export const log = {
    info: (msg: string, ...meta: any[]) => console.log(`ℹ️ [INFO] ${msg}`, ...meta),
    warn: (msg: string, ...meta: any[]) => console.warn(`⚠️ [WARN] ${msg}`, ...meta),
    error: (msg: string, ...meta: any[]) => console.error(`❌ [ERROR] ${msg}`, ...meta),
  };
  