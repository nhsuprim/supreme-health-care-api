"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const update = zod_1.z.object({
    name: zod_1.z.string(),
    contactNumber: zod_1.z.string(),
});
exports.AdminValidation = {
    update,
};
