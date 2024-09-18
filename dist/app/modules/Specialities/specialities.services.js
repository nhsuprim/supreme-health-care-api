"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesService = void 0;
const fileUploaders_1 = require("../../helpers/fileUploaders");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const specialities_constant_1 = require("./specialities.constant");
const insertToDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const result = yield prisma_1.default.specialities.create({
        data: req.body,
    });
    return result;
});
const getAllfromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { searchTerm } = params, filteredData = __rest(params, ["searchTerm"]);
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    if (params.searchTerm) {
        andConditions.push({
            OR: specialities_constant_1.SpecialitiesFilterableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filteredData).length > 0) {
        andConditions.push({
            AND: Object.keys(filteredData).map((key) => ({
                [key]: {
                    equals: filteredData[key],
                },
            })),
        });
    }
    // andConditions.push({
    //     isDeleted: false,
    // });
    const conditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const results = yield prisma_1.default.specialities.findMany({
        where: conditions,
        skip,
        take: limit,
        // orderBy:
        //     options.sortBy && options.sortOrder
        //         ? {
        //               [options.sortBy]: options.sortOrder,
        //           }
        //         : {
        //               createdAt: "desc",
        //           },
    });
    const total = yield prisma_1.default.specialities.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
});
const updateInDb = (id, data, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const uploadToCloudinary = yield fileUploaders_1.fileUploader.uploadToCloudinary(file);
        data.icon = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const result = yield prisma_1.default.specialities.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deletefromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.specialities.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.SpecialitiesService = {
    insertToDb,
    getAllfromDB,
    updateInDb,
    deletefromDB,
};
