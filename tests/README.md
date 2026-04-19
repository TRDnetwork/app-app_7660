# Portfolio Pro Test Suite

## How to Run Tests

```bash
# Install dependencies
npm install vitest jsdom @testing-library/react @testing-library/user-event

# Run all tests
npm test

# Run in watch mode
npm test -- --watch
```

## Test Coverage

### `app.test.js` - Frontend Component Tests
- **Hero Section**: Verifies headline, subheading, and role are rendered
- **About Section**: Confirms lazy-loaded about content displays
- **Project Grid**: Tests responsive 1-2-3 column layout and card content
- **Contact Form**: 
  - Validates form submission flow
  - Tests success/error toast behavior
  - Checks validation for required fields
  - Verifies form clearing after submission
- **Accessibility**: Ensures proper ARIA labels, roles, and semantic HTML
- **Honeypot**: Confirms hidden field is properly concealed

### `api.test.js` - Backend API Tests
- **HTTP Methods**: Validates only POST requests are accepted
- **Input Validation**: Tests required fields and email format checking
- **Honeypot**: Verifies bot submissions are ignored
- **Rate Limiting**: Tests Upstash Redis integration and 429 responses
- **Email Delivery**: Confirms Resend API calls with proper recipients
- **Error Handling**: Tests graceful degradation for API failures
- **Security**: Validates input sanitization to prevent XSS attacks
- **Fail-Open**: Ensures rate limiting doesn't block legitimate users

## Testing Strategy
- **Unit Tests**: Isolated component functionality
- **Integration Tests**: Form-to-API workflow
- **Security Tests**: XSS prevention and input sanitization
- **Accessibility Tests**: WCAG compliance
- **Edge Cases**: Empty inputs, malformed data, network failures

All tests mock external dependencies (Resend, Redis) to ensure reliability and speed.