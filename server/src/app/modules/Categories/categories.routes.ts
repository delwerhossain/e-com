import express from 'express';
import { categoryControllers } from './categories.controller';
const router = express.Router();

// Define routes
router.get('/');
router.get('/');
router.post('/', categoryControllers.createCategory);
router.delete('/');
router.patch('/');

export const categoryRoutes = router;
