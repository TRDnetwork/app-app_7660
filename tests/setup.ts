import '@testing-library/jest-dom';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback: any) => ({
  observe: () => callback([{ isIntersecting: true }]),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

window.IntersectionObserver = mockIntersectionObserver;

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Extend expect with jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toHaveClass(expected: string): T;
    toHaveAttribute(attr: string, value?: string): T;
  }
}
---