import express from 'express';
import cors from 'cors';
import contactRoutes from './routes/contact';
import summaryRoutes from './routes/summary';
import skillsRoutes from './routes/skills';
import educationRoutes from './routes/education';
import workExperienceRoutes from './routes/work-experiences';
import scopedResumeRoutes from './routes/scoped-resumes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/work-experiences', workExperienceRoutes);
app.use('/api/scoped-resumes', scopedResumeRoutes);

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
      api: '/api',
      contact: '/api/contact',
      summary: '/api/summary',
      skills: '/api/skills',
      education: '/api/education',
      workExperiences: '/api/work-experiences',
      scopedResumes: '/api/scoped-resumes'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 API info available at http://localhost:${PORT}/api`);
  console.log(`👤 Contact API available at http://localhost:${PORT}/api/contact`);
  console.log(`📄 Summary API available at http://localhost:${PORT}/api/summary`);
  console.log(`🛠️ Skills API available at http://localhost:${PORT}/api/skills`);
  console.log(`🎓 Education API available at http://localhost:${PORT}/api/education`);
  console.log(`💼 Work Experience API available at http://localhost:${PORT}/api/work-experiences`);
  console.log(`📋 Scoped Resume API available at http://localhost:${PORT}/api/scoped-resumes`);
});

export default app;