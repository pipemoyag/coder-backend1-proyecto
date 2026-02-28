import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  // el id lo agregará mongoose automáticamente, no es necesario definirlo aquí
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const CartModel = model("carts", cartSchema);

export default CartModel;
