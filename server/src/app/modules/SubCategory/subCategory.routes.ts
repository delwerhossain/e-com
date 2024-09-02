import express from 'express';
const router = express.Router();

// Define routes
router.get('/', CategoryControllers.getCategories);
router.get('/:id', CategoryControllers.getACategory);
router.post('/', CategoryControllers.createCategory);
router.delete('/:id', CategoryControllers.deleteCategory);
router.put('/status/:id', CategoryControllers.isActiveCategory);
router.put('/:id', CategoryControllers.updateACategory);
router.put('/:id', CategoryControllers.updateACategory);

export const categoryRoutes = router;