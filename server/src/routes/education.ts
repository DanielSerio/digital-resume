import express from 'express';
import { EducationService } from '../services/EducationService';
import { handleError } from '../lib/errors';

const router = express.Router();
const educationService = new EducationService();

// GET /api/education - Get all education records
router.get('/', async (req, res) => {
  try {
    const result = await educationService.getEducation();
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// GET /api/education/:id - Get education record by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid education ID',
        message: 'Education ID must be a number'
      });
    }
    
    const result = await educationService.getEducationById(id);
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// POST /api/education - Create new education record
router.post('/', async (req, res) => {
  try {
    const result = await educationService.createEducation(req.body);
    res.status(201).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// PUT /api/education/:id - Update education record
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid education ID',
        message: 'Education ID must be a number'
      });
    }
    
    const result = await educationService.updateEducation(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// DELETE /api/education/:id - Delete education record
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid education ID',
        message: 'Education ID must be a number'
      });
    }
    
    const result = await educationService.deleteEducation(id);
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

export default router;