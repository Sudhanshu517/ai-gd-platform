import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser, IUserDocument } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};



export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Login requested:", email, password);
  console.log("JWT_SECRET in login:", process.env.JWT_SECRET);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const userId: string = user._id.toString();

    // ✅ MAKE SURE `user._id` exists before using it
    const payload = {
      id: user._id.toString(), // .toString() is optional but helps sometimes
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET is undefined at runtime!");
      return res.status(500).json({ error: "JWT secret missing" });
    }

    // const token = jwt.sign(payload, secret, { expiresIn: '7d' });
   const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, {
  expiresIn: "7d",
});

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};