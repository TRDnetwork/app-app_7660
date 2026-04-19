# Portfolio Pro Test Suite

## How to Run
1. Install dependencies: `npm install vitest jsdom @testing-library/react @testing-library/jest-dom`
2. Run tests: `npm test` or `npx vitest`

## Test Coverage

### `app.test.js`
- Verifies the hero section displays the name and role
- Confirms the about section contains the descriptive paragraph
- Checks that all three project cards are rendered in the grid
- Tests client-side validation for empty form submission
- Validates successful form submission flow with mock API call

### `api.test.js`
- Tests API endpoint rejects non-POST requests
- Verifies honeypot spam protection works correctly
- Validates required field checking and error responses
- Confirms email format validation
- Tests successful email delivery with valid data
- Mocks Resend API calls and email template imports

## Notes
- The frontend test reveals a critical bug: the form submits to `/api/send-email` but the API is at `/api/contact`
- Field name mismatch between frontend (`bot-field`) and backend (`_honey`) will cause validation to fail
- The API expects `name`, `email`, `message` but frontend sends `to`, `from`, `subject`, `text`