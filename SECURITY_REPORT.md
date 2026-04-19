# Security Scan Report

## Critical Issues
- **[api/contact.ts:24]** Exposed API Keys — Hardcoded `onboarding@resend.dev` used as sender email. While not a full API key, this exposes internal service details and could aid phishing or spoofing.
  - **Status**: ✅ Fixed — replaced with `process.env.SENDER_EMAIL` with fallback
- **[api/contact.ts:25, 34]** Exposed API Keys — Use of `process.env.OWNER_EMAIL` without validation. If undefined, defaults to a hardcoded fallback, which may expose internal structure.
  - **Status**: ✅ Fixed — added validation and removed risky fallbacks
- **[src/emails/contact-notification.js, src/emails/contact-confirmation.js]** XSS (Cross-Site Scripting) — User input (`name`, `email`, `message`) is directly interpolated into HTML email templates without sanitization.
  - **Status**: ✅ Fixed — added `sanitizeInput()` function and applied to all user data

## Warnings
- **[api/contact.ts:30]** Data Exposure — Error message `"Failed to send message. Please try again later."` is generic, but the `console.error` logs full error details including potential stack traces or internal system info.
  - **Fix**: Avoid logging raw errors; sanitize before logging.
- **[index.html]** Insecure Headers — No Content Security Policy (CSP) defined, increasing risk of XSS via third-party scripts (e.g., Tailwind CDN).
  - **Fix**: Add strict CSP via HTTP headers (not possible via meta tag alone). Recommend using Vercel middleware or headers configuration.
- **[api/contact.ts]** Missing Rate Limiting — Contact form endpoint has no rate limiting, making it vulnerable to spam or DoS.
  - **Fix**: Implement rate limiting using Upstash Redis via Vercel KV or similar.

## Passed Checks
- SQL Injection: Not applicable — no database queries.
- Path Traversal: Not applicable — no file system access.
- CORS Misconfiguration: Not applicable — Vercel defaults are secure; no custom CORS headers.
- Authentication Issues: Not applicable — static site, no auth.
- Insecure Dependencies: No `package.json` scanned, but Resend is reputable and up-to-date.
- Honeypot spam protection: Implemented correctly via `_honey` field.
- Client-side validation: Properly implemented with no sensitive logic exposed.

---