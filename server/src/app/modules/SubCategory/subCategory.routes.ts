import express from 'express';
import { SubCategoryControllers } from './subCategory.controller';
const router = express.Router();

// Define routes
router.post('/', SubCategoryControllers.createSubCategory);
router.get('/', SubCategoryControllers.getSubCategories);
router.get('/:id', SubCategoryControllers.getASubCategory);
router.delete('/:id', SubCategoryControllers.deleteASubCategory);
router.put('/status/:id', SubCategoryControllers.isActiveSubCategory);
router.put('/:id', SubCategoryControllers.updateASubCategory);

export const subcategoryRoutes = router;
