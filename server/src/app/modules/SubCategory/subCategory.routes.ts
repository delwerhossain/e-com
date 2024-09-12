import express from 'express';
import { SubCategoryControllers } from './subCategory.controller';
const router = express.Router();

// Define routes
router.get('/', SubCategoryControllers.getSubCategories);
router.get('/:id', SubCategoryControllers.getASubCategory);
router.get('/inactive', SubCategoryControllers.getInActiveSubCategories);
router.post('/', SubCategoryControllers.createSubCategory);
router.delete('/:id', SubCategoryControllers.deleteASubCategory);
router.patch('/status/:id', SubCategoryControllers.isActiveSubCategory);
router.patch('/:id', SubCategoryControllers.updateASubCategory);

export const subcategoryRoutes = router;
