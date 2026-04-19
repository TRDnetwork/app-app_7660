# 📨 Email Setup for Portfolio Pro

This site uses [Resend](https://resend.com) to deliver contact form submissions via a Vercel serverless function.

## ✅ Step 1: Get Your Resend API Key
1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it `portfolio-pro` (or similar)
4. Copy the key (`re_...`)

> 🔐 Never commit this key to Git.

## ✅ Step 2: Set Environment Variables in Vercel
In your Vercel project dashboard:

Add these environment variables:

| Key               | Value                                |
|-------------------|--------------------------------------|
| `RESEND_API_KEY`  | `re_...` (from Step 1)               |
| `OWNER_EMAIL`     | `you@yourdomain.com` (your real email) |

> ⚠️ Do NOT use `VITE_RESEND_API_KEY` — that would expose the key to the browser. This must be server-side only.

## ✅ Step 3: Verify Your Sending Domain (Recommended)
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `portfolio-pro.com`)
4. Follow DNS instructions (add TXT + MX records)
5. Wait for verification (usually <5 mins)

This improves email deliverability and prevents spam filtering.

## ✅ Step 4: Test the Contact Form
1. Deploy your site
2. Fill out the contact form with real data
3. Check:
   - You receive the notification email
   - The user receives a confirmation email
   - No errors in Vercel logs (`/api/contact`)

## 🛠 Frontend Integration Note
The frontend calls the API like this:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, 'bot-field': '' }),
});
```

No client-side email library is used or needed.

## 🧪 Debugging
- Check Vercel logs: https://vercel.com/logs
- Resend dashboard shows all sent emails: https://resend.com/emails
- Use Sentry for error tracking (already configured)

## 📌 Summary
- Email sending is 100% server-side
- API key never leaves Vercel
- Honeypot + validation prevent spam
- Responsive, branded email templates
- Confirmation + notification flows

You're all set! 🚀