import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PatientServices } from "./patient.services";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { patientFilterableFields } from "./patient.constant";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    // console.log(filters);

    const result = await PatientServices.getAllfromDB(filters, options);

    res.status(httpStatus.OK).json({
        success: true,
        message: " All patient are successfully retrieved",
        meta: result.meta,
        data: result.data,
    });
});
const getById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await PatientServices.getById(id);
            res.status(httpStatus.OK).json({
                success: true,
                message: "Patient successfully retrieved by id",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

const deletePatient = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await PatientServices.deletePatient(id);
            res.status(httpStatus.OK).json({
                success: true,
                message: "Patient successfully deleted",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

const softDeletePatient = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await PatientServices.softDeletePatient(id);
            res.status(httpStatus.OK).json({
                success: true,
                message: "Patient successfully soft deleted",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

const updatePatient = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await PatientServices.updatePatient(id, req.body);
            res.status(httpStatus.OK).json({
                success: true,
                message: "Patient successfully updated",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

export const PattientControllers = {
    getAllPatients,
    getById,
    deletePatient,
    softDeletePatient,
    updatePatient,
};
