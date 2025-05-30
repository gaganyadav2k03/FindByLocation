"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    number: {
        type: Number,
        minlength: [10, "incorrect number"],
        required: true,
        unique: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
userSchema.index({ location: "2dsphere" });
exports.User = (0, mongoose_1.model)("User", userSchema);
