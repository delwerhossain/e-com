// import { NextFunction, Request, Response } from "express";

// function hasPermission(permission: string) {
//     return (req: Request, res: Response, next: NextFunction) => {
//       const { permissions } = req.user; // Extract permissions from the authenticated user
//       if (permissions && permissions.includes(permission)) {
//         return next();
//       }
//       return res.status(403).json({ message: "Forbidden: You don't have the required permissions." });
//     };
//   }

//   // Example usage in an Express route
//   app.get('/admin/orders', hasPermission('manageOrders'), (req, res) => {
//     // Fetch and display orders
//   });
