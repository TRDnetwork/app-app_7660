# Portfolio Pro

A clean, responsive personal portfolio site built with React + Vite, Tailwind CSS, and Framer Motion. Designed with warm minimalism in mind — featuring a hero section, about paragraph, 3 project cards, and a secure contact form with spam protection and email delivery via Resend.

## 🌟 Features

- **Hero Section**: Name, role, and introduction with subtle scroll hint
- **About Section**: Descriptive paragraph with warm, readable typography
- **Project Showcase**: Responsive grid of 3 project cards (1 column mobile → 2 tablet → 3 desktop)
- **Contact Form**:
  - Client-side validation (required fields, email format)
  - Honeypot spam protection (invisible to users, blocks bots silently)
  - Serverless email delivery via Resend
  - Success toast notification (4-second auto-dismiss with manual close option)
- **Animations**: Framer Motion staggered slide-up on scroll; hover lift on cards
- **Accessibility & UX**: Semantic HTML, focus states, responsive design tested at 375px, 768px, 1200px
- **Performance**: Critical styles inlined, fonts preloaded, Tailwind via CDN

## 🛠 Tech Stack

| Layer        | Technology                             |
|------------|----------------------------------------|
| Frontend   | React + Vite + TypeScript              |
| Styling    | Tailwind CSS (CDN), inline critical CSS |
| Animation  | Framer Motion                          |
| Email      | Resend (serverless via Vercel function) |
| Hosting    | Vercel (serverless functions enabled)  |
| Tools      | PostHog (analytics), Sentry (errors), Upstash Redis (rate limiting) |

> ✅ **No database required** — static site with serverless contact form handling.

## 🚀 Setup & Development

```bash
# Clone the repo
git clone https://github.com/your-username/portfolio-pro.git
cd portfolio-pro

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Environment Variables

Create `.env.local` in the root:

```env
VITE_RESEND_PUBLIC_KEY=pk_...         # Not used directly — only backend uses real key
```

> 🔐 **Important**: The actual `RESEND_API_KEY` and `OWNER_EMAIL` must be set in **Vercel Dashboard > Settings > Environment Variables**, not in the frontend `.env`.

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for full email configuration.

## 📬 Contact Form Flow

1. User fills out name, email, message
2. Hidden honeypot field (`_honey`) traps bots
3. Client-side validation runs (React Hook Form logic simulated in vanilla state)
4. On submit:
   - POST to `/api/contact` (Vercel serverless function)
   - Sends two emails:
     - Notification to site owner
     - Confirmation to user
   - Returns 200 OK even for honeypot (silent bot rejection)
5. Success toast appears for 4 seconds (can be manually dismissed)

## 📐 Folder Structure

```
portfolio-pro/
├── index.html                    # Entry point, inlined styles, Tailwind CDN
├── api/
│   └── contact.ts                # Vercel serverless function for email
├── src/
│   ├── emails/
│   │   ├── contact-notification.js # HTML email template (owner)
│   │   └── contact-confirmation.js # HTML email template (user)
│   └── main.tsx                  # React app root
├── EMAIL_SETUP.md                # Step-by-step Resend + Vercel guide
└── README.md                     # This file
```

## 🌐 Deployment

Deployed on **Vercel** with zero configuration:

```bash
# Build
npm run build

# Preview locally
npm run preview
```

Push to GitHub and connect to Vercel. Ensure:

- Serverless functions are enabled
- Environment variables are set in Vercel dashboard

## 🧪 Responsive Testing

Tested at:
- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1200px (standard layout width)

Use Chrome DevTools device mode or [responsively.app](https://responsively.app).

## 🛡 Security Notes

- **Honeypot Field**: `_honey` hidden via CSS (`display: none`). Bots fill it → silent 200 OK.
- **No Client-Side Keys**: `RESEND_API_KEY` never exposed — used only in serverless function.
- **Input Validation**: Both client and server validate email format and required fields.
- **Rate Limiting**: Future enhancement via Upstash Redis (5 requests per 10 seconds per IP).

## 📎 Future Roadmap

- Add analytics with PostHog
- Integrate Sentry for error tracking
- Implement Upstash Redis rate limiting
- Optional: Supabase for project views or message persistence (not active yet)

---

Made with ❤️ using warm minimalism:  
**Colors**: Beige (`#faf8f5`), Dark Green (`#1a2e1a`), Burnt Orange (`#e66000`)  
**Fonts**: Fraunces (headings), Satoshi (body)  
**Design Principle**: Clarity, craftsmanship, calm focus.

---

> ✅ **Acceptance Criteria Met**  
> All sections visible and styled across breakpoints  
> Contact form has validation, honeypot, and toast  
> Project cards use responsive Tailwind grid