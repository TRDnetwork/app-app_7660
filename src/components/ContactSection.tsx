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
    _honey: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!_honey && (!formData.name || !formData.email || !formData.message)) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address.', 'error');
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
          setFormData({ name: '', email: '', message: '', _honey: '' });
        } else {
          throw new Error(result.message || 'Unknown error');
        }
      } catch (error) {
        showToast('Failed to send message. Please try again.', 'error');
      }
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto bg-surface p-8 rounded-lg shadow-md pulse-hover">
        <h2 className="text-3xl font-semibold text-text mb-6 font-display text-center slide-up">
          Get In Touch
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-2 border border-surface focus:border-accent outline-none rounded-md focus-glow bg-white"
              />
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
                className="w-full px-4 py-2 border border-surface focus:border-accent outline-none rounded-md focus-glow bg-white"
              />
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
              className="w-full px-4 py-2 border border-surface focus:border-accent outline-none rounded-md focus-glow bg-white"
            ></textarea>
          </div>

          {/* Honeypot field (hidden) */}
          <div className="absolute left-full w-px h-px overflow-hidden" aria-hidden="true">
            <input
              type="text"
              name="_honey"
              value={formData._honey}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-accent text-white px-8 py-3 rounded-md hover:bg-accent-alt transition font-medium"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
---