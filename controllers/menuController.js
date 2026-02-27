const MenuItem = require('../models/Menu');

const VALID_TASTE_TYPES = ['Sweet', 'Spicy', 'Sour'];

/**
 * POST /api/menu
 * Manager only — add a new menu item
 */
const createMenu = async (req, res, next) => {
    try {
        const menuItem = new MenuItem(req.body);
        const saved = await menuItem.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/menu
 * All authenticated users
 */
const getAllMenu = async (req, res, next) => {
    try {
        const items = await MenuItem.find().sort({ num_sales: -1 }); // most sold first
        res.json({ success: true, count: items.length, data: items });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/menu/:tasteType
 * Filter menu by taste
 */
const getByTaste = async (req, res, next) => {
    try {
        const { tasteType } = req.params;

        if (!VALID_TASTE_TYPES.includes(tasteType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid taste type. Must be one of: ${VALID_TASTE_TYPES.join(', ')}`,
            });
        }

        const items = await MenuItem.find({ taste: tasteType }).sort({ price: 1 }); // cheapest first
        res.json({ success: true, count: items.length, data: items });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/menu/:id
 * Manager only — update a menu item
 */
const updateMenu = async (req, res, next) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ success: false, error: 'Menu item not found.' });

        res.json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/menu/:id
 * Manager only — remove a menu item
 */
const deleteMenu = async (req, res, next) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, error: 'Menu item not found.' });

        res.json({ success: true, message: 'Menu item deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

module.exports = { createMenu, getAllMenu, getByTaste, updateMenu, deleteMenu };
