# API Documentation

## Base URL
All endpoints are relative to your deployment root:  
`https://your-site.vercel.app`

## `POST /api/contact` — Submit Contact Form

Sends a contact form submission via email using Resend API.

### Request

**Headers**
```
Content-Type: application/json
```

**Body**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Sender's full name |
| `email` | string | Yes | Sender's email address |
| `message` | string | Yes | Message content |
| `bot-field` | string | Yes | Honeypot field — must be empty |

**Example**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I love your work and would like to collaborate!",
  "bot-field": ""
}
```

### Responses

**200 OK — Success**
```json
{
  "success": true,
  "messageId": "123e4567-e89b-12d3-a456-426614174000"
}
```
- Email sent successfully to both owner and sender
- Success toast should appear on client

**400 Bad Request — Validation Error**
```json
{
  "error": "All fields are required"
}
```
or
```json
{
  "error": "Invalid email format"
}
```

**405 Method Not Allowed**
```json
{
  "error": "Method not allowed"
}
```
- Only POST requests accepted

**429 Too Many Requests**
```json
{
  "error": "Too many requests. Please try again later."
}
```
- Rate limit exceeded (5 requests per 10 seconds per IP)

**500 Internal Server Error**
```json
{
  "error": "Failed to send email"
}
```
- Resend API failure or unexpected server error

### Email Delivery

Two emails are sent on successful submission:
1. **To site owner** (`OWNER_EMAIL`): Contains full message details
2. **To sender**: Confirmation email with thank-you message

Both use HTML templates with warm minimalism styling.

### Rate Limiting

- Implemented using Upstash Redis
- 5 requests allowed per 10 seconds per IP address
- Uses `x-forwarded-for` header for IP detection
- Fail-open strategy: If Redis is unreachable, request proceeds (logged to Sentry)

**Environment Variables Required**
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Security

- **Honeypot protection**: Requests with `bot-field` populated are silently accepted but not processed
- **Input validation**: All fields required, email format validated
- **No sensitive data**: `RESEND_API_KEY` never exposed to client
- **Error handling**: Generic error messages to avoid information leakage

### cURL Examples

**Successful Submission**
```bash
curl -X POST https://your-site.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Hello from curl!",
    "bot-field": ""
  }'
```

**Rate Limit Test**
```bash
# Run this 6 times quickly to trigger rate limit
curl -X POST https://your-site.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test","bot-field":""}'
```

## `GET /api/health` — Health Check

Simple endpoint to verify server status.

### Request
No parameters required.

### Response (200 OK)
```json
{
  "status": "ok"
}
```

Useful for uptime monitoring and deployment verification.

---

**Note**: All API routes are serverless functions hosted on Vercel.  
No authentication required.  
Monitor usage and errors via Vercel Logs and Sentry.