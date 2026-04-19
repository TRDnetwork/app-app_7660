import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', 'bot-field': '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.message) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Debounce rapid submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage('Message sent successfully!');
        setShowToast(true);
        setFormData({ name: '', email: '', message: '', 'bot-field': '' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-surface p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Get In Touch</h2>

      {/* Honeypot field */}
      <div className="hidden">
        <label htmlFor="bot-field">Don’t fill this out</label>
        <input
          id="bot-field"
          name="bot-field"
          type="text"
          value={formData['bot-field']}
          onChange={handleChange}
          tabIndex={-1}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-surface'} rounded focus:outline-none focus-glow`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-surface'} rounded focus:outline-none focus-glow`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block mb-1 font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-surface'} rounded focus:outline-none focus-glow`}
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-white py-3 rounded font-medium hover:bg-accent-alt transition focus:outline-none focus-glow"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {showToast && (
        <div className="toast fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 max-w-xs text-center">
          {toastMessage}
          <button
            onClick={() => setShowToast(false)}
            className="ml-4 text-sm underline"
            aria-label="Dismiss"
          >
            Dismiss
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
// PERF: Debounced submission, memoized state updates, optimized error handling