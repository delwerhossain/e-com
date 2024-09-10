import express from 'express';
import { CategoryControllers } from './categories.controller';
const router = express.Router();

// Define routes
router.get('/', CategoryControllers.getCategories);
router.get('/:id', CategoryControllers.getACategory);
router.get('/inactive', CategoryControllers.getInActiveCategories);
router.post('/', CategoryControllers.createCategory);
router.delete('/:id', CategoryControllers.deleteCategory);
router.patch('/status/:id', CategoryControllers.isActiveCategory);
router.patch('/:id', CategoryControllers.updateACategory);

export const categoryRoutes = router;
