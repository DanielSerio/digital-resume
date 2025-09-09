import express from 'express';
import { ScopedResumeService } from '../services/ScopedResumeService';
import { handleError } from '../lib/errors';

const router = express.Router();
const scopedResumeService = new ScopedResumeService();

// ============ SCOPED RESUMES ============

// GET /api/scoped-resumes - Get all scoped resumes
router.get('/', async (req, res) => {
  try {
    const result = await scopedResumeService.getScopedResumes();
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/scoped-resumes/:id - Get scoped resume by ID with all content
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    const result = await scopedResumeService.getScopedResumeById(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/scoped-resumes - Create new scoped resume (empty)
router.post('/', async (req, res) => {
  try {
    const result = await scopedResumeService.createScopedResume(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/scoped-resumes/with-setup - Create scoped resume with initial content
router.post('/with-setup', async (req, res) => {
  try {
    const result = await scopedResumeService.createScopedResumeWithSetup(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/scoped-resumes/:id - Update scoped resume name
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    const result = await scopedResumeService.updateScopedResume(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// POST /api/scoped-resumes/:id/duplicate - Duplicate scoped resume
router.post('/:id/duplicate', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
        message: 'New name must be provided for duplication'
      });
    }
    
    const result = await scopedResumeService.duplicateScopedResume(id, name);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/scoped-resumes/:id - Delete scoped resume
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    const result = await scopedResumeService.deleteScopedResume(id);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// ============ SCOPED RESUME CONTENT (NESTED ROUTES) ============

// GET /api/scoped-resumes/:id/summary - Get scoped professional summary
// PUT /api/scoped-resumes/:id/summary - Update scoped professional summary
router.route('/:id/summary')
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid scoped resume ID',
          message: 'Scoped resume ID must be a number'
        });
      }
      
      const result = await scopedResumeService.getScopedResumeById(id);
      if (result.data) {
        const summary = result.data.scopedProfessionalSummaries[0] || null;
        res.status(200).json({
          data: summary,
          message: summary ? 'Scoped professional summary retrieved successfully' : 'No scoped professional summary found'
        });
      } else {
        res.status(404).json({
          error: 'Scoped resume not found',
          message: 'The specified scoped resume does not exist'
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  })
  .put(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid scoped resume ID',
          message: 'Scoped resume ID must be a number'
        });
      }
      
      const result = await scopedResumeService.updateScopedProfessionalSummary(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      handleError(error, res);
    }
  });

// GET /api/scoped-resumes/:id/skills - Get scoped skills
// POST /api/scoped-resumes/:id/skills - Add skill to scoped resume
router.route('/:id/skills')
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid scoped resume ID',
          message: 'Scoped resume ID must be a number'
        });
      }
      
      const result = await scopedResumeService.getScopedResumeById(id);
      if (result.data) {
        res.status(200).json({
          data: result.data.scopedSkills,
          message: 'Scoped skills retrieved successfully'
        });
      } else {
        res.status(404).json({
          error: 'Scoped resume not found',
          message: 'The specified scoped resume does not exist'
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  })
  .post(async (req, res) => {
    try {
      const scopedResumeId = parseInt(req.params.id);
      if (isNaN(scopedResumeId)) {
        return res.status(400).json({
          error: 'Invalid scoped resume ID',
          message: 'Scoped resume ID must be a number'
        });
      }
      
      const result = await scopedResumeService.addScopedSkill({
        scopedResumeId,
        ...req.body
      });
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  });

// DELETE /api/scoped-resumes/:id/skills/:skillId - Remove skill from scoped resume
router.delete('/:id/skills/:skillId', async (req, res) => {
  try {
    const scopedResumeId = parseInt(req.params.id);
    const technicalSkillId = parseInt(req.params.skillId);
    
    if (isNaN(scopedResumeId)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    if (isNaN(technicalSkillId)) {
      return res.status(400).json({
        error: 'Invalid skill ID',
        message: 'Skill ID must be a number'
      });
    }
    
    const result = await scopedResumeService.removeScopedSkill(scopedResumeId, technicalSkillId);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/scoped-resumes/:id/work-experiences - Get scoped work experiences
// POST /api/scoped-resumes/:id/work-experiences - Add work experience to scoped resume
router.route('/:id/work-experiences')
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid scoped resume ID',
          message: 'Scoped resume ID must be a number'
        });
      }
      
      const result = await scopedResumeService.getScopedResumeById(id);
      if (result.data) {
        res.status(200).json({
          data: result.data.scopedWorkExperiences,
          message: 'Scoped work experiences retrieved successfully'
        });
      } else {
        res.status(404).json({
          error: 'Scoped resume not found',
          message: 'The specified scoped resume does not exist'
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  })
  .post(async (req, res) => {
    try {
      const scopedResumeId = parseInt(req.params.id);
      if (isNaN(scopedResumeId)) {
        return res.status(400).json({
          error: 'Invalid scoped resume ID',
          message: 'Scoped resume ID must be a number'
        });
      }
      
      const result = await scopedResumeService.addScopedWorkExperience({
        scopedResumeId,
        ...req.body
      });
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  });

// DELETE /api/scoped-resumes/:id/work-experiences/:workExpId - Remove work experience from scoped resume
router.delete('/:id/work-experiences/:workExpId', async (req, res) => {
  try {
    const scopedResumeId = parseInt(req.params.id);
    const workExperienceId = parseInt(req.params.workExpId);
    
    if (isNaN(scopedResumeId)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    if (isNaN(workExperienceId)) {
      return res.status(400).json({
        error: 'Invalid work experience ID',
        message: 'Work experience ID must be a number'
      });
    }
    
    const result = await scopedResumeService.removeScopedWorkExperience(scopedResumeId, workExperienceId);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT /api/scoped-resumes/:id/work-experience-lines/:lineId - Update scoped work experience line (copy-on-write)
router.put('/:id/work-experience-lines/:lineId', async (req, res) => {
  try {
    const scopedResumeId = parseInt(req.params.id);
    const workExperienceLineId = parseInt(req.params.lineId);
    
    if (isNaN(scopedResumeId)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    if (isNaN(workExperienceLineId)) {
      return res.status(400).json({
        error: 'Invalid work experience line ID',
        message: 'Work experience line ID must be a number'
      });
    }
    
    const result = await scopedResumeService.updateScopedWorkExperienceLine({
      scopedResumeId,
      workExperienceLineId,
      ...req.body
    });
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/scoped-resumes/:id/work-experience-lines/:lineId - Remove scoped work experience line customization
router.delete('/:id/work-experience-lines/:lineId', async (req, res) => {
  try {
    const scopedResumeId = parseInt(req.params.id);
    const workExperienceLineId = parseInt(req.params.lineId);
    
    if (isNaN(scopedResumeId)) {
      return res.status(400).json({
        error: 'Invalid scoped resume ID',
        message: 'Scoped resume ID must be a number'
      });
    }
    
    if (isNaN(workExperienceLineId)) {
      return res.status(400).json({
        error: 'Invalid work experience line ID',
        message: 'Work experience line ID must be a number'
      });
    }
    
    const result = await scopedResumeService.removeScopedWorkExperienceLine(scopedResumeId, workExperienceLineId);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;