import express from 'express';
import { CategoryControllers } from './categories.controller';
const router = express.Router();

// Define routes
router.get('/', CategoryControllers.getCategories);
router.get('/:id', CategoryControllers.getACategory);
router.post('/', CategoryControllers.createCategory);
router.delete('/:id', CategoryControllers.deleteCategory);
router.put('/status/:id', CategoryControllers.isActiveCategory);
router.put('/:id', CategoryControllers.updateACategory);

export const categoryRoutes = router;
