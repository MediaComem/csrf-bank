# The Carl Sagan Richard Feynman Bank

An e-banking web application demonstrating what happens when you do not protect
your forms with [Cross-Site Request
Forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) tokens.

## Requirements

- [Node.js][node] 16

## Development

```bash
# Clone and move into the repository
git clone https://github.com/AlphaHydrae/exploit-csrf-bank.git
cd exploit-csrf-bank

# Install dependencies
npm ci

# Run the application in development mode
npm run dev
```

## Production

```bash
# Clone and move into the repository
git clone https://github.com/AlphaHydrae/exploit-csrf-bank.git
cd exploit-csrf-bank

# Install dependencies
npm install --production

# Run the application in development mode
BANK_SESSION_SECRET=changeme npm start
```

[node]: https://nodejs.org/en/
