
import express, { NextFunction, Request, Response } from 'express'
import { userControllers } from './user.controllers';
import auth from '../../middleware/authMiddleware';
import { fileUploader } from '../../helpers/fileUploaders';
import { userValidation } from './user.validation';
import { UserRole } from '@prisma/client';

const router = express.Router(); 

router.get('/', 
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  userControllers.getAllFromDb)

  router.patch('/status/:id', 
    auth(UserRole.ADMIN, UserRole.SUPERADMIN),
    userControllers.updateUserStatus)


router.post('/create-admin',
    auth('ADMIN', 'SUPERADMIN'),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) =>{

        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))

      return  userControllers.createAdmin(req, res, next)
    }
    )

router.post('/create-doctor',
        auth('ADMIN', 'SUPERADMIN'),
        fileUploader.upload.single('file'),
        (req: Request, res: Response, next: NextFunction) =>{
    
            req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
    
          return  userControllers.createDoctor(req, res, next)
        }
        )

  router.post('/create-patient',
   
    fileUploader.upload.single('file'),
      (req: Request, res: Response, next: NextFunction) =>{
      
         req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
      
            return  userControllers.createPatient(req, res, next)
          }
          )

export const userRoutes = router;