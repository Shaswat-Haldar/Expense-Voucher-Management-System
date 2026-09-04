import { describe, it, expect, beforeEach, vi } from 'vitest';
import { auth } from './auth.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      cookies: {}
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
  });

  it('should return 401 if no token is provided', () => {
    auth(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false
    }));
  });

  it('should call next if token is valid', () => {
    mockReq.cookies.token = 'valid_token';
    const decodedPayload = { id: 1, role: 'employee' };
    jwt.verify.mockReturnValue(decodedPayload);

    auth(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', env.JWT_SECRET);
    expect(mockReq.user).toEqual(decodedPayload);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockReq.cookies.token = 'invalid_token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    auth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
