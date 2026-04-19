# 📨 Email Setup Instructions

Your portfolio site uses **Resend** to deliver contact form submissions via a Vercel serverless function.

## Step 1: Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new key (e.g., `portfolio-pro`).
3. Copy the key (`re_...`).

## Step 2: Set Environment Variables in Vercel
In your Vercel project dashboard:
- Add `RESEND_API_KEY` = `re_...` (your key from Resend)
- Add `OWNER_EMAIL` = your personal email (e.g., `you@domain.com`)

> 🔒 Never use `VITE_RESEND_API_KEY` — that would expose your secret to the browser.

## Step 3: Verify Your Sending Domain
1. In Resend Dashboard, go to **Domains**.
2. Add and verify your domain (e.g., `your-portfolio.vercel.app` or custom domain).
3. This improves email deliverability and prevents spam flags.

## Step 4: Frontend Integration (Already Done)
Your contact form submits like this:
```ts
await fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify({ name, email, message }),
});
```
No client-side email logic — all secure server-side handling.

## ✅ Test the Flow
1. Submit the form locally or in preview.
2. Check your inbox for the notification.
3. Verify the auto-reply was sent to the user.

## 🛠️ Troubleshooting
- Check Vercel logs (`/api/contact`) for errors.
- Ensure `RESEND_API_KEY` is set and correct.
- Confirm domain is verified in Resend.
- Look for CORS issues (should be auto-handled by Vercel).

Need help? Visit [Resend Docs](https://resend.com/docs) or check Vercel deployment logs.