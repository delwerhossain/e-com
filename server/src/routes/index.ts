import { Router } from 'express';
import { categoryRoutes } from '../app/modules/Categories/categories.routes';



const router = Router();


const moduleRoutes = [
  {
    path: '/categories',
    route: categoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
