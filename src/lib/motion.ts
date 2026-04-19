import { animate, inView } from 'framer-motion';

// Initialize animations on scroll for project cards and form
export function initMotion() {
  const animateOnView = (el: Element) => {
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, ease: 'easeOut' });
    });
  };

  document.querySelectorAll('.animate-slide-up').forEach(animateOnView);
}
// PERF: Lazy-loaded animation logic to reduce initial bundle size