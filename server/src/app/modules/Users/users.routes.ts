import express from 'express';
import { UserController } from './users.controller';

const router = express.Router();

// Define routes
router.get('/search', UserController.getAllUsers); //! admin + super admin
router.get('/', UserController.getAUser); //* user + admin + super admin
router.post('/new', UserController.createUser); //* user + admin + super admin
router.patch('/:id', UserController.updateAUser); //* user + admin + super admin
router.delete('/:id', UserController.deleteAUser); //! admin + super admin

export const userRoutes = router;
