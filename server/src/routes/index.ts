import { Router } from 'express';
import { categoryRoutes } from '../app/modules/Categories/categories.routes';
import { userRoutes } from '../app/modules/Users/users.routes';
import { vendorRoutes } from '../app/modules/Users/Vendors/vendors.routes';
import { subcategoryRoutes } from '../app/modules/SubCategory/subCategory.routes';
import { reviewRoutes } from '../app/modules/Reviews/reviews.routes';

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
    path: '/reviews',
    route: reviewRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
