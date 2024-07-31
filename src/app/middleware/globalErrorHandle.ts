import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
const globalErrorHandler = (err:any ,req:Request, res:Response,  next:NextFunction) =>{
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: err.name,
        err: err
    })
}

export default globalErrorHandler;