export default function ContactConfirmation({ name }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e9e5dd;">
      <h1 style="font-family: 'Fraunces', serif; color: #1a2e1a; font-size: 24px; margin-bottom: 8px;">Thanks for reaching out, ${name}!</h1>
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
        I've received your message and will get back to you as soon as possible.
      </p>
      
      <div style="margin: 24px 0; padding: 16px; background-color: #fff8f0; border-radius: 8px; border-left: 4px solid #e66000;">
        <p style="color: #1a2e1a; margin: 0;">In the meantime, feel free to explore my projects or connect on social media.</p>
      </div>

      <footer style="color: #4a4a4a; font-size: 14px; border-top: 1px solid #e9e5dd; padding-top: 16px; margin-top: 24px;">
        <p>Sent from Portfolio Pro — a minimalist showcase of work and ideas.</p>
        <p>If you didn't send this, no action is needed.</p>
      </footer>
    </div>
  `;
}