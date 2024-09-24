import express from 'express';
import { VendorController } from './vendors.controller';

const router = express.Router();

// Define routes
router.get('/search', VendorController.getAllVendors); // Get all users with advanced search //! admin + super admin
router.get('/', VendorController.getAVendor); // Get a specific user by ID //* vendor + admin + super admin
router.post('/new', VendorController.createVendor); // Create a new user //* vendor + admin + super admin
router.patch('/:id', VendorController.updateAVendor); // Update specific user fields //* vendor + admin + super admin
router.delete('/:id', VendorController.deleteAVendor); // Delete a user by ID //! admin + super admin

router.get('/last-login/:id', VendorController.vendorLastLogin); // Update specific last login details 

export const vendorRoutes = router;
