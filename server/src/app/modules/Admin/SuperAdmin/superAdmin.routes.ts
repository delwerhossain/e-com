import express from 'express';
import { SuperAdminController } from './superAdmin.controller';

const router = express.Router();

// Define routes
router.get('/', SuperAdminController.getSuperAdmin); // Get a specific superAdmin details by ID//! only superAdmin
router.patch('/:id', SuperAdminController.updateSuperAdmin);// Update specific user fields  //! only superAdmin

export const superAdminRoutes = router;
