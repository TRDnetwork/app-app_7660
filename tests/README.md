# Test Suite for Portfolio Pro

## How to Run

1. Install dependencies:
```bash
npm install vitest jsdom @testing-library/react @testing-library/dom
```

2. Run tests:
```bash
npm test
```

Or with watch mode:
```bash
npm run test:watch
```

## Test Coverage

### `app.test.js`
- Tests the main App component rendering
- Verifies all core sections: Hero, About, Projects, Contact
- Validates contact form behavior:
  - Client-side validation
  - Honeypot spam protection
  - Success toast display and auto-dismiss
  - Accessibility features (skip link)
- Uses mocked Framer Motion and intersection observer

### `api.test.js`
- Tests the Vercel serverless contact form endpoint
- Validates HTTP method handling (only POST allowed)
- Tests field validation (required fields, email format)
- Verifies honeypot bot detection
- Confirms email sending via Resend mock
- Tests XSS input sanitization
- Handles error scenarios gracefully
- Uses mocked request/response objects

## Notes
- Tests assume the app is built with React + Vite + TypeScript
- API tests validate server-side security and email handling
- Frontend tests focus on user interaction and accessibility
- All third-party services are mocked to avoid external dependencies