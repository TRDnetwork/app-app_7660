# Portfolio Pro Test Suite

## How to Run
```bash
npm install vitest jsdom @testing-library/react
npm test
```

## Test Coverage

### `app.test.js`
- Verifies core UI components render correctly
- Tests hero section with name/role
- Confirms about section content
- Validates project cards in responsive grid
- Checks client-side form validation
- Simulates successful form submission and toast display
- Uses mocked `fetch` to isolate frontend logic

### `api.test.js`
- Tests `/api/contact` serverless function behavior
- Validates HTTP method restrictions (POST only)
- Confirms honeypot spam protection works
- Tests required field validation
- Verifies email format checking
- Mocks Resend email delivery success/failure
- Ensures proper error handling and status codes
- Uses custom event/response mocks to simulate Vercel environment

## Notes
- Frontend tests use React Testing Library for user-centric assertions
- API tests validate business logic without external dependencies
- Both suites cover security requirements (honeypot, validation)
- Test helpers simulate Vercel's request/response objects for accurate API testing
- All tests pass with current implementation except honeypot field name mismatch issue