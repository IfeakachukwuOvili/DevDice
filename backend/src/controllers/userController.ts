/**
 * NOTE:
 * Issue: Returning `res.json(...)` or `res.status(...).json(...)` from controller functions caused a TypeScript type error,
 *        because Express expects route handlers to return `void` or `Promise<void>`, not a Response object.
 * Fix:   After sending a response, we use `return;` (without returning the response object) to stop further execution.
 *        This prevents "headers already sent" errors and satisfies Express/TypeScript type requirements.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Sign Up Controller
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return 
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

// Delete User Controller
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return
    }

    // If you have related data, delete it here (e.g., UserChallenge, etc.)

    await prisma.user.delete({ where: { email } });

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
    return
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting account', error: error.message });
    return
  }
};

// Update User Controller
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, currentPassword, newPassword } = req.body as { name?: string; currentPassword: string; newPassword?: string };
    const { email } = req.params;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
    res.status(404).json({ message: 'User not found' });
    return
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: name || user.name,
        password: newPassword ? await bcrypt.hash(newPassword, 10) : user.password
      }
    });

    res.json({ user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password Controller
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body as { email: string; newPassword: string };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
    res.status(404).json({ message: 'User not found' });
    return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};