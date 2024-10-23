import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

// Define routes
router.get('/login', AuthController.loginUser); 

export const authRoutes = router;
