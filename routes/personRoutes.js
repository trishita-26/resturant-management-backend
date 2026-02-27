const express = require('express');
const router = express.Router();

const {
    getAll,
    getProfile,
    getByWork,
    updatePerson,
    deletePerson,
} = require('../controllers/personController');

const { authenticate } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { updatePersonSchema } = require('../validators/personValidator');

// All person routes require a valid JWT
router.use(authenticate);

// GET /api/persons — all authenticated users can view staff list
router.get('/', getAll);

// GET /api/persons/profile — own profile (MUST be before /:workType to avoid param conflict)
router.get('/profile', getProfile);

// GET /api/persons/:workType — filter by work type
router.get('/:workType', getByWork);

// PUT /api/persons/:id — manager only
router.put('/:id', roleCheck('manager'), validate(updatePersonSchema), updatePerson);

// DELETE /api/persons/:id — manager only
router.delete('/:id', roleCheck('manager'), deletePerson);

module.exports = router;
