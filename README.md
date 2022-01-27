# The Carl Sagan Richard Feynman Bank

An e-banking web application demonstrating what happens when you do not protect
your forms with [Cross-Site Request
Forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) tokens.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Requirements](#requirements)
- [Development](#development)
- [Production](#production)
- [Configuration](#configuration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

- [Node.js][node] 16.x

## Development

```bash
# Clone and move into the repository
git clone https://github.com/MediaComem/exploit-csrf-bank.git
cd exploit-csrf-bank

# Install dependencies
npm ci

# Run the application in development mode
npm run dev
```

## Production

```bash
# Clone and move into the repository
git clone https://github.com/MediaComem/exploit-csrf-bank.git
cd exploit-csrf-bank

# Install dependencies
npm install --production

# Run the application in development mode
BANK_SESSION_SECRET=changeme npm start
```

## Configuration

The application can be configured using the following environment variables:

| Variable                | Default value                            | Description                                                          |
| :---------------------- | :--------------------------------------- | :------------------------------------------------------------------- |
| `BANK_LISTEN_HOST`      | `0.0.0.0`                                | The IP address to listen to (use `0.0.0.0` for any IP address).      |
| `BANK_LISTEN_PORT`      | `3000`                                   | The port to listen on.                                               |
| `BANK_SESSION_SECRET`   | -                                        | Secret used to sign session cookies. Should be a long random string. |
| `BANK_SESSION_LIFETIME` | `86_400_000` (one day)                   | Lifetime of sessions in milliseconds.                                |
| `BANK_BCRYPT_ROUNDS`    | `10`                                     | [Bcrypt][bcrypt] algorithm cost factor.                              |
| `BANK_DB_FILE`          | `db.loki` (relative to the application)  | The file in which the embedded database will be stored.              |
| `BANK_SESSIONS_DIR`     | `session` (relative to the application)  | The diretory in which session files will be stored.                  |
| `BANK_TRUST_PROXY`      | `false`                                  | Whether to trust proxy headers.                                      |
| `BANK_TITLE`            | `Carl Sagan Richard Feynman Bank`        | The title displayed in the navbar.                                   |
| `BANK_LOG_LEVEL`        | `DEBUG` in production, `TRACE` otherwise | The highest level of log messages to output.                         |

[bcrypt]: https://en.wikipedia.org/wiki/Bcrypt
[node]: https://nodejs.org
