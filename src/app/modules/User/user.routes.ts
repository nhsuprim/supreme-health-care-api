
import express from 'express'
import { userControllers } from './user.controllers';
import auth from '../../middleware/authMiddleware';

const router = express.Router();



router.post('/',auth('ADMIN', 'SUPERADMIN'), userControllers.createAdmin)

export const userRoutes = router;