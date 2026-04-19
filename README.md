# Portfolio Pro

A warm minimalist personal portfolio site with project showcase and contact form powered by React and Vite.

## Features

- ✅ Responsive hero section with headline, subheading, and scroll CTA
- ✅ About section with single warm-tone paragraph
- ✅ Three project cards in a responsive grid (1 column mobile, 2 tablet, 3 desktop)
- ✅ Secure contact form with validation, honeypot, and success/error toasts
- ✅ End-to-end email delivery via Resend API
- ✅ Rate limiting using Upstash Redis (5 requests per 10 seconds per IP)
- ✅ Spam protection with honeypot field
- ✅ Client-side form validation and error handling
- ✅ Success toast with auto-dismiss (4s) and manual close option
- ✅ Built-in analytics with PostHog
- ✅ Error tracking with Sentry
- ✅ Optimized performance: lazy loading, code splitting, font preloading

## Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS (CDN) with custom warm minimalism theme
- Framer Motion for scroll animations

**Backend**
- Vercel Serverless Functions (`/api/contact`, `/api/health`)
- Resend API for email delivery
- Upstash Redis for rate limiting

**Analytics & Monitoring**
- PostHog (autocapture + custom events)
- Sentry (error tracking)

**Deployment**
- Vercel (serverless functions, edge network)
- Environment variable protection (no client-side leaks)

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/your-username/portfolio-pro.git
cd portfolio-pro
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Required for email delivery
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=you@yourdomain.com

# Optional: Rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Analytics
VITE_POSTHOG_KEY=your_posthog_key
VITE_SENTRY_DSN=https://your-sentry-dsn@o123.ingest.sentry.io/456
```

> ⚠️ **Never commit `.env` to version control.** Use Vercel's environment variable dashboard in production.

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## API Endpoints

### `POST /api/contact` — Submit Contact Form

**Request Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello! I'd like to work together.",
  "bot-field": ""
}
```

**Success Response (200)**
```json
{
  "success": true,
  "messageId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Error Responses**
- `400 Bad Request`: Missing fields or invalid email
- `405 Method Not Allowed`: Non-POST request
- `429 Too Many Requests`: Rate limit exceeded (5/10s per IP)
- `500 Internal Server Error`: Email sending failed

**Example cURL**
```bash
curl -X POST https://your-site.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Hi there!",
    "bot-field": ""
  }'
```

### `GET /api/health` — Health Check

**Response (200)**
```json
{ "status": "ok" }
```

## Folder Structure

```
portfolio-pro/
├── api/
│   ├── contact.ts          # Contact form handler (Vercel serverless)
│   └── health.ts           # Health check endpoint
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ContactForm.tsx
│   │   ├── Hero.tsx
│   │   ├── ProjectCard.tsx
│   │   └── Toast.tsx
│   ├── emails/             # Email HTML templates
│   ├── lib/                # Utility libraries
│   └── App.tsx             # Main layout
├── tests/                  # Test suite
├── .env.example            # Environment variable template
├── vite.config.ts          # Vite configuration
└── vercel.json             # Vercel deployment config
```

## Security

- ✅ **Honeypot spam protection**: Hidden `bot-field` blocks automated submissions
- ✅ **Input validation**: Required fields and email format checked server-side
- ✅ **Rate limiting**: Upstash Redis limits 5 requests per 10 seconds per IP
- ✅ **Environment isolation**: No sensitive variables exposed to frontend
- ✅ **Error handling**: Generic 5xx messages, detailed logs only on server
- ✅ **XSS prevention**: User input sanitized before email rendering

## Performance

- **Bundle size**: ~108KB (gzipped) after optimizations
- **Key optimizations**:
  - Lazy-loaded Framer Motion
  - Code splitting for vendor/motion chunks
  - Font preloading
  - Image lazy loading
  - Critical CSS inlined
  - Vendor chunk caching

See `PERFORMANCE_REPORT.md` for full details.

## Testing

```bash
npm test
```

Test suite includes:
- Component rendering (React Testing Library)
- Form validation flows
- API endpoint behavior
- Honeypot and rate limiting logic
- Mocked Resend email delivery

## Email Setup

See `EMAIL_SETUP.md` for detailed instructions on configuring Resend, domain verification, and testing.

## Analytics

PostHog events tracked:
- Page views (`$pageview`)
- CTA button clicks (`cta_clicked`)
- Form submission attempts (`form_submitted`)
- Form success (`form_success`)

Configure with `VITE_POSTHOG_KEY` environment variable.

## Deployment Notes

- Deployed via Vercel with zero configuration
- Serverless functions automatically scaled
- Environment variables secured in Vercel dashboard
- Recommended: Set up custom domain and SSL
- Monitor logs and errors via Vercel + Sentry

---

Built with ❤️ using warm minimalism design principles:  
Beige background (`#faf8f5`), dark green text (`#1a2e1a`), burnt orange accents (`#e66000`).  
Fonts: Fraunces (headings), Satoshi (body).