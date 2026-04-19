import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler as contactHandler } from '../api/contact';

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn()
    }
  }))
}));

// Mock fetch for Redis
global.fetch = vi.fn();

describe('Contact API Endpoint', () => {
  const createMockRequest = (overrides = {}) => ({
    method: 'POST',
    headers: { 'x-forwarded-for': '192.168.1.1' },
    body: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello from test',
      'bot-field': ''
    },
    ...overrides
  });

  const createMockResponse = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.OWNER_EMAIL = 'owner@test.com';
    
    // Mock successful email send
    const mockSend = vi.fn().mockResolvedValue({
      data: { id: 'test-123' },
      error: null
    });
    
    // Set up Resend mock
    const Resend = (await import('resend')).Resend;
    Resend.mockImplementation(() => ({
      emails: { send: mockSend }
    }));
  });

  it('returns 405 for non-POST requests', async () => {
    const req = createMockRequest({ method: 'GET' });
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('validates required fields', async () => {
    const req = createMockRequest({ body: { name: '', email: '', message: '' } });
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
  });

  it('validates email format', async () => {
    const req = createMockRequest({ body: { name: 'John', email: 'invalid-email', message: 'Hello' } });
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
  });

  it('handles honeypot field correctly', async () => {
    const req = createMockRequest({ body: { 'bot-field': 'spam' } });
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      success: true, 
      message: 'Submission ignored (bot detected)' 
    });
  });

  it('applies rate limiting with Upstash Redis', async () => {
    // Setup Redis env
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    
    // Mock Redis response for count > 5
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 6 })
    });
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Too many requests. Please try again later.' 
    });
  });

  it('sends emails successfully with sanitized inputs', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    // Check Resend was called twice
    const Resend = (await import('resend')).Resend;
    const resendInstance = Resend.mock.instances[0];
    
    expect(resendInstance.emails.send).toHaveBeenCalledTimes(2);
    
    // Check owner email
    expect(resendInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@test.com',
        subject: expect.stringContaining('New Contact Form Submission from John Doe')
      })
    );
    
    // Check user confirmation
    expect(resendInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com',
        subject: 'Thank you for your message!'
      })
    );
  });

  it('returns success response with messageId', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      success: true, 
      messageId: 'test-123' 
    });
  });

  it('handles Resend API errors gracefully', async () => {
    // Mock Resend error
    const mockSend = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'API error' }
    });
    
    const Resend = (await import('resend')).Resend;
    Resend.mockImplementation(() => ({
      emails: { send: mockSend }
    }));
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to send email' });
  });

  it('sanitizes user inputs to prevent XSS', async () => {
    const maliciousBody = {
      name: '<script>alert("xss")</script>John',
      email: 'john@example.com',
      message: '<img src=x onerror=alert(1)>Malicious message',
      'bot-field': ''
    };
    
    const req = createMockRequest({ body: maliciousBody });
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    // Check that sanitized inputs were used
    const Resend = (await import('resend')).Resend;
    const resendInstance = Resend.mock.instances[0];
    
    const ownerCall = resendInstance.emails.send.mock.calls[0][0];
    expect(ownerCall.subject).not.toContain('<script>');
    expect(ownerCall.html).not.toContain('alert');
    
    const userCall = resendInstance.emails.send.mock.calls[1][0];
    expect(userCall.html).not.toContain('onerror');
  });

  it('fails open when Redis is unreachable', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
    
    // Mock Redis failure
    global.fetch.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    // Should still process email despite Redis failure
    expect(consoleSpy).toHaveBeenCalledWith(
      'Rate limiting failed (fail-open):', 
      'Network error'
    );
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, messageId: 'test-123' });
  });

  it('validates input length limits', async () => {
    const longBody = {
      name: 'a'.repeat(101),
      email: 'a'.repeat(255) + '@example.com',
      message: 'a'.repeat(2001),
      'bot-field': ''
    };
    
    const req = createMockRequest({ body: longBody });
    const res = createMockResponse();
    
    await contactHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Input too long' });
  });
});