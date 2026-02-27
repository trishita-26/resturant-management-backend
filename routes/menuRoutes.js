const express = require('express');
const router = express.Router();

const {
    createMenu,
    getAllMenu,
    getByTaste,
    updateMenu,
    deleteMenu,
} = require('../controllers/menuController');

const { authenticate } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { createMenuSchema, updateMenuSchema } = require('../validators/menuValidator');

// All menu routes require a valid JWT
router.use(authenticate);

// GET /api/menu — all authenticated users
router.get('/', getAllMenu);

// GET /api/menu/:tasteType — filter by taste (MUST be before POST to avoid conflict; GET/POST use same /)
router.get('/:tasteType', getByTaste);

// POST /api/menu — manager only
router.post('/', roleCheck('manager'), validate(createMenuSchema), createMenu);

// PUT /api/menu/:id — manager only
router.put('/:id', roleCheck('manager'), validate(updateMenuSchema), updateMenu);

// DELETE /api/menu/:id — manager only
router.delete('/:id', roleCheck('manager'), deleteMenu);

module.exports = router;
