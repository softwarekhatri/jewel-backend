import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message: msg });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error: unknown) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, isEmailVerified: user.isEmailVerified },
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, isEmailVerified: user.isEmailVerified },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
      return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user.email, user.name, resetToken);
    res.json({ success: true, message: 'Password reset email sent.' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      return;
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
