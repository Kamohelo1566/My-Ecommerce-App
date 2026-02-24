import {Router} from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getCart, addToCart, UpdateCartItem, removeFromCart, clearCart} from "../controllers/cart.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/",getCart);
router.post("/",addToCart);
router.put("/:productId",UpdateCartItem);  //
router.delete("/:productId",removeFromCart); //remove items from ur cart
router.delete("/",clearCart);  //clears the cart after payment is successful


export default router;