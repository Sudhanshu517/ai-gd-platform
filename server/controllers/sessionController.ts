import { Request, Response } from 'express';
import Session from '../models/session';
import { generateAIReport } from '../services/aiService';

// ✅ Create a new GD session
export const createSession = async (req: Request, res: Response) => {
  try {
    const { topic, aiCount, scheduledAt } = req.body;

    // Log who created the session (user id from JWT)
    const createdBy = (req as any).user?.id;

    // Validate input
    if (!topic || !aiCount || !scheduledAt) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save session in DB
    const newSession = await Session.create({
      topic,
      aiCount,
      scheduledAt,
      createdBy
    });

    console.log('Session created:', newSession._id);
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Create Session Error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// ✅ Get details of a session by ID
export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get Session Error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
};

// ✅ Generate AI-powered report for a discussion
export const generateReportController = async (req: Request, res: Response) => {
  try {
    const { topic, messages } = req.body;

    // Validation: topic and messages are required
    if (!topic || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'Topic and messages are required' });
    }

    // Call AI service to generate report
    const report = await generateAIReport(topic, messages);

    res.json({ report });
  } catch (err) {
    console.error('AI Report Error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
