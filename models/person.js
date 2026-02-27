const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        age: {
            type: Number,
            min: [18, 'Age must be at least 18'],
            max: [80, 'Age must be at most 80'],
        },
        work: {
            type: String,
            enum: {
                values: ['chef', 'waiter', 'manager'],
                message: '{VALUE} is not a valid work type',
            },
            required: [true, 'Work type is required'],
        },
        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        salary: {
            type: Number,
            required: [true, 'Salary is required'],
            min: [0, 'Salary cannot be negative'],
        },
        username: {
            required: [true, 'Username is required'],
            type: String,
            unique: true,
            trim: true,
        },
        // Fixed typo: passward → password; select:false so it never leaks in queries
        password: {
            required: [true, 'Password is required'],
            type: String,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
    },
    { timestamps: true }
);

// Hash password before saving
personSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Instance method to compare passwords
personSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Virtual: "role" mirrors "work" — used as the JWT claim.
 * This avoids storing a separate field while still supporting role-based auth.
 */
personSchema.virtual('role').get(function () {
    return this.work;
});

personSchema.set('toJSON', { virtuals: true });
personSchema.set('toObject', { virtuals: true });

const Person = mongoose.model('Person', personSchema);
module.exports = Person;