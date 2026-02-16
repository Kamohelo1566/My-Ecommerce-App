 import {Router} from 'express';
 import { protectRoute } from '../middleware/auth.middleware.js';
 import { adminOnly } from '../middleware/auth.middleware.js';
 import { createProduct } from '../controllers/admin.controller.js';
 import { getAllProducts } from '../controllers/admin.controller.js';
 import { updateProduct } from '../controllers/admin.controller.js';
 import { upload } from '../middleware/multer.middleware.js';
 import { getAllOrders } from '../controllers/admin.controller.js';
 import { updateOrderStatus } from '../controllers/admin.controller.js';
 import { getAllCustomers } from '../controllers/admin.controller.js';
 import { getDashboardStats } from '../controllers/admin.controller.js';

 const router = Router();

 // methods to ensure only admin can create product and not any other user
 router.use(protectRoute, adminOnly);

 //endpoints
 //methods found in admin controller
 router.post("/product", upload.array("images", 4), createProduct);  //max images 4

 router.get("/product", getAllProducts);

 router.put("/product/:id", upload.array("images", 4), updateProduct);

 router.get("/orders", getAllOrders); // to see all the orders placed by users (admin can see all orders)
 router.patch("/orders/:orderId/status", updateOrderStatus);  // to update order status (pending, shipped, delivered) - admin can update order status

 router.get("/customers", getAllCustomers); // to see all the customers (admin can see all customers)

 router.get("/stats", getDashboardStats); // to see admin dashboard stats (total sales, total orders, total customers) - admin can see dashboard stats

 //Put : update the entire resource (all fields) - if any field is missing it will be set to null
 //Patch : update specific fields of a resource - only the fields provided in the request will be updated


 export default router;