import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// SECURITY FIX: Validate required environment variables
if (!process.env.RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY environment variable');
}
if (!process.env.OWNER_EMAIL) {
  console.error('Missing OWNER_EMAIL environment variable');
}
if (!process.env.SENDER_EMAIL) {
  console.error('Missing SENDER_EMAIL environment variable');
}

// SECURITY FIX: Sanitize user input to prevent XSS in email templates
function sanitizeInput(str: string): string {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, _honey } = req.body;

  // Honeypot spam check
  if (_honey) {
    return res.status(200).json({ success: true }); // Silent success to trick bots
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // SECURITY FIX: Sanitize all user inputs before use
  const safeName = sanitizeInput(name);
  const safeEmail = sanitizeInput(email);
  const safeMessage = sanitizeInput(message);

  try {
    // Send notification to site owner
    await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'onboarding@resend.dev', // Use env var with fallback
      to: [process.env.OWNER_EMAIL],
      subject: `New Message from ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Contact Form Submission</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Satoshi', sans-serif; background-color: #faf8f5; color: #1a2e1a; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; padding: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(90, 77, 64, 0.1); }
              .header { border-bottom: 1px solid #e9e5dd; padding-bottom: 16px; margin-bottom: 24px; }
              .header h1 { margin: 0; font-family: 'Fraunces', serif; font-size: 24px; color: #e66000; letter-spacing: -0.05em; }
              .content p { line-height: 1.6; margin: 12px 0; }
              .content strong { color: #1a2e1a; }
              .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e9e5dd; font-size: 14px; color: #5a4d40; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Portfolio Pro</h1>
              </div>
              <div class="content">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#e66000;">${safeEmail}</a></p>
                <p><strong>Message:</strong></p>
                <p style="background:#e9e5dd;padding:16px;border-radius:8px;">${safeMessage}</p>
              </div>
              <div class="footer">
                <p>This message was sent via the contact form on Portfolio Pro.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nMessage: ${safeMessage}`,
    });

    // Optionally send confirmation to user
    await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'onboarding@resend.dev', // Use env var with fallback
      to: [safeEmail],
      subject: 'Thank you for your message',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Message Received</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Satoshi', sans-serif; background-color: #faf8f5; color: #1a2e1a; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; padding: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(90, 77, 64, 0.1); }
              .header { border-bottom: 1px solid #e9e5dd; padding-bottom: 16px; margin-bottom: 24px; }
              .header h1 { margin: 0; font-family: 'Fraunces', serif; font-size: 24px; color: #e66000; letter-spacing: -0.05em; }
              .content p { line-height: 1.6; margin: 12px 0; }
              .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e9e5dd; font-size: 14px; color: #5a4d40; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Portfolio Pro</h1>
              </div>
              <div class="content">
                <p>Hi ${safeName},</p>
                <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
                <p>Looking forward to connecting.</p>
                <p>— Portfolio Pro</p>
              </div>
              <div class="footer">
                <p>You're receiving this because you submitted the contact form on the website.</p>
                <p><a href="#" style="color:#e66000;">Unsubscribe</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi ${safeName},\n\nThank you for reaching out. I'll get back to you soon.\n\n— Portfolio Pro`,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    // SECURITY FIX: Avoid logging sensitive or raw error data
    console.error('Error sending email:', error.message || 'Unknown error');
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
}
---