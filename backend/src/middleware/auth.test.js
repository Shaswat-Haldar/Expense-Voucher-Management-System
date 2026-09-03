import { auth } from './auth.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    process.env.JWT_SECRET = 'test_secret';
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

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
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
