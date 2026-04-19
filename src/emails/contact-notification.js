export default function ContactNotification({ name, email, message }) {
  return `
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
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#e66000;">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background:#e9e5dd;padding:16px;border-radius:8px;">${message}</p>
          </div>
          <div class="footer">
            <p>This message was sent via the contact form on Portfolio Pro.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}