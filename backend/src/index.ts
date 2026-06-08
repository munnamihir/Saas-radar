import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════╗
║       SaaS Radar API             ║
║  Running on http://localhost:${PORT}  ║
║  Mode: ${process.env.DEMO_MODE === 'true' ? 'DEMO  ' : 'LIVE  '}                    ║
╚══════════════════════════════════╝
  `);
});

export default app;
