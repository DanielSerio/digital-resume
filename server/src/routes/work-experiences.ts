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
    console.info(result);
    res.status(200).json(result.data);
    return;
  } catch (error) {
    return handleError(error, res);
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
    res.status(200).json(result.data);
    return;
  } catch (error) {
    return handleError(error, res);
  }
});

// POST /api/work-experiences - Create work experience with lines (atomic transaction)
router.post('/', async (req, res) => {
  try {
    const result = await workExperienceService.createWorkExperience(req.body);
    res.status(201).json(result.data);
    return;
  } catch (error) {
    return handleError(error, res);
  }
});

// PUT /api/work-experiences/:id - Update work experience with lines
router.put('/:id', async (req, res) => {
  try {
    // Debug the request
    console.log('=== PUT /api/work-experiences/:id ===');
    console.log('Request ID:', req.params.id);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Lines in body:', req.body.lines ? req.body.lines.length : 'NO LINES');
    if (req.body.lines) {
      console.log('Lines data:', req.body.lines.map((line: any, i: number) => ({
        index: i,
        sortOrder: line.sortOrder,
        text: line.lineText?.substring(0, 30) + '...'
      })));
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid work experience ID',
        message: 'Work experience ID must be a number'
      });
    }

    const result = await workExperienceService.updateWorkExperience(id, req.body);
    console.log('=== UPDATE COMPLETED ===');

    res.status(200).json(result.data);
    return;
  } catch (error) {
    console.error('=== ERROR IN PUT /api/work-experiences/:id ===', error);
    return handleError(error, res);
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
    res.status(200).json(result.data);

    return;
  } catch (error) {
    return handleError(error, res);
  }
});

export default router;