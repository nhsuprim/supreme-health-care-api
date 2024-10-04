"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const meta_services_1 = require("./meta.services");
const http_status_1 = __importDefault(require("http-status"));
const fetchDashboardMetaData = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await meta_services_1.MetaService.fetchDashboardMetaData(user);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Dashboard meta data successfully fetched",
        data: result,
    });
});
exports.MetaController = {
    fetchDashboardMetaData,
};
