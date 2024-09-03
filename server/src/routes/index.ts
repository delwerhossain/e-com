import { Router } from 'express';
import { categoryRoutes } from '../app/modules/Categories/categories.routes';
import { subcategoryRoutes } from '../app/modules/SubCategory/subCategory.routes';




const router = Router();


const moduleRoutes = [
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/subcategories',
    route:subcategoryRoutes ,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
