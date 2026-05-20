import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';

type UserRole = 'admin' | 'sales';

const makeToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

const getValidationErrors = (email: string, password: string): string[] => {
  const errors: string[] = [];
  if (!email || !/\S+@\S+\.\S+/.test(email)) errors.push('Valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    };

    if (!name || name.length < 2) {
      res.status(400).json({ success: false, error: 'Name must be at least 2 characters' });
      return;
    }

    const errs = getValidationErrors(email, password);
    if (errs.length > 0) {
      res.status(400).json({ success: false, error: errs[0] });
      return;
    }

    const validRoles: UserRole[] = ['admin', 'sales'];
    const userRole: UserRole = role && validRoles.includes(role) ? role : 'sales';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, error: 'Email already registered' });
      return;
    }

    const user: IUserDocument = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    const token = makeToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const errs = getValidationErrors(email, password);
    if (errs.length > 0) {
      res.status(400).json({ success: false, error: errs[0] });
      return;
    }

    const user: IUserDocument | null = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const token = makeToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};