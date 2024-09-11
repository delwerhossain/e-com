import express from 'express';
import { UserController } from './users.controller';

const router = express.Router();

// Define routes
router.get('/', UserController.getAllUsers);
router.get('/', UserController.getAUser);
router.post('/new', UserController.createUser);
router.patch('/:id', UserController.updateAUser);
router.delete('/:id', UserController.deleteAUser);

export const userRoutes = router;
