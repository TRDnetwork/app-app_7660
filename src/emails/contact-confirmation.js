export default function ContactConfirmation({ name }) {
  return `
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
            <p>Hi ${name},</p>
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
  `;
}