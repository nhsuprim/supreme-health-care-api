"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const jwtHelpers_1 = __importDefault(require("../../helpers/jwtHelpers"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const AccessTokenJwtSecret = process.env.ACCESS_JWT_SECRET;
const RefreshTokenJwtSecret = process.env.REFRESH_JWT_SECRET;
// const AccessTokenJwtSecretExpireIn = process.env.ACCESS_JWT_SECRET_EXPIRES_IN
const logInUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Invalid password");
    }
    const accessToken = (0, jwtHelpers_1.default)({
        email: userData.email,
        role: userData.role,
        secretKey: AccessTokenJwtSecret,
        expiresIn: "30d",
    });
    const refreshToken = (0, jwtHelpers_1.default)({
        email: userData.email,
        role: userData.role,
        secretKey: RefreshTokenJwtSecret,
        expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRES_IN,
    });
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // implement logic to refresh token
    let decodedData;
    try {
        decodedData = jsonwebtoken_1.default.verify(token, RefreshTokenJwtSecret);
    }
    catch (error) {
        throw new Error("Unautorized");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const accessToken = (0, jwtHelpers_1.default)({
        email: userData.email,
        role: userData.role,
        secretKey: AccessTokenJwtSecret,
        expiresIn: process.env.ACCESS_JWT_SECRET_EXPIRES_IN,
    });
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error();
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password changed successfully",
    };
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const resetPassToken = (0, jwtHelpers_1.default)({
        email: userData.email,
        role: userData.role,
        secretKey: process.env.RESET_PASS_SECRET,
        expiresIn: process.env.RESET_PASS_SECRET_EXPIRES_IN,
    });
    const resetPassLink = process.env.RESET_PASS_LINK +
        `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, sendEmail_1.default)(userData.email, `
        <div>
        <h1>Reset Password</h1>
        <p>To reset your password, please click the following link:</p>
        <a href="${resetPassLink}">
        <button type="button">Reset Password</button>
        </a>
        </div>
        `);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
        },
    });
    if (!userData) {
        throw new Error("User not found");
    }
    const isTokenValid = jsonwebtoken_1.default.verify(token, process.env.RESET_PASS_SECRET);
    if (!isTokenValid) {
        throw new Error("Invalid token");
    }
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password: hashedPassword,
        },
    });
});
exports.AuthService = {
    logInUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
