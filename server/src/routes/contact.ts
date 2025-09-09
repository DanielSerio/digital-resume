import express from 'express';
import { ContactService } from '../services/ContactService';
import { handleError } from '../lib/errors';

const router = express.Router();
const contactService = new ContactService();

// GET /api/contact - Get contact information
router.get('/', async (req, res) => {
  try {
    const result = await contactService.getContact();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/contact - Update contact information
router.put('/', async (req, res) => {
  try {
    const result = await contactService.updateContact(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/contact - Create contact information (for initial setup)
router.post('/', async (req, res) => {
  try {
    const result = await contactService.createContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/contact - Delete contact information
router.delete('/', async (req, res) => {
  try {
    const result = await contactService.deleteContact();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;