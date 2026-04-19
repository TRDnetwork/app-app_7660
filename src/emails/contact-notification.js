export default function ContactNotification({ name, email, message }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e9e5dd;">
      <h1 style="font-family: 'Fraunces', serif; color: #1a2e1a; font-size: 24px; margin-bottom: 8px;">New Contact Form Submission</h1>
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">You've received a new message from your portfolio site.</p>
      
      <div style="margin: 24px 0; padding: 16px; background-color: #e9e5dd; border-radius: 8px;">
        <p style="margin: 8px 0; color: #1a2e1a;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 8px 0; color: #1a2e1a;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0; color: #1a2e1a;"><strong>Message:</strong></p>
        <p style="margin: 8px 0; color: #1a2e1a; background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #e66000;">${message}</p>
      </div>

      <footer style="color: #4a4a4a; font-size: 14px; border-top: 1px solid #e9e5dd; padding-top: 16px; margin-top: 24px;">
        <p>Received on ${new Date().toLocaleString()}.</p>
        <p>This message was sent via your Portfolio Pro contact form.</p>
      </footer>
    </div>
  `;
}