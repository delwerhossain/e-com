import express from 'express';
import { VendorController } from './vendors.controller';

const router = express.Router();

// Define routes
router.get('/search', VendorController.getAllVendors); // Get all users with advanced search
router.get('/', VendorController.getAVendor); // Get a specific user by ID
router.post('/new', VendorController.createVendor);// Create a new user
router.patch('/:id', VendorController.updateAVendor);// Update specific user fields
router.delete('/:id', VendorController.deleteAVendor);// Delete a user by ID

export const vendorRoutes = router;
