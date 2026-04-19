import { describe, it, expect, vi } from 'vitest';
import { handler as contactHandler } from '../../api/contact';

// Mock Resend
const mockEmailsSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mockEmailsSend
    }
  }))
}));

// Mock imports
vi.mock('fs', () => ({}));
vi.mock('../src/emails/contact-notification.js', () => ({
  default: vi.fn(() => '<p>Notification</p>')
}));
vi.mock('../src/emails/contact-confirmation.js', () => ({
  default: vi.fn(() => '<p>Confirmation</p>')
}));

describe('Contact API Endpoint', () => {
  const createMockRequest = (overrides = {}) => ({
    method: 'POST',
    body: {},
    ...overrides
  });

  const createMockResponse = () => {
    const res = {
      statusCode: null,
      body: null,
      status: vi.fn(function (code) {
        this.statusCode = code;
        return this;
      }),
      json: vi.fn(function (data) {
        this.body = data;
        return this;
      })
    };
    return res;
  };

  beforeEach(() => {
    mockEmailsSend.mockClear();
    process.env.RESEND_API_KEY = 're_test';
    process.env.OWNER_EMAIL = 'owner@test.com';
  });

  it('rejects non-POST requests', async () => {
    const req = createMockRequest({ method: 'GET' });
    const res = createMockResponse();

    await contactHandler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ message: 'Method not allowed' });
  });

  it('blocks submissions with honeypot field', async () => {
    const req = createMockRequest({
      body: { _honey: 'spam' }
    });
    const res = createMockResponse();

    await contactHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    const req = createMockRequest({
      body: { name: '', email: '', message: '' }
    });
    const res = createMockResponse();

    await contactHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'All fields are required.' });
  });

  it('validates email format', async () => {
    const req = createMockRequest({
      body: { name: 'John', email: 'invalid-email', message: 'Hello' }
    });
    const res = createMockResponse();

    await contactHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid email format.' });
  });

  it('sends emails successfully with valid data', async () => {
    mockEmailsSend.mockResolvedValue({ data: {} });

    const req = createMockRequest({
      body: { 
        name: 'John Doe', 
        email: 'john@example.com', 
        message: 'Hello!' 
      }
    });
    const res = createMockResponse();

    await contactHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mockEmailsSend).toHaveBeenCalledTimes(2);
  });
});