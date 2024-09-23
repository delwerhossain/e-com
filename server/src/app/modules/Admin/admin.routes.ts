import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

// Define routes
router.get('/search', AdminController.getAllAdmins); // Get all users with advanced search //! only superAdmin
router.get('/', AdminController.getAdmin); // Get a specific user by ID //* admin + super admin
router.post('/new', AdminController.createAdmin);// Create a new user //! only superAdmin
router.patch('/:id', AdminController.updateAdmin);// Update specific user fields  //* admin + super admin
router.delete('/:id', AdminController.deleteAdmin);// Delete a user by ID //! only superAdmin

export const adminRoutes = router;
