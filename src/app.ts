import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';
import sweetsRoutes from './routes/sweetsRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

export default app;