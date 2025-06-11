const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 }
const prodLevel = 'warn'
const devLevel = 'debug'
const currentLevel =
  process.env.NODE_ENV === 'production' ? prodLevel : devLevel

const shouldLog = (level) => LEVELS[level] >= LEVELS[currentLevel]

export const logger = {
  debug: (...args) => {
    if (shouldLog('debug')) console.debug(...args)
  },
  info: (...args) => {
    if (shouldLog('info')) console.info(...args)
  },
  warn: (...args) => {
    if (shouldLog('warn')) console.warn(...args)
  },
  error: (...args) => {
    if (shouldLog('error')) console.error(...args)
  },
}

export default logger
