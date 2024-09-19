import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

// Define routes
router.get('/search', AdminController.getAllAdmins); // Get all users with advanced search
router.get('/', AdminController.getAdmin); // Get a specific user by ID
router.post('/new', AdminController.createAdmin);// Create a new user
router.patch('/:id', AdminController.updateAdmin);// Update specific user fields
router.delete('/:id', AdminController.deleteAdmin);// Delete a user by ID

export const vendorRoutes = router;
