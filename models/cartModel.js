import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    cartProduct: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productQuantity: String,
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
// Cart.createIndexes({ unique: true, dropDups: true });
export default Cart;
