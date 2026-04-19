import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { vi } from 'vitest';

// Mock Framer Motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
      svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>
    },
    useAnimation: () => ({
      start: vi.fn()
    })
  };
});

vi.mock('react-intersection-observer', () => ({
  useInView: () => [null, true]
}));

describe('Portfolio Pro App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders hero section with name, role, and introduction', () => {
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer & UI Designer')).toBeInTheDocument();
    expect(screen.getByText(/Crafting clean, accessible interfaces/i)).toBeInTheDocument();
  });

  test('renders about section with descriptive paragraph', () => {
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText(/I'm a frontend developer with over 5 years/i)).toBeInTheDocument();
  });

  test('renders three project cards in responsive grid', () => {
    const projects = screen.getAllByRole('article');
    expect(projects).toHaveLength(3);

    expect(screen.getByText('EcoShop')).toBeInTheDocument();
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('HealthTrack')).toBeInTheDocument();
  });

  test('contact form shows validation errors for empty submission', async () => {
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  test('contact form submits successfully with valid data', async () => {
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello!' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    }, { timeout: 4500 });
  });

  test('honeypot field prevents form submission when filled', () => {
    const honeypotLabel = screen.getByText('Don’t fill this out');
    const honeypotInput = honeypotLabel.nextElementSibling as HTMLInputElement;
    
    fireEvent.change(honeypotInput, { target: { value: 'bot' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    // Should not show success toast
    expect(screen.queryByText('Message sent successfully!')).not.toBeInTheDocument();
  });

  test('success toast auto-dismisses after 4 seconds', async () => {
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });

    // Wait for auto-dismiss
    await waitFor(() => {
      expect(screen.queryByText('Message sent successfully!')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('skip to content link is present and accessible', () => {
    const skipLink = screen.getByText('Skip to Content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveClass('sr-only');
  });
});