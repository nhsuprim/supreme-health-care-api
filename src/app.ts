import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middleware/globalErrorHandle';


const app:Application = express();

// middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalErrorHandler)

//routes 
// app.use('/api/v1/user', userRoutes)
// app.use('/api/v1/admin', AdminRoutes)

app.use('/api/v1/', router)

// error handling middleware
app.use((err:any ,req:Request, res:Response,  next:NextFunction) =>{
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: err.name,
        err: err
    })
})

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Supreme Health Care",
    })
})

app.use((req:Request, res:Response,  next:NextFunction) =>{
    res.status(httpStatus.NOT_FOUND).json({
        status: false,
        message: "API Not Found",
        error:{
            path: req.originalUrl,
            message: "API Error",
        }
    })
})


export default app;