const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');
const mailer = require('../utils/mailer');
const authService = require('../services/authService');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User');  
jest.mock('../models/Blacklist');
jest.mock('../utils/mailer');

describe('Auth Service', () => {
  
  describe('login', () => {

    test('should return a JWT token if credentials are correct', async () => {
      const mockUser = { _id: 'testUserId', email: 'test@example.com', password: 'hashedpassword', role: 'admin' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('testtoken');

      const result = await authService.login('test@example.com', 'password123');
      expect(result).toBe('testtoken');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith({ user: { id: mockUser._id, role: mockUser.role } }, process.env.JWT_SECRET, { expiresIn: '1000h' });
    });

    test('should throw an error if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.login('notfound@example.com', 'password123')).rejects.toThrow('User not found');
    });

    test('should throw an error if password does not match', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {

    test('should create a new user', async () => {
      const mockUser = { _id: 'testUserId', name: 'Test', email: 'test@example.com' };
      const newUser = { name: 'Test', email: 'test@example.com', password: 'password123', role: 'user' };

      User.prototype.save.mockResolvedValue(mockUser);

      const result = await authService.register(newUser);
      expect(result).toEqual(mockUser);
      expect(User.prototype.save).toHaveBeenCalled();
    });

  });

  describe('logout', () => {
    
    test('should add token to the blacklist', async () => {
      const token = 'testtoken';
      jwt.decode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
      Blacklist.create.mockResolvedValue();

      await authService.logout(token);
      expect(jwt.decode).toHaveBeenCalledWith(token);
      expect(Blacklist.create).toHaveBeenCalledWith({
        token: 'testtoken',
        expiresAt: expect.any(Date),
      });
    });
  });

  describe('requestPasswordReset', () => {
    test('should send a password reset email if user exists', async () => {
      const mockUser = { _id: 'testUserId', email: 'test@example.com' };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('resettoken');
      mailer.sendRessetPass.mockResolvedValue();

      await authService.requestPasswordReset('test@example.com');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      expect(mailer.sendRessetPass).toHaveBeenCalledWith('test@example.com', expect.any(String));
    });

    test('should throw an error if user does not exist', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(authService.requestPasswordReset('notfound@example.com')).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    test('should update the user password', async () => {
      const mockUser = { _id: 'testUserId', password: 'oldpassword' };
      const newPassword = 'newpassword123';
      const hashedPassword = 'hashednewpassword';

      jwt.verify.mockReturnValue({ id: 'testUserId' });
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      await authService.resetPassword('resettoken', newPassword);

      expect(jwt.verify).toHaveBeenCalledWith('resettoken', process.env.JWT_SECRET);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 'salt');
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('testUserId', { password: hashedPassword });
    });

    test('should throw an error if user not found', async () => {
      jwt.verify.mockReturnValue({ id: 'testUserId' });
      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(authService.resetPassword('resettoken', 'newpassword123')).rejects.toThrow('User not found');
    });
  });
});
