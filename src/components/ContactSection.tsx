import { useState } from 'react';

interface ContactSectionProps {
  showToast: (message: string, type: 'success' | 'error') => void;
  debouncedSubmit: (fn: () => void, delay?: number) => void;
}

export default function ContactSection({ showToast, debouncedSubmit }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    'bot-field': '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData['bot-field'] && !formData.name) newErrors.name = 'Name is required.';
    if (!formData['bot-field'] && !formData.email) newErrors.email = 'Email is required.';
    if (!formData['bot-field'] && !formData.message) newErrors.message = 'Message is required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please correct the errors before submitting.', 'error');
      return;
    }

    debouncedSubmit(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await res.json();
        if (result.success) {
          showToast('Message sent successfully!', 'success');
          setFormData({ name: '', email: '', message: '', 'bot-field': '' });
        } else {
          throw new Error(result.message || 'Unknown error');
        }
      } catch (error) {
        showToast('Failed to send message. Please try again.', 'error');
      }
    });
  };

  return (
    <div className="container mx-auto px-4" role="form" aria-labelledby="contact-heading">
      <div className="max-w-2xl mx-auto bg-surface p-8 rounded-lg shadow-md pulse-hover">
        <h2 id="contact-heading" className="text-3xl font-semibold text-text mb-6 font-display text-center slide-up">
          Get In Touch
        </h2>
        <form onSubmit={handleSubmit} noValidate aria-describedby={errors.root ? "form-error-message" : undefined}>
          {errors.root && (
            <div id="form-error-message" className="text-red-600 text-sm mb-4" role="alert" aria-live="polite">
              {errors.root}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-text-dim font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full px-4 py-2 border border-surface focus:border-accent outline-none rounded-md focus-glow bg-white"
              />
              {errors.name && (
                <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-text-dim font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full px-4 py-2 border border-surface focus:border-accent outline-none rounded-md focus-glow bg-white"
              />
              {errors.email && (
                <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-text-dim font-medium mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="w-full px-4 py-2 border border-surface focus:border-accent outline-none rounded-md focus-glow bg-white"
            ></textarea>
            {errors.message && (
              <p id="message-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Honeypot field (hidden) */}
          <div className="absolute left-full w-px h-px overflow-hidden" aria-hidden="true">
            <label htmlFor="bot-field" className="sr-only">Leave this field blank</label>
            <input
              type="text"
              id="bot-field"
              name="bot-field"
              value={formData['bot-field']}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-accent text-white px-8 py-3 rounded-md hover:bg-accent-alt transition font-medium focus-glow"
              aria-label="Send your message"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}