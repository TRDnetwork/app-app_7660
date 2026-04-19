# 📨 Email Setup Instructions

This portfolio uses [Resend](https://resend.com) to send emails from the contact form via a Vercel serverless function.

## Step 1: Get Your Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create an API key (e.g., `re_123456...`)
3. Keep it secure — never commit to version control

## Step 2: Set Environment Variables in Vercel
In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

| Key               | Value                          |
|-------------------|--------------------------------|
| `RESEND_API_KEY`  | `re_123456...` (your key)      |
| `OWNER_EMAIL`     | `you@yourdomain.com` (your real email) |

⚠️ **Important**: Do NOT use `VITE_RESEND_API_KEY` — that would expose the key to the browser. Only server-side functions can access `RESEND_API_KEY`.

## Step 3: Verify Your Sending Domain
1. In Resend Dashboard, verify your sending domain (e.g., `portfolio-pro.com`)
2. Add the required DNS records (TXT + CNAME) to your domain provider

## Step 4: Frontend Integration
The frontend submits the form like this:
```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, _honey }),
});
```

No client-side email library is used — all sending happens securely in `api/contact.ts`.

## Step 5: Test the Form
Submit the contact form and check:
- You receive the notification email
- The user receives the confirmation email
- Success toast appears for 4 seconds

✅ Done! Your contact form is now live and secure.