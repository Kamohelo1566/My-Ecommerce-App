import {Router} from "express";
import {addAddress} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAddresses } from "../controllers/user.controller.js";
import { updateAddress } from "../controllers/user.controller.js";
import { deleteAddress } from "../controllers/user.controller.js";
import { addToWishlist } from "../controllers/user.controller.js";
import { removeFromWishlist } from "../controllers/user.controller.js";
import { getWishlist } from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute);

//endpoints
//address routes
router.post("/addresses",  addAddress);

//fetch all addresses of a user
router.get("/addresses",  getAddresses);

//update an address of a user (specific address)
router.put("/addresses/:addressId",  updateAddress);

//delete an address of a user (specific address)
router.delete("/addresses/:addressId", deleteAddress);

//wishlist routes
//add to wishlist
router.post("/wishlist", addToWishlist);

//remove from wishlist
router.delete("/wishlist/:productId", removeFromWishlist);

//get wishlist items
router.get("/wishlist", getWishlist);

export default router;