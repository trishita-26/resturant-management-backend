const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        taste: {
            type: String,
            enum: {
                values: ['Sweet', 'Spicy', 'Sour'],
                message: '{VALUE} is not a valid taste type',
            },
        },
        is_drink: {
            type: Boolean,
            default: false,
        },
        ingredients: {
            type: [String],
            default: [],
        },
        num_sales: {
            type: Number,
            default: 0,
            min: [0, 'Sales count cannot be negative'],
        },
    },
    { timestamps: true }
);

// Index for faster taste-based lookups
menuItemSchema.index({ taste: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;