import express, { Request, Response } from 'express'
import { userControllers } from './user.controllers';

const router = express.Router();

router.post('/', userControllers.createAdmin)

export const userRoutes = router;