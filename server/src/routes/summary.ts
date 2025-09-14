import express from 'express';
import { ProfessionalSummaryService } from '../services/ProfessionalSummaryService';
import { handleError } from '../lib/errors';

const router = express.Router();
const summaryService = new ProfessionalSummaryService();

// GET /api/summary - Get professional summary
router.get('/', async (req, res) => {
  try {
    const result = await summaryService.getProfessionalSummary();
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// PUT /api/summary - Update professional summary
router.put('/', async (req, res) => {
  try {
    const result = await summaryService.updateProfessionalSummary(req.body);
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// POST /api/summary - Create professional summary (for initial setup)
router.post('/', async (req, res) => {
  try {
    const result = await summaryService.createProfessionalSummary(req.body);
    res.status(201).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

// DELETE /api/summary - Delete professional summary
router.delete('/', async (req, res) => {
  try {
    const result = await summaryService.deleteProfessionalSummary();
    res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

export default router;