import { Router } from 'express';
import { categoryRoutes } from '../app/modules/Categories/categories.routes';
<<<<<<< HEAD
import { subcategoryRoutes } from '../app/modules/SubCategory/subCategory.routes';



=======
import { userRoutes } from '../app/modules/Users/users.routes';
>>>>>>> 2f7a7d79ef0dd64d21e0096a9ebb617e218e9830

const router = Router();

const moduleRoutes = [
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
<<<<<<< HEAD
    path: '/subcategories',
    route:subcategoryRoutes ,
  }
=======
    path: '/sub',
    route: categoryRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
>>>>>>> 2f7a7d79ef0dd64d21e0096a9ebb617e218e9830
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
