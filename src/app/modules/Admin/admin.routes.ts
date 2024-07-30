import express from 'express';
import { AdminController } from './admin.controllers';

const router = express.Router();

router.get('/', AdminController.getAllFromDb)

export const AdminRoutes = router;