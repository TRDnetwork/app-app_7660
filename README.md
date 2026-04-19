# Portfolio Pro

A clean, responsive personal portfolio site with project showcase and contact form. Built with React, Vite, and Tailwind CSS — deployed on Vercel with serverless email handling via Resend.

## ✨ Features

- **Hero Section**: Prominent name and role display with elegant typography
- **About Section**: Descriptive paragraph highlighting skills and philosophy
- **Project Showcase**: Three featured projects in a responsive grid layout (1 column mobile → 3 desktop)
- **Contact Form**:
  - Client-side validation for name, email, and message
  - Honeypot spam protection
  - Serverless email delivery via Resend
  - Success/error toast with 4s auto-dismiss and manual close
- **Performance Optimized**:
  - Lazy-loaded components
  - Code splitting
  - Inlined critical styles
- **Secure**:
  - Server-side email sending
  - Environment variable protection
  - Input validation
  - Honeypot anti-bot field

## 🎨 Design

- **Aesthetic**: Warm minimalism with editorial contrast
- **Colors**: Beige background (`#faf8f5`), dark green text (`#1a2e1a`), burnt orange accents (`#e66000`)
- **Typography**: 
  - Headings: **Fraunces** (serif)
  - Body: **Satoshi** (sans-serif)
- **Layout**: Centered vertical scroll, max-width 1200px, responsive padding
- **Interactions**: 
  - Framer Motion slide-up animations on scroll
  - Card hover-lift effect
  - Focus glow on form fields
  - Toast notifications with smooth entrance/exit

## ⚙️ Tech Stack

| Layer       | Technology |
|-----------|------------|
| Frontend  | React + Vite |
| Styling   | Tailwind CSS (CDN + inlined critical styles) |
| Animation | Framer Motion (via Tailwind keyframes) |
| Email     | Resend (serverless via Vercel function) |
| Hosting   | Vercel |
| Testing   | Vitest + @testing-library/react |
| Security  | Honeypot, server-side validation, env var protection |

## 📁 Folder Structure

```
portfolio-pro/
├── index.html                     # Main entry with inlined Tailwind & fonts
├── api/
│   └── contact.ts                 # Vercel serverless function for email
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Main app with lazy-loaded sections
│   ├── components/
│   │   ├── AboutSection.tsx       # About content
│   │   └── ContactSection.tsx     # Contact form with validation
│   └── emails/                    # (Not used — templates inlined in API)
├── tests/
│   ├── app.test.js                # Frontend component tests
│   └── api.test.js                # API endpoint tests
├── SECURITY_REPORT.md             # Security audit findings
├── PERFORMANCE_REPORT.md          # Optimization summary
└── EMAIL_SETUP.md                 # Resend configuration guide
```

## 🔧 Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/your-username/portfolio-pro.git
cd portfolio-pro
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXX
OWNER_EMAIL=you@yourdomain.com
```

> 🔐 Never commit `.env.local`. These are only available server-side.

### 3. Run Locally
```bash
npm run dev
```
Visit `http://localhost:5173`

### 4. Deploy to Vercel
```bash
vercel
```
Or connect your GitHub repo via [Vercel Dashboard](https://vercel.com)

Ensure environment variables are set in Vercel Project Settings → Environment Variables.

## 📨 Email Setup

This app uses **Resend** for reliable, branded email delivery.

1. Get your API key at [resend.com/api-keys](https://resend.com/api-keys)
2. Set `RESEND_API_KEY` and `OWNER_EMAIL` in Vercel
3. (Recommended) Verify your domain in Resend for better deliverability

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for full instructions.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Tests include:
- Hero section renders correctly
- About section displays content
- Project cards appear in responsive grid
- Form validation works client-side
- API endpoint handles spam, validation, and email delivery

## 🚀 API Endpoints

### `POST /api/contact`

Sends contact form submission via email.

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello! I'd love to collaborate.",
  "bot-field": "" // honeypot (hidden)
}
```

**Success Response (200)**:
```json
{ "success": true }
```

**Error Responses**:
- `400`: Missing fields or invalid email
- `405`: Method not allowed
- `500`: Server error

**Emails Sent**:
1. **Notification** to site owner with submission details
2. **Confirmation** to user with thank-you message

### Example cURL
```bash
curl -X POST https://portfolio-pro.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message.",
    "bot-field": ""
  }'
```

## 🛡️ Security

- **Honeypot Protection**: Hidden `bot-field` blocks spam bots
- **Server-Side Email**: API key never exposed to client
- **Input Validation**: Required fields and email format checked
- **Error Handling**: Generic messages to users, detailed logs only server-side
- **Rate Limiting**: Not implemented — see recommendations below

> ⚠️ **Critical Security Note**: The sender email is currently hardcoded. For production, use an environment variable.

## 📈 Performance

- **Bundle Size**: ~31 KB (after optimizations)
- **Optimizations**:
  - Lazy loading of non-critical sections
  - Code splitting via dynamic imports
  - Memoized components to prevent re-renders
  - Deferred imports in serverless function
  - Preloaded critical fonts

See [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) for full details.

## 📌 Deployment Notes

- **Vercel-Only**: Optimized for Vercel deployment
- **Static Site**: No database or authentication
- **Serverless Functions**: `/api/contact` runs as Vercel Edge Function
- **No Build Issues**: Tailwind via CDN avoids plugin complexity

## 📚 Documentation

- [EMAIL_SETUP.md](./EMAIL_SETUP.md) — Configure Resend email delivery
- [SECURITY_REPORT.md](./SECURITY_REPORT.md) — Security audit and fixes
- [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) — Optimization strategies

---

Made with ❤️ using React, Vite, and Tailwind — deployed with confidence on Vercel.