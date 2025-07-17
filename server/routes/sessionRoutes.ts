import express from 'express';
import { createSession, getSessionById } from '../controllers/sessionController';
import { verifyToken } from '../middlewares/authMiddleware';
import { Router } from "express";
import { generateReportController } from "../controllers/sessionController";

const router = express.Router();

// This route is protected by token — only logged in users can access
router.post('/create', verifyToken, createSession);

// Let's now handle joining a session by its ID
router.get('/:id', verifyToken, getSessionById);

router.post("/generate-report", verifyToken, generateReportController);

export default router;
