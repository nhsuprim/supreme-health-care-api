import express, { Request, Response, NextFunction } from 'express';
import { AdminController } from './admin.controllers';
import { AnyZodObject, z } from 'zod';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidation } from './adminValidation';

const router = express.Router();




router.get('/', AdminController.getAllFromDb);

router.get('/:id', AdminController.getById);

router.patch('/:id', validateRequest(AdminValidation.update), AdminController.update);

router.delete('/:id', AdminController.deleteAdmin);

router.delete('/soft/:id', AdminController.softDeleteAdmin);

export const AdminRoutes = router;
