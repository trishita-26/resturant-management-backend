const Person = require('../models/Person');
const { generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/signup
 * Public — create a new staff member account
 */
const signup = async (req, res, next) => {
    try {
        const { name, age, work, mobile, email, address, salary, username, password } = req.body;

        const newPerson = new Person({ name, age, work, mobile, email, address, salary, username, password });
        const savedPerson = await newPerson.save();

        const token = generateToken({
            id: savedPerson._id,
            username: savedPerson.username,
            role: savedPerson.work, // chef | waiter | manager
        });

        // Omit password from response
        const userResponse = savedPerson.toObject();
        delete userResponse.password;

        res.status(201).json({ success: true, token, user: userResponse });
    } catch (err) {
        next(err); // passed to global error handler
    }
};

/**
 * POST /api/auth/login
 * Public — authenticate and receive JWT
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Explicitly include password (select: false in schema)
        const user = await Person.findOne({ username }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.work,
        });

        res.json({ success: true, token });
    } catch (err) {
        next(err);
    }
};

module.exports = { signup, login };
