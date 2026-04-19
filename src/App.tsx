import { useState, lazy, Suspense } from 'react';

// Lazy load heavy sections // PERF: Code splitting + reduced initial bundle
const AboutSection = lazy(() => import('./components/AboutSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));

// Memoized ProjectCard to avoid re-renders // PERF: Prevents unnecessary renders
const ProjectCard = React.memo(function ProjectCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-sm hover-lift slide-up" role="article" aria-labelledby={`project-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <h3 id={`project-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-semibold text-text mb-2">
        {title}
      </h3>
      <p className="text-text-dim mb-4">{description}</p>
      <a
        href={link}
        className="inline-block text-accent hover:text-accent-alt font-medium"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View project: ${title}`}
      >
        View Project →
      </a>
    </div>
  );
});

function App() {
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Debounce submission to prevent spam // PERF: Avoids rapid API calls
  let submitTimeout: NodeJS.Timeout | null = null;
  const debouncedSubmit = (fn: () => void, delay = 1000) => {
    if (submitTimeout) clearTimeout(submitTimeout);
    submitTimeout = setTimeout(fn, delay);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <header className="py-20 text-center slide-up" role="banner">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-text font-display leading-tight" id="main-content">
            Jane Doe
          </h1>
          <p className="text-xl text-text-dim mt-4 max-w-2xl mx-auto" aria-label="Professional role and expertise">
            Full-Stack Developer & UI Designer crafting clean, performant web experiences with a
            minimalist touch.
          </p>
        </div>
      </header>

      {/* About Section */}
      <section className="py-16" aria-labelledby="about-heading">
        <Suspense fallback={<div className="text-center py-10" role="status" aria-live="polite">Loading about...</div>}>
          <AboutSection />
        </Suspense>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-surface" aria-labelledby="projects-heading" role="region">
        <div className="container mx-auto px-4">
          <h2 id="projects-heading" className="text-3xl font-semibold text-text text-center mb-12 font-display slide-up">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Project list">
            <ProjectCard
              title="TaskFlow"
              description="A minimalist productivity app with dark mode and offline support."
              link="https://taskflow.example.com"
            />
            <ProjectCard
              title="Palette"
              description="Color theory tool for designers with accessible contrast checking."
              link="https://palette.example.com"
            />
            <ProjectCard
              title="Budgetly"
              description="Simple budget tracker with CSV export and spending insights."
              link="https://budgetly.example.com"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16" aria-labelledby="contact-heading" role="region">
        <Suspense fallback={<div className="text-center py-10" role="status" aria-live="polite">Loading contact form...</div>}>
          <ContactSection showToast={showToast} debouncedSubmit={debouncedSubmit} />
        </Suspense>
      </section>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 toast bg-black text-white px-6 py-3 rounded-md shadow-lg flex items-center"
          role="alert"
          aria-live="assertive"
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 text-white opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
---