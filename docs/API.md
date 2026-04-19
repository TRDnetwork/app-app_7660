# 📡 API Documentation

This portfolio uses a single serverless endpoint for secure contact form submission. All other content is static.

---

## `POST /api/contact`

Handles contact form submissions, validates input, sends emails via Resend, and prevents spam.

### 🔐 Authentication

None required. Accessible to public. Rate limiting enforced via Upstash Redis (planned).

### 📥 Request

#### Headers

| Key               | Value                   |
|-------------------|-------------------------|
| `Content-Type`    | `application/json`      |
| `Origin`          | Allowed domain (Vercel) |
| `User-Agent`      | Standard browser string |

> Vercel automatically restricts function access to your deployed domain.

#### Body (JSON)

| Field     | Type     | Required | Description |
|----------|----------|----------|-------------|
| `name`   | `string` | ✅ Yes   | Full name of sender |
| `email`  | `string` | ✅ Yes   | Valid email address |
| `message`| `string` | ✅ Yes   | Message content (min 10 chars) |
| `_honey` | `string` | ❌ No    | Honeypot field — if filled, request is from a bot |

> 🤖 **Honeypot Note**: This field should be empty. If present and non-empty, the server returns `200 OK` without sending emails — silently rejecting bots.

#### Example Request (curl)

```bash
curl -X POST https://portfolio-pro.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hi, I'd love to collaborate on a project!",
    "_honey": ""
  }'
```

### 📤 Response

#### Success (Bot Detected)
- **Status**: `200 OK`
- **Body**:
  ```json
  { "success": true }
  ```
> Sent when `_honey` field is filled — silent rejection.

#### Success (Human Submission)
- **Status**: `200 OK`
- **Body**:
  ```json
  { "success": true }
  ```
> Two emails are sent: one to owner, one to user.

#### Client Error
- **Status**: `400 Bad Request`
- **Body**:
  ```json
  { "message": "All fields are required." }
  ```
  or
  ```json
  { "message": "Invalid email format." }
  ```

#### Server Error
- **Status**: `500 Internal Server Error`
- **Body**:
  ```json
  { "message": "Failed to send message. Please try again later." }
  ```

### 📨 Email Delivery

Two emails are sent using Resend:

1. **To Owner**
   - From: `Portfolio Pro <onboarding@resend.dev>`
   - To: `process.env.OWNER_EMAIL`
   - Subject: `New Message from Jane Doe`
   - HTML: Rendered from `src/emails/contact-notification.js`
   - Text fallback included

2. **To User (Confirmation)**
   - From: `Portfolio Pro <onboarding@resend.dev>`
   - To: User's email
   - Subject: `Thank you for your message`
   - HTML: Rendered from `src/emails/contact-confirmation.js`

### ⚠️ Security & Validation

- **Honeypot Check**: Blocks bots silently
- **Field Validation**: Ensures all required fields are present
- **Email Format**: Regex check on `email` field
- **Server-Only Secrets**: `RESEND_API_KEY` never exposed to client
- **Rate Limiting**: Planned via Upstash Redis (5 requests / 10s per IP)

### 🧪 Testing Tips

1. Submit real form → check inbox/spam
2. Fill `_honey` field → should return 200 OK but no emails sent
3. Omit `email` → expect `400` with error
4. Use invalid email → expect `400`

> Use [Resend Test API Key](https://resend.com/docs/api-reference/emails/send-email) (`re_123456...`) in development — no emails are delivered.

---

✅ **Endpoint is production-ready** and secured for Vercel deployment.