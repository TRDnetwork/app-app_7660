import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Skip to Content Link (a11y)
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-accent focus:text-white focus:p-2 focus:rounded-md z-50"
    aria-label="Skip to main content"
  >
    Skip to Content
  </a>
);

// Hero Section
const Hero: React.FC = () => (
  <section
    id="hero"
    className="py-24 text-center"
    aria-labelledby="hero-heading"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1
        id="hero-heading"
        className="text-4xl md:text-6xl font-bold font-display text-text mb-4 tracking-tight"
      >
        Alex Morgan
      </h1>
      <p
        className="text-lg md:text-xl text-text-dim mb-6 max-w-2xl mx-auto"
        aria-describedby="hero-subheading"
      >
        <span id="hero-subheading">Frontend Developer & UI Designer</span>
      </p>
      <p
        className="text-text-dim max-w-prose mx-auto mb-8"
        style={{ maxWidth: '65ch' }}
      >
        Crafting clean, accessible interfaces with a focus on performance and user experience.
      </p>
      <motion.div
        whileHover={{ y: -5 }}
        className="inline-block"
        aria-hidden="true"
        tabIndex={-1}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="animate-bounce text-text-dim"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  </section>
);

// About Section
const About: React.FC = () => (
  <section
    id="about"
    className="py-16 bg-surface"
    aria-labelledby="about-heading"
  >
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2
          id="about-heading"
          className="text-3xl font-display font-bold mb-6 text-text text-center"
        >
          About Me
        </h2>
        <div className="max-w-prose mx-auto">
          <p
            className="text-text-dim text-lg leading-relaxed"
            style={{ maxWidth: '65ch' }}
          >
            I'm a frontend developer with over 5 years of experience building responsive, accessible web applications. 
            My background in design allows me to bridge the gap between aesthetics and functionality, 
            ensuring every pixel serves a purpose. I'm passionate about performance, clean code, 
            and creating inclusive digital experiences.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

// Project Card Component
interface ProjectProps {
  title: string;
  description: string;
  link: string;
}

const ProjectCard: React.FC<ProjectProps> = ({ title, description, link }) => {
  return (
    <motion.article
      className="bg-white p-6 rounded-lg shadow-sm border border-surface hover-lift focus-within:outline focus-within:outline-2 focus-within:outline-accent transition-all duration-300 flex flex-col"
      tabIndex={0}
      role="article"
      aria-labelledby={`project-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileFocus={{ scale: 1.02 }}
    >
      <h3
        id={`project-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-xl font-semibold text-text mb-3 font-display"
      >
        {title}
      </h3>
      <p
        className="text-text-dim flex-grow"
        id={`project-desc-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {description}
      </p>
      <a
        href={link}
        className="mt-4 inline-flex items-center text-accent hover:text-accent-alt font-medium focus:outline-none focus:underline"
        aria-describedby={`project-desc-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        View Project
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="ml-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 12L11 6M11 6L5 0M11 6H3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </motion.article>
  );
};

// Projects Section
const Projects: React.FC = () => (
  <section
    id="projects"
    className="py-16"
    aria-labelledby="projects-heading"
  >
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2
          id="projects-heading"
          className="text-3xl font-display font-bold mb-10 text-text text-center"
        >
          Featured Projects
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: 'EcoShop',
            description:
              'A sustainable e-commerce platform with carbon footprint tracking and eco-packaging options.',
            link: '#project1',
          },
          {
            title: 'TaskFlow',
            description:
              'A minimalist productivity app with focus timers, task prioritization, and dark mode support.',
            link: '#project2',
          },
          {
            title: 'HealthTrack',
            description:
              'A wellness dashboard that visualizes sleep, nutrition, and activity data with personalized insights.',
            link: '#project3',
          },
        ].map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Contact Form
const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (data: FormData) => {
    const errors: Record<string, string> = {};
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const message = data.get('message') as string;

    if (!name?.trim()) errors.name = 'Name is required';
    if (!email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!message?.trim()) errors.message = 'Message is required';

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const honeypot = formData.get('bot-field') as string | null;

    // Honeypot check
    if (honeypot && honeypot.trim() !== '') {
      console.log('Bot detected');
      return;
    }

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      e.currentTarget.reset();
      setFormErrors({});
      // Auto-dismiss toast after 4s
      setTimeout(() => setIsSubmitted(false), 4000);
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="py-16 bg-surface"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="contact-heading"
            className="text-3xl font-display font-bold mb-8 text-text text-center"
          >
            Get In Touch
          </h2>
        </motion.div>
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
            aria-describedby={formErrors.root ? 'form-error-message' : undefined}
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-text-dim font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  formErrors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-surface focus:ring-accent'
                } focus-glow`}
                aria-invalid={formErrors.name ? 'true' : 'false'}
                aria-describedby={formErrors.name ? 'name-error' : undefined}
              />
              {formErrors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-red-600 text-sm"
                  role="alert"
                >
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-text-dim font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  formErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-surface focus:ring-accent'
                } focus-glow`}
                aria-invalid={formErrors.email ? 'true' : 'false'}
                aria-describedby={formErrors.email ? 'email-error' : undefined}
              />
              {formErrors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-red-600 text-sm"
                  role="alert"
                >
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-text-dim font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                autoComplete="off"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  formErrors.message
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-surface focus:ring-accent'
                } focus-glow resize-none`}
                aria-invalid={formErrors.message ? 'true' : 'false'}
                aria-describedby={formErrors.message ? 'message-error' : undefined}
              />
              {formErrors.message && (
                <p
                  id="message-error"
                  className="mt-1 text-red-600 text-sm"
                  role="alert"
                >
                  {formErrors.message}
                </p>
              )}
            </div>

            {/* Honeypot Field */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="bot-field">Don’t fill this out</label>
              <input
                id="bot-field"
                name="bot-field"
                type="text"
                autoComplete="off"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-alt transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus-glow pulse-hover disabled:opacity-70 disabled:cursor-not-allowed"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>

          {/* Success Toast */}
          {isSubmitted && (
            <motion.div
              className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-live="polite"
              role="status"
            >
              <span>Message sent successfully!</span>
              <button
                type="button"
                className="ml-4 text-white hover:text-gray-200"
                onClick={() => setIsSubmitted(false)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer: React.FC = () => (
  <footer
    className="py-8 text-center text-text-dim text-sm"
    role="contentinfo"
  >
    <div className="container">
      &copy; {new Date().getFullYear()} Alex Morgan. Crafted with care.
    </div>
  </footer>
);

// Main App Component
const App: React.FC = () => {
  return (
    <>
      <SkipToContent />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
---