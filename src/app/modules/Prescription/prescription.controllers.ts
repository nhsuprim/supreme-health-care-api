import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PrescriptionService } from "./prescription.services";
import { IAuthUser } from "../../interface/user";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { prescriptionFilterableFields } from "./prescription.constent";

const insertIntoDB = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;
        const result = await PrescriptionService.insertIntoDB(
            user as IAuthUser,
            req.body
        );
        res.status(httpStatus.OK).json({
            success: true,
            message: "Prescription inserted successfully",
            data: result,
        });
    }
);

const patientPrescription = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const result = await PrescriptionService.patientPrescription(
            user as IAuthUser,
            options
        );
        res.status(httpStatus.OK).json({
            success: true,
            message: "Patient Prescription is successfully fetched",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, prescriptionFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await PrescriptionService.getAllFromDB(filters, options);
    res.status(httpStatus.OK).json({
        success: true,
        message: "All Prescription feteched successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const PrescriptionController = {
    insertIntoDB,
    patientPrescription,
    getAllFromDB,
};
