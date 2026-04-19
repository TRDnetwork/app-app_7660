import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Sanitize user input to prevent XSS
const sanitizeInput = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, _honey } = req.body;

  // Honeypot spam check
  if (_honey) {
    return res.status(200).json({ success: true });
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

  // Validate required environment variables
  if (!process.env.OWNER_EMAIL || !process.env.RESEND_API_KEY || !process.env.SENDER_EMAIL) {
    console.error('Missing required environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    // Sanitize user inputs
    const sanitized = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message)
    };

    // Lazy load templates only when needed
    const notificationHtml = await import('../src/emails/contact-notification.js')
      .then((m) => m.default(sanitized))
      .catch(() => '<p>Email template failed to load.</p>');

    await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: `New Contact Form Submission from ${sanitized.name}`,
      html: notificationHtml,
    });

    const confirmationHtml = await import('../src/emails/contact-confirmation.js')
      .then((m) => m.default({ name: sanitized.name }))
      .catch(() => '<p>Thank you for your message.</p>');

    await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: sanitized.email,
      subject: 'Thank you for reaching out!',
      html: confirmationHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error.message || 'Unknown error');
    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
}