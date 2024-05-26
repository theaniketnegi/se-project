"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
var mongoose_1 = require("mongoose");
var adminSchema = new mongoose_1.default.Schema({
    adminId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 4,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    students: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
exports.Admin = mongoose_1.default.model('Admin', adminSchema);
