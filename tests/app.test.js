import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

// Mock PostHog
global.posthog = { capture: vi.fn() };

// Mock fetch globally
global.fetch = vi.fn();

describe('Portfolio Pro App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, messageId: 'test-123' })
    });
  });

  it('renders hero section with correct content', () => {
    render(<App />);
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/Full-Stack Developer & UI Designer/)).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders about section with warm tone paragraph', async () => {
    render(<App />);
    
    // Wait for lazy loading
    await waitFor(() => {
      expect(screen.getByText(/crafting clean, performant web experiences/)).toBeInTheDocument();
    });
  });

  it('displays 3 project cards in responsive grid', async () => {
    render(<App />);
    
    await waitFor(() => {
      const projectCards = screen.getAllByRole('article');
      expect(projectCards).toHaveLength(3);
      
      // Check card content
      expect(screen.getByText('TaskFlow')).toBeInTheDocument();
      expect(screen.getByText('Palette')).toBeInTheDocument();
      expect(screen.getByText('Budgetly')).toBeInTheDocument();
    });
  });

  it('submits contact form successfully and shows toast', async () => {
    render(<App />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email *'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Message *'), 'Hello from test');
    
    // Submit
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await userEvent.click(submitButton);
    
    // Check API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.any(Object));
    });
    
    // Check success toast
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
    
    // Check PostHog event
    expect(global.posthog.capture).toHaveBeenCalledWith('form_submitted');
    expect(global.posthog.capture).toHaveBeenCalledWith('form_success');
  });

  it('shows validation errors for empty required fields', async () => {
    render(<App />);
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Message is required.')).toBeInTheDocument();
    });
  });

  it('applies responsive grid classes correctly', async () => {
    render(<App />);
    
    await waitFor(() => {
      const grid = screen.getByRole('list');
      expect(grid).toHaveClass('grid-cols-1');
      // Note: We can't test media queries directly without jsdom setup
    });
  });

  it('hides honeypot field from screen readers', async () => {
    render(<App />);
    
    await waitFor(() => {
      const honeypot = screen.getByLabelText('Leave this field blank');
      expect(honeypot).toHaveAttribute('aria-hidden', 'true');
      expect(honeypot).toHaveStyle('position: absolute');
    });
  });

  it('clears form after successful submission', async () => {
    render(<App />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email *'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Message *'), 'Hello from test');
    
    // Submit
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await userEvent.click(submitButton);
    
    // Wait for success
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
    
    // Check form is cleared
    expect(screen.getByLabelText('Name *')).toHaveValue('');
    expect(screen.getByLabelText('Email *')).toHaveValue('');
    expect(screen.getByLabelText('Message *')).toHaveValue('');
  });

  it('displays error toast for failed submission', async () => {
    // Mock failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to send email' })
    });
    
    render(<App />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email *'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Message *'), 'Hello from test');
    
    // Submit
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await userEvent.click(submitButton);
    
    // Check error toast
    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });

  it('has proper ARIA labels and roles', async () => {
    render(<App />);
    
    // Check semantic roles
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Featured Projects' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Get In Touch' })).toBeInTheDocument();
    
    // Check project card ARIA
    await waitFor(() => {
      const projectLinks = screen.getAllByRole('link', { name: /View project:/ });
      expect(projectLinks).toHaveLength(3);
    });
  });
});