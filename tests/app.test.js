import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { vi } from 'vitest';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: () => callback([{ isIntersecting: true }]),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock fetch
global.fetch = vi.fn();

describe('Portfolio Pro App', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders hero section with name and role', () => {
    render(<App />);
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer & Designer')).toBeInTheDocument();
  });

  test('renders about section with descriptive paragraph', () => {
    render(<App />);
    const aboutText = screen.getByText(/I’m a passionate developer who crafts clean, accessible, and performant web experiences/i);
    expect(aboutText).toBeInTheDocument();
  });

  test('renders three project cards in responsive grid', () => {
    render(<App />);
    const projectTitles = [
      screen.getByText('TaskFlow'),
      screen.getByText('PaletteCraft'),
      screen.getByText('BudgetBloom')
    ];
    projectTitles.forEach(title => expect(title).toBeInTheDocument());
  });

  test('contact form shows validation errors for empty submission', async () => {
    render(<App />);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Message is required.')).toBeInTheDocument();
    });
  });

  test('contact form submits successfully with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hello there!' }
    });

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', expect.any(Object));
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
  });
});

## Summary
- Fixed 2 critical issues (API endpoint and honeypot field name mismatch)
- Ensured frontend and backend are now consistent
- Updated tests to reflect correct endpoint
- All imports and references are now valid and consistent