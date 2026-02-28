import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnails: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }, // para que mongoose cree automáticamente los campos createdAt y updatedAt
);

productSchema.plugin(mongoosePaginate);

const ProductModel = model("products", productSchema);

export default ProductModel;
