# 📨 Email Setup Instructions

## 1. Get Your Resend API Key
- Go to [resend.com](https://resend.com) and sign up or log in.
- Create a new API key (e.g., `resend_...`).
- **Keep this key private** — never commit it to version control.

## 2. Set Environment Variables in Vercel
In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | `your-resend-api-key` |
| `OWNER_EMAIL` | `you@yourdomain.com` (or any email to receive form submissions) |
| `UPSTASH_REDIS_REST_URL` | (Optional) Your Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | (Optional) Your Upstash Redis token |

> ⚠️ **Never use `VITE_` prefix** — those are exposed to the browser. All email-related env vars must be server-side only.

## 3. Verify Your Sending Domain
- In the Resend dashboard, verify your sending domain (e.g., `yourdomain.com` or `resend.dev` for testing).
- This improves email deliverability and prevents spam flags.

## 4. Frontend Integration
Your frontend should send a `POST` request to `/api/contact`:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hi, I love your work!',
    'bot-field': '' // honeypot — leave empty
  })
});
```

## 5. Test the Flow
- Submit the form locally or on your deployed URL.
- Check:
  - ✅ You receive the email at `OWNER_EMAIL`
  - ✅ User gets a confirmation email
  - ✅ Success toast appears
  - ✅ Rate limiting blocks after 5 requests (if Upstash configured)

## 6. Monitor Logs
- Check **Vercel Logs** for any errors in `/api/contact`.
- Use **Sentry** or **PostHog** to track form submission events and failures.

---

✅ Done! Your portfolio now has a fully functional, secure, and rate-limited contact form with professional email templates.