"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLocal = exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_database_1 = require("../database/connection.database");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
// Função para obter o modelo local (lazy loading)
let userLocalModel = null;
const getUserLocal = () => {
    if (!userLocalModel) {
        const secondaryConn = (0, connection_database_1.getSecondaryConnection)();
        if (secondaryConn) {
            userLocalModel = secondaryConn.model('User', userSchema);
        }
    }
    return userLocalModel;
};
exports.getUserLocal = getUserLocal;
