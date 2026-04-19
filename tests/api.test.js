import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handler } from '../../api/contact';
import { Readable } from 'stream';

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'email_123' })
    }
  }))
}));

// Mock environment variables
beforeEach(() => {
  process.env.RESEND_API_KEY = 're_123456';
  process.env.OWNER_EMAIL = 'owner@example.com';
  process.env.SENDER_EMAIL = 'hello@yoursite.com';
});

// Helper to create Vercel request mock
const createRequest = (body: any) => {
  const requestBody = JSON.stringify(body);
  const req = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: Readable.from(requestBody),
    json: async () => body
  } as any;

  return req;
};

const createResponse = () => {
  const res: any = {
    statusCode: 0,
    body: '',
    status: vi.fn(function (this: any, code: number) {
      this.statusCode = code;
      return this;
    }),
    json: vi.fn(function (this: any, body: any) {
      this.body = body;
      return this;
    })
  };
  return res;
};

describe('Contact API Endpoint', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET' } as any;
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ message: 'Method not allowed' });
  });

  it('validates required fields', async () => {
    const req = createRequest({ name: '', email: '', message: '' });
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'All fields are required.' });
  });

  it('validates email format', async () => {
    const req = createRequest({ name: 'John', email: 'invalid-email', message: 'Hello' });
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid email format.' });
  });

  it('blocks bots via honeypot field', async () => {
    const req = createRequest({ name: 'John', email: 'john@example.com', message: 'Hello', _honey: 'bot' });
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    // Should not send emails
    expect(require('resend').Resend().emails.send).not.toHaveBeenCalled();
  });

  it('sends emails on valid submission', async () => {
    const req = createRequest({ name: 'John', email: 'john@example.com', message: 'Hello', _honey: '' });
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(require('resend').Resend().emails.send).toHaveBeenCalledTimes(2);
  });

  it('sanitizes user input to prevent XSS', async () => {
    const maliciousData = {
      name: '<script>alert("xss")</script>',
      email: 'user@site.com',
      message: '<img src=x onerror=alert(1)>',
      _honey: ''
    };
    const req = createRequest(maliciousData);
    const res = createResponse();

    await handler(req, res);

    const sendMock = require('resend').Resend().emails.send;
    expect(sendMock).toHaveBeenCalledTimes(2);

    const [ownerEmail, userEmail] = sendMock.mock.calls;

    // Check that script tags are escaped
    expect(ownerEmail[0].html).not.toContain('<script>');
    expect(ownerEmail[0].html).toContain('&lt;script&gt;');
    expect(userEmail[0].html).toContain('Thank you for reaching out');
  });

  it('handles email sending errors gracefully', async () => {
    // Mock error
    require('resend').Resend().emails.send.mockRejectedValueOnce(new Error('SMTP error'));

    const req = createRequest({ name: 'John', email: 'john@example.com', message: 'Hello', _honey: '' });
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to send message. Please try again later.' });
  });
});