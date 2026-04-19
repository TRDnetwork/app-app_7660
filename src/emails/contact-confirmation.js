export default function ContactConfirmation({ name }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received</title>
        <style>
          body { font-family: 'Satoshi', sans-serif; background-color: #faf8f5; color: #1a2e1a; line-height: 1.6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; font-family: 'Fraunces', serif; font-size: 28px; color: #1a2e1a; }
          .icon { font-size: 48px; color: #e66000; margin-bottom: 16px; }
          .content p { margin: 16px 0; font-size: 16px; }
          .footer { margin-top: 40px; text-align: center; color: #4a4a4a; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">✅</div>
            <h1>Thank You, ${name}!</h1>
          </div>
          <div class="content">
            <p>Your message has been received. I'll get back to you as soon as possible.</p>
            <p>In the meantime, feel free to explore more of my work on the site.</p>
          </div>
          <div class="footer">
            <p>Sent from Portfolio Pro — A warm minimalist personal portfolio.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}