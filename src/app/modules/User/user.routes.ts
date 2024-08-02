
import express, { NextFunction, Request, Response } from 'express'
import { userControllers } from './user.controllers';
import auth from '../../middleware/authMiddleware';
import { fileUploader } from '../../helpers/fileUploaders';
import { userValidation } from './user.validation';

const router = express.Router(); 


   

router.post('/',
    auth('ADMIN', 'SUPERADMIN'),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) =>{

        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))

      return  userControllers.createAdmin(req, res, next)
    }
    )

export const userRoutes = router;