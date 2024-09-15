import express from 'express';
import { VendorController } from './vendors.controller';

const router = express.Router();

// Define routes
router.get('/search', VendorController.getAllUsers); // Get all users with advanced search
router.get('/', VendorController.getAUser); // Get a specific user by ID
router.post('/new', VendorController.createUser);// Create a new user
router.patch('/:id', VendorController.updateAUser);// Update specific user fields
router.delete('/:id', VendorController.deleteAUser);// Delete a user by ID

export const vendorRoutes = router;
