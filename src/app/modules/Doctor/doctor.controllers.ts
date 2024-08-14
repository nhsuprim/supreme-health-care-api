import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.services";
import httpStatus from "http-status";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    console.log(filters);

    const result = await DoctorServices.getAllDoctor(filters, options);

    res.status(httpStatus.OK).json({
        success: true,
        message: " All doctor are successfully retrieved",
        meta: result.meta,
        data: result.data,
    });
});
const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await DoctorServices.getById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor successfully retrieved by id",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //  console.log(req.params);
        const result = await DoctorServices.deleteDoctor(req.params.id);
        res.status(200).json({
            success: true,
            message: "Admin successfully deleted",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const softDeleteDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //  console.log(req.params);
        const result = await DoctorServices.softDeleteDoctor(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor successfully deleted",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await DoctorServices.updateDoctor(id, req.body);
        res.status(200).json({
            success: true,
            message: "Doctor successfully updated",
            data: updatedDoctor,
        });
    } catch (error) {
        next(error);
    }
};

export const DoctorController = {
    getAllDoctor,
    getById,
    softDeleteDoctor,
    deleteDoctor,
    updateDoctor,
};
