import { describe, it, expect, beforeEach } from 'vitest';
import { handler } from '../../api/contact';
import { createEvent, createResponse } from './test-helpers';

// Mock Resend
const mockEmailsSend = vi.fn();
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockEmailsSend,
      },
    })),
  };
});

describe('Contact API Endpoint', () => {
  beforeEach(() => {
    mockEmailsSend.mockClear();
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.OWNER_EMAIL = 'owner@test.com';
  });

  it('rejects non-POST requests with 405', async () => {
    const event = createEvent({ method: 'GET' });
    const response = createResponse();

    await handler(event, response);

    expect(response._getStatusCode()).toBe(405);
    expect(response._getJSONBody()).toEqual({ message: 'Method not allowed' });
  });

  it('blocks submissions with honeypot field filled', async () => {
    const event = createEvent({
      method: 'POST',
      body: { 'bot-field': 'spam', name: 'Test', email: 'test@test.com', message: 'Hi' },
    });
    const response = createResponse();

    await handler(event, response);

    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONBody()).toEqual({ success: true });
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it('validates required fields and returns 400 if missing', async () => {
    const event = createEvent({ method: 'POST', body: {} });
    const response = createResponse();

    await handler(event, response);

    expect(response._getStatusCode()).toBe(400);
    expect(response._getJSONBody()).toEqual({ message: 'All fields are required.' });
  });

  it('validates email format', async () => {
    const event = createEvent({
      method: 'POST',
      body: { name: 'Test', email: 'invalid', message: 'Hi' },
    });
    const response = createResponse();

    await handler(event, response);

    expect(response._getStatusCode()).toBe(400);
    expect(response._getJSONBody()).toEqual({ message: 'Please provide a valid email address.' });
  });

  it('sends emails successfully with valid data', async () => {
    mockEmailsSend.mockResolvedValueOnce({ id: '123' });
    mockEmailsSend.mockResolvedValueOnce({ id: '456' });

    const event = createEvent({
      method: 'POST',
      body: { name: 'Test', email: 'test@test.com', message: 'Hi', 'bot-field': '' },
    });
    const response = createResponse();

    await handler(event, response);

    expect(response._getStatusCode()).toBe(200);
    expect(response._getJSONBody()).toEqual({ success: true });
    expect(mockEmailsSend).toHaveBeenCalledTimes(2);
    expect(mockEmailsSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@test.com',
        subject: 'New Contact Form Submission from Test',
      })
    );
    expect(mockEmailsSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@test.com',
        subject: 'Thank you for reaching out!',
      })
    );
  });

  it('handles email sending errors gracefully', async () => {
    mockEmailsSend.mockRejectedValueOnce(new Error('SMTP error'));

    const event = createEvent({
      method: 'POST',
      body: { name: 'Test', email: 'test@test.com', message: 'Hi', 'bot-field': '' },
    });
    const response = createResponse();

    await handler(event, response);

    expect(response._getStatusCode()).toBe(500);
    expect(response._getJSONBody()).toEqual({ message: 'Failed to send message. Please try again later.' });
  });
});

// test-helpers.js
export const createEvent = ({ method = 'GET', body = null } = {}) => ({
  method,
  body,
  headers: {},
  query: {},
  url: '/api/contact',
});

export const createResponse = () => {
  const response = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    _getStatusCode() {
      return this.statusCode;
    },
    _getJSONBody() {
      return this.body;
    },
  };
  return response;
};