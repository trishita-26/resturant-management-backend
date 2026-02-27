const Person = require('../models/Person');

const VALID_WORK_TYPES = ['chef', 'waiter', 'manager'];

/**
 * GET /api/persons
 * All authenticated users
 */
const getAll = async (req, res, next) => {
    try {
        const persons = await Person.find().select('-password');
        res.json({ success: true, count: persons.length, data: persons });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/persons/profile
 * Returns the logged-in user's own profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await Person.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/persons/:workType
 * Filter staff by work type
 */
const getByWork = async (req, res, next) => {
    try {
        const { workType } = req.params;

        if (!VALID_WORK_TYPES.includes(workType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid work type. Must be one of: ${VALID_WORK_TYPES.join(', ')}`,
            });
        }

        const persons = await Person.find({ work: workType }).select('-password');
        res.json({ success: true, count: persons.length, data: persons });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/persons/:id
 * Manager only — update a staff member
 */
const updatePerson = async (req, res, next) => {
    try {
        const person = await Person.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!person) return res.status(404).json({ success: false, error: 'Person not found.' });

        res.json({ success: true, data: person });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/persons/:id
 * Manager only — remove a staff member
 */
const deletePerson = async (req, res, next) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        if (!person) return res.status(404).json({ success: false, error: 'Person not found.' });

        res.json({ success: true, message: 'Person deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getProfile, getByWork, updatePerson, deletePerson };
