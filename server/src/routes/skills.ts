import express from 'express';
import { SkillService } from '../services/SkillService';
import { handleError } from '../lib/errors';

const router = express.Router();
const skillService = new SkillService();

// ============ SKILL CATEGORIES ============

// GET /api/skills/categories - Get all skill categories
router.get('/categories', async (req, res) => {
  try {
    const result = await skillService.getSkillCategories();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/skills/categories/:id - Get skill category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a number'
      });
    }
    
    const result = await skillService.getSkillCategoryById(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/skills/categories - Create new skill category
router.post('/categories', async (req, res) => {
  try {
    const result = await skillService.createSkillCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/skills/categories/:id - Update skill category
router.put('/categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a number'
      });
    }
    
    const result = await skillService.updateSkillCategory(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/skills/categories/:id - Delete skill category
router.delete('/categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a number'
      });
    }
    
    const result = await skillService.deleteSkillCategory(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// ============ SKILL SUBCATEGORIES ============

// GET /api/skills/subcategories - Get all skill subcategories
router.get('/subcategories', async (req, res) => {
  try {
    const result = await skillService.getSkillSubcategories();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/skills/subcategories/:id - Get skill subcategory by ID
router.get('/subcategories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid subcategory ID',
        message: 'Subcategory ID must be a number'
      });
    }
    
    const result = await skillService.getSkillSubcategoryById(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/skills/subcategories - Create new skill subcategory
router.post('/subcategories', async (req, res) => {
  try {
    const result = await skillService.createSkillSubcategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/skills/subcategories/:id - Update skill subcategory
router.put('/subcategories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid subcategory ID',
        message: 'Subcategory ID must be a number'
      });
    }
    
    const result = await skillService.updateSkillSubcategory(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/skills/subcategories/:id - Delete skill subcategory
router.delete('/subcategories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid subcategory ID',
        message: 'Subcategory ID must be a number'
      });
    }
    
    const result = await skillService.deleteSkillSubcategory(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// ============ TECHNICAL SKILLS ============

// GET /api/skills - Get all technical skills
router.get('/', async (req, res) => {
  try {
    const result = await skillService.getTechnicalSkills();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/skills/:id - Get technical skill by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid skill ID',
        message: 'Skill ID must be a number'
      });
    }
    
    const result = await skillService.getTechnicalSkillById(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/skills - Create new technical skill
router.post('/', async (req, res) => {
  try {
    const result = await skillService.createTechnicalSkill(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/skills/:id - Update technical skill
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid skill ID',
        message: 'Skill ID must be a number'
      });
    }
    
    const result = await skillService.updateTechnicalSkill(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/skills/:id - Delete technical skill
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid skill ID',
        message: 'Skill ID must be a number'
      });
    }
    
    const result = await skillService.deleteTechnicalSkill(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;