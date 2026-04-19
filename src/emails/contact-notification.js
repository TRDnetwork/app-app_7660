export default function ContactNotification({ name, email, message }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: 'Satoshi', sans-serif; background-color: #faf8f5; color: #1a2e1a; line-height: 1.6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; font-family: 'Fraunces', serif; font-size: 28px; color: #1a2e1a; }
          .content p { margin: 16px 0; font-size: 16px; }
          .label { font-weight: 600; color: #1a2e1a; display: block; margin-top: 20px; }
          .message { background-color: #f9f9f9; padding: 16px; border-left: 4px solid #e66000; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
          .footer { margin-top: 40px; text-align: center; color: #4a4a4a; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Message from Portfolio Pro</h1>
          </div>
          <div class="content">
            <p><span class="label">From:</span> ${name} (${email})</p>
            <p><span class="label">Message:</span></p>
            <div class="message">${message}</div>
          </div>
          <div class="footer">
            <p>Sent via your personal portfolio contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}