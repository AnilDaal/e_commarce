import express from "express";
import {
  getAllProduct,
  getSingleProduct,
} from "../controllers/productController.js";
import { addItemPublicWishlist } from "../controllers/wishlistController.js";
import { addItemPublicCart } from "../controllers/cartController.js";

const router = express.Router();

// public route
router.route("/").get(getAllProduct);
router.route("/:productId").get(getSingleProduct);

// public cart
router.route("/cart").patch(addItemPublicCart);

// public wishlist
router.route("/wishlist").patch(addItemPublicWishlist);

export default router;
