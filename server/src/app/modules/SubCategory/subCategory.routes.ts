import express from 'express';
import { SubCategoryControllers } from './subCategory.controller';
const router = express.Router();

// Define routes
router.get('/', SubCategoryControllers.createSubCategory);
router.get('/:id', SubCategoryControllers.getASubCategory);
router.post('/', SubCategoryControllers.getSubCategories);
router.delete('/:id', SubCategoryControllers.deleteCategory);
router.put('/status/:id', SubCategoryControllers.isActiveCategory);
router.put('/:id', SubCategoryControllers.updateACategory);
router.put('/:id', SubCategoryControllers.updateACategory);

export const categoryRoutes = router;