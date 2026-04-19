import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animated Section Wrapper
const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
      }}
      className="slide-up"
    >
      {children}
    </motion.section>
  );
};

// Toast Notification Component
const Toast: React.FC<{
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast bg-text text-white mb-4 rounded-lg shadow-md flex justify-between items-center animate-in slide-in-from-bottom w-full max-w-md mx-auto"
      style={{ backgroundColor: type === 'success' ? '#1a2e1a' : '#dc2626' }}
    >
      <span>{message}</span>
      <button
        type="button"
        aria-label="Close notification"
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:text-gray-200 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};

// Project Card Component
const ProjectCard: React.FC<{
  title: string;
  description: string;
  link: string;
}> = ({ title, description, link }) => {
  return (
    <motion.div
      className="bg-surface p-6 rounded-lg shadow-sm hover-lift focus-within:shadow-md focus-within:outline-none focus-within:ring-2 focus-within:ring-accent transition-shadow duration-300"
      tabIndex={0}
      role="article"
      aria-labelledby={`project-title-${title.replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3
        id={`project-title-${title.replace(/\s+/g, '-')}`}
        className="text-xl font-semibold text-text mb-2 font-display tracking-[-2px]"
      >
        {title}
      </h3>
      <p className="text-text-dim mb-4 leading-relaxed">{description}</p>
      <a
        href={link}
        className="inline-block text-accent hover:text-accent-alt font-medium focus:underline focus:outline-none"
        tabIndex={0}
      >
        View Project →
      </a>
    </motion.div>
  );
};

// Contact Form Component
const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    _honey: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = 'Name is required.';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!formState.message.trim()) newErrors.message = 'Message is required.';
    if (formState._honey.trim()) return false; // Honeypot triggered

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setToast({ message: 'Message sent successfully!', type: 'success' });
        setFormState({ name: '', email: '', message: '', _honey: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => setToast(null);

  return (
    <section
      id="contact"
      className="mt-16 md:mt-24"
      role="region"
      aria-labelledby="contact-heading"
    >
      <AnimatedSection>
        <h2
          id="contact-heading"
          className="text-3xl font-display tracking-[-2px] text-text text-center mb-8"
        >
          Get In Touch
        </h2>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={closeToast} />
        )}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-surface p-8 rounded-lg shadow-md"
          noValidate
        >
          {/* Honeypot Field */}
          <div className="absolute -left-96" aria-hidden="true">
            <label htmlFor="bot-field">Don’t fill this out</label>
            <input
              id="bot-field"
              name="_honey"
              type="text"
              value={formState._honey}
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus-glow"
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-red-500 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus-glow"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-red-500 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-text mb-1"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              required
              rows={5}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus-glow resize-none"
            />
            {errors.message && (
              <p
                id="message-error"
                className="mt-1 text-red-500 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent-alt text-white font-medium py-2 px-6 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-opacity-50 min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⟳</span> Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      </AnimatedSection>
    </section>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-text text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to content
      </a>

      <header className="py-12 text-center" role="banner">
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-display tracking-[-2px] text-text mb-2">
            Alex Morgan
          </h1>
          <p className="text-lg text-text-dim font-body">Full-Stack Developer & Designer</p>
        </AnimatedSection>
      </header>

      <main id="main-content" className="flex-grow">
        {/* About Section */}
        <section
          id="about"
          className="mt-12 md:mt-16"
          role="region"
          aria-labelledby="about-heading"
        >
          <AnimatedSection delay={0.2}>
            <h2
              id="about-heading"
              className="sr-only"
            >
              About Me
            </h2>
            <div className="max-w-3xl mx-auto text-center px-4">
              <p className="text-text-dim text-lg leading-relaxed max-w-2xl mx-auto">
                I’m a passionate developer who crafts clean, accessible, and performant web
                experiences. With a focus on minimalism and usability, I build digital
                products that are both beautiful and functional.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          className="mt-16 md:mt-24"
          role="region"
          aria-labelledby="projects-heading"
        >
          <AnimatedSection delay={0.3}>
            <h2
              id="projects-heading"
              className="text-3xl font-display tracking-[-2px] text-text text-center mb-10"
            >
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              <ProjectCard
                title="TaskFlow"
                description="A minimalist productivity app that helps users focus with time-blocking and distraction-free design."
                link="#"
              />
              <ProjectCard
                title="PaletteCraft"
                description="A color theory tool for designers, generating harmonious palettes based on emotional intent."
                link="#"
              />
              <ProjectCard
                title="BudgetBloom"
                description="A financial wellness app that visualizes spending habits and encourages sustainable growth."
                link="#"
              />
            </div>
          </AnimatedSection>
        </section>

        {/* Contact Form */}
        <ContactForm />
      </main>

      <footer className="py-8 text-center text-text-dim text-sm" role="contentinfo">
        <AnimatedSection delay={0.4}>
          &copy; {new Date().getFullYear()} Alex Morgan. Crafted with care.
        </AnimatedSection>
      </footer>
    </div>
  );
};

export default App;