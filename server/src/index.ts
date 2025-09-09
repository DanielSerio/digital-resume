import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Digital Resume API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Digital Resume API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 API info available at http://localhost:${PORT}/api`);
});

export default app;