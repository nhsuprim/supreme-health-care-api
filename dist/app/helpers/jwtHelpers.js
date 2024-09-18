"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => {
    const token = jsonwebtoken_1.default.sign({
        email: payload.email,
        role: payload.role,
    }, payload.secretKey, {
        algorithm: 'HS256',
        expiresIn: payload.expiresIn
    });
    return token;
};
exports.default = generateToken;
