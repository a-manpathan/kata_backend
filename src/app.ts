import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

export default app;