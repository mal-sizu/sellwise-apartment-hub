import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import errorMiddleware from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

// Create Express application
const app: Express = express();

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;