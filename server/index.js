

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// WIP: Auth route and audio room integration coming soon
app.get('/api/status', (req, res) => {
  res.json({ message: "Server is live 🚀" });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
