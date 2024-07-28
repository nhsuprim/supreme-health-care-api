import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/user/user.routes';


const app:Application = express();

// middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes 
app.use('/api/v1/user', userRoutes)

app.get("/", (req: Request, res: Response) => {
    res.send({
        message: "Hello Supreme Health Care"
    });
})


export default app;