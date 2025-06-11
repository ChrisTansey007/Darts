# Darts

Darts is a simple example project built with [Next.js](https://nextjs.org). It contains placeholder pages for games, players and tournaments so the layout and navigation can be tested.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- npm (comes with Node.js)

## Getting Started

1. Install dependencies:
   ```bash
   cd src
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. (Optional) Format the codebase:
   ```bash
   npm run format
   ```
4. Open <http://localhost:3000> in your browser.

## Running Tests

Install dependencies and execute the Jest test suite:

```bash
npm install --legacy-peer-deps  # or `npm install` if your setup has no peer issues
npm test
```

No additional environment variables are required for local development.

The application is deployed on Vercel: <https://darts.vercel.app>

## Logging

Use the `logger` utility for any runtime messages instead of calling
`console.log` directly. Import it from `src/lib/logger`:

```javascript
import logger from '@/lib/logger'

logger.info('Application started')
```

Debug output is suppressed when `NODE_ENV` is set to `production` so logs stay
quiet in deployments. See `docs/server_logging.md` for backend logging tips.

## Next.js Configuration

This project uses the `/app` directory. To enable it and other runtime checks,
`src/next.config.ts` sets `experimental.appDir` and `reactStrictMode` to `true`.
Remote images are also allowed from `example.com` via the `images.domains`
setting.

## Reference

This project contains the original dartboard implementation at
`docs/mvp_code_reference.txt` for reference during refactoring. Contributors
should consult this file if they need clarity on the initial logic.
