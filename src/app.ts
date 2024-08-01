import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from "dotenv"
import cors from 'cors';
import router from './app/routes';
import httpStatus from 'http-status';

import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleware/globalErrorHandle';

const app: Application = express();
app.use(cors());
app.use(cookieParser());
dotenv.config()

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Supreme health care server.."
    })
});

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})

export default app;


// import express, { Application, NextFunction, Request, Response } from 'express';
// import cors from 'cors';
// import router from './app/routes';
// import httpStatus from 'http-status';

// import cookieParser from 'cookie-parser';
// import dotenv from "dotenv"
// import globalErrorHandler from './app/middleware/globalErrorHandle';


// const app:Application = express();

// // middleware
// app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(globalErrorHandler)
// app.use(cookieParser());


// dotenv.config()

// //routes 
// // app.use('/api/v1/user', userRoutes)
// // app.use('/api/v1/admin', AdminRoutes)

// app.use('/api/v1/', router)

// // error handling middleware
// // app.use((err:any ,req:Request, res:Response,  next:NextFunction) =>{
// //     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
// //         status: false,
// //         message: err.message,
// //         err: err
// //     })
// // })

// app.get("/", (req: Request, res: Response) => {
//     res.status(200).json({
//         success: true,
//         message: "Welcome to Supreme Health Care",
//     })
// })

// app.use((req:Request, res:Response,  next:NextFunction) =>{
//     res.status(httpStatus.NOT_FOUND).json({
//         status: false,
//         message: "API Not Found",
//         error:{
//             path: req.originalUrl,
//             message: "API Error",
//         }
//     })
// })


// export default app;