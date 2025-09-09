import express from 'express';
import { WorkExperienceService } from '../services/WorkExperienceService';
import { handleError } from '../lib/errors';

const router = express.Router();
const workExperienceService = new WorkExperienceService();

// ============ WORK EXPERIENCES ============

// GET /api/work-experiences - Get all work experiences with lines
router.get('/', async (req, res) => {
  try {
    const result = await workExperienceService.getWorkExperiences();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/work-experiences/:id - Get work experience by ID with lines
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid work experience ID',
        message: 'Work experience ID must be a number'
      });
    }
    
    const result = await workExperienceService.getWorkExperienceById(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/work-experiences - Create new work experience (without lines)
router.post('/', async (req, res) => {
  try {
    const result = await workExperienceService.createWorkExperience(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/work-experiences/with-lines - Create work experience with lines (atomic transaction)
router.post('/with-lines', async (req, res) => {
  try {
    const result = await workExperienceService.createWorkExperienceWithLines(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/work-experiences/:id - Update work experience
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid work experience ID',
        message: 'Work experience ID must be a number'
      });
    }
    
    const result = await workExperienceService.updateWorkExperience(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/work-experiences/:id - Delete work experience (with all lines, atomic transaction)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid work experience ID',
        message: 'Work experience ID must be a number'
      });
    }
    
    const result = await workExperienceService.deleteWorkExperience(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// ============ WORK EXPERIENCE LINES ============

// GET /api/work-experiences/:id/lines - Get all lines for a work experience
router.get('/:id/lines', async (req, res) => {
  try {
    const workExperienceId = parseInt(req.params.id);
    if (isNaN(workExperienceId)) {
      return res.status(400).json({
        error: 'Invalid work experience ID',
        message: 'Work experience ID must be a number'
      });
    }
    
    const result = await workExperienceService.getWorkExperienceLines(workExperienceId);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/work-experiences/lines - Create new work experience line
router.post('/lines', async (req, res) => {
  try {
    const result = await workExperienceService.createWorkExperienceLine(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/work-experiences/lines/:id - Update work experience line
router.put('/lines/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid work experience line ID',
        message: 'Work experience line ID must be a number'
      });
    }
    
    const result = await workExperienceService.updateWorkExperienceLine(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/work-experiences/lines/:id - Delete work experience line
router.delete('/lines/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid work experience line ID',
        message: 'Work experience line ID must be a number'
      });
    }
    
    const result = await workExperienceService.deleteWorkExperienceLine(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;