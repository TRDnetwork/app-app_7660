# Portfolio Pro API Documentation

## Overview

The Portfolio Pro site includes a single serverless API endpoint for handling contact form submissions. All functionality is stateless and requires no database.

- **Base URL**: `/api/contact`
- **Host**: Same as frontend (Vercel serverless function)
- **Authentication**: None (protected via honeypot and rate limiting)
- **Content-Type**: `application/json`

---

## `POST /api/contact`

Sends a contact form submission via email to the site owner and optionally to the user.

### Request

**Headers**
```
Content-Type: application/json
```

**Body**
| Field       | Type   | Required | Description |
|------------|--------|----------|-------------|
| `name`     | string | Yes      | Full name of sender |
| `email`    | string | Yes      | Valid email address |
| `message`  | string | Yes      | Message content |
| `bot-field`| string | No       | Honeypot field — must be empty |

> 💡 The `bot-field` is a hidden form field. Bots that fill it will be silently rejected.

**Example Request**
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "message": "I'd love to discuss a potential collaboration.",
  "bot-field": ""
}
```

**cURL Command**
```bash
curl -X POST https://portfolio-pro.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "message": "Let's work together!",
    "bot-field": ""
  }'
```

### Responses

#### ✅ 200 OK — Success
Returned when email is sent successfully or spam is detected.

**Spam Detected (Honeypot Triggered)**
```json
{ "success": true }
```
> 🤫 Silent success to avoid revealing spam detection to bots.

**Email Sent Successfully**
```json
{ "success": true }
```

#### ❌ 400 Bad Request — Validation Error
Returned when required fields are missing or email is invalid.

```json
{
  "message": "All fields are required."
}
```
or
```json
{
  "message": "Please provide a valid email address."
}
```

#### ❌ 405 Method Not Allowed
Returned for non-POST requests.

```json
{
  "message": "Method not allowed"
}
```

#### ❌ 500 Internal Server Error
Returned when email sending fails.

```json
{
  "message": "Failed to send message. Please try again later."
}
```

### Email Delivery

Two emails are sent on successful submission:

#### 1. Notification to Site Owner
- **From**: `onboarding@resend.dev` (configurable)
- **To**: `process.env.OWNER_EMAIL`
- **Subject**: `New Contact Form Submission from {name}`
- **Content**: Includes name, email, and message in formatted HTML

#### 2. Confirmation to User
- **From**: `onboarding@resend.dev`
- **To**: User's email
- **Subject**: `Thank you for reaching out!`
- **Content**: Thank-you message with optional links

---

## Security & Spam Protection

### Honeypot Field
- Hidden input named `bot-field`
- If filled, request is silently accepted (200) but no email sent
- Prevents bot spam without CAPTCHA

### Input Validation
- All three fields (`name`, `email`, `message`) are required
- Email must match basic regex pattern: `^\S+@\S+\.\S+$`

### Rate Limiting (Recommended)
Not currently implemented. For production, add Upstash Redis rate limiting:

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s')
});
```

---

## Error Handling

- **Client Errors (4xx)**: Clear, user-friendly messages
- **Server Errors (5xx)**: Generic message to avoid exposing internals
- **Logging**: Full error details logged server-side (Vercel logs)

---

## Testing the API

Use the provided test suite:
```bash
npm test
```

Or test manually with cURL as shown above.

Check Vercel logs and [Resend Dashboard](https://resend.com/emails) for delivery status.

---

## Deployment Notes

- Endpoint is a Vercel serverless function (`api/contact.ts`)
- Requires `RESEND_API_KEY` and `OWNER_EMAIL` environment variables
- No CORS configuration needed — same origin
- No authentication or API keys exposed to client