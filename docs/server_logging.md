# Server Logging

This guide covers simple ways to add server side logging to the Next.js
application. While `console.log` works for quick debugging, dedicated loggers
provide leveled output and better formatting.

## Recommended Libraries

- [`winston`](https://github.com/winstonjs/winston) – flexible logging with
  multiple transports and plugins.
- [`pino`](https://github.com/pinojs/pino) – fast JSON logger commonly paired
  with `pino-pretty` for development output.

Both libraries allow writing logs to files, the console, or external services.

## Basic `winston` Setup

```javascript
import winston from 'winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [transport, new winston.transports.Console()]
});
```

The `DailyRotateFile` transport automatically rotates log files so older logs
are archived. Adjust `maxFiles` as needed. Errors can be captured with
`logger.error(err)` so stack traces appear in the log file.

## Basic `pino` Setup

```javascript
import pino from 'pino';

export const logger = pino({
  level: 'info',
  transport: process.env.NODE_ENV === 'development' && {
    target: 'pino-pretty'
  }
});
```

`pino` writes structured JSON by default. The optional `pino-pretty` transport
provides human readable output during local development. Use `logger.error()`
to record errors and include the stack trace.

## Differentiating Log Levels

Both libraries support levels such as `debug`, `info`, `warn`, and `error`. Set
the desired minimum level in the configuration (`level: 'info'`) and use the
corresponding method:

```javascript
logger.debug('verbose message');
logger.info('important runtime info');
logger.warn('something unexpected');
logger.error('fatal problem');
```

Capturing errors with `logger.error(err)` preserves stack traces for later
analysis.

## Logs in Serverless Routes (Vercel)

Vercel captures anything written to `stdout` or `stderr`. When using
`winston` or `pino`, include a console transport so logs appear in the Vercel
Dashboard under the function logs. For long term storage, forward logs to an
external service or write them to a persistent store. Remember that serverless
functions have ephemeral file systems, so rotating files locally is not
reliable—ship logs to an external destination instead.

