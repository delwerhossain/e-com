import { Router } from 'express';
import { categoryRoutes } from '../app/modules/Categories/categories.routes';
import { userRoutes } from '../app/modules/Users/users.routes';
import { vendorRoutes } from '../app/modules/Vendors/vendors.routes';
import { subcategoryRoutes } from '../app/modules/SubCategory/subCategory.routes';
import { reviewRoutes } from '../app/modules/Reviews/reviews.routes';
import { ProductRoutes } from '../app/modules/Products/product.routes';
import { adminRoutes } from '../app/modules/Admin/admin.routes';
import { superAdminRoutes } from '../app/modules/Admin/SuperAdmin/superAdmin.routes';
import { authRoutes } from '../app/modules/Auth/auth.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/subcategories',
    route: subcategoryRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/vendor',
    route: vendorRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/super-admin',
    route: superAdminRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
