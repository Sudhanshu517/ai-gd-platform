import dotenv from 'dotenv';
dotenv.config();
console.log("Env file loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");



import express from 'express';
// import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sessionRoutes from './routes/sessionRoutes';

// dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/session', sessionRoutes);
app.use('/api/auth', authRoutes); // if you want auth too

app.get('/', (_, res) => {
  res.send('API is live 🚀');
});

// Connect to MongoDB FIRST, then start server
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
