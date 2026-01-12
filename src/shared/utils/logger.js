const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

const logLevels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

let currentLogLevel = isDevelopment ? logLevels.DEBUG : logLevels.INFO

export const logger = {
  debug(...args) {
    if (currentLogLevel <= logLevels.DEBUG && isDevelopment) {
      console.debug('[DEBUG]', ...args)
    }
  },

  info(...args) {
    if (currentLogLevel <= logLevels.INFO) {
      console.info('[INFO]', ...args)
    }
  },

  warn(...args) {
    if (currentLogLevel <= logLevels.WARN) {
      console.warn('[WARN]', ...args)
    }
  },

  error(...args) {
    if (currentLogLevel <= logLevels.ERROR) {
      console.error('[ERROR]', ...args)
    }
  },

  setLevel(level) {
    currentLogLevel = level
  },
}
