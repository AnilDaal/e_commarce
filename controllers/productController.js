import catchAsync from "../utils/catchAsync.js";
import Product from "../models/productModel.js";
import AppError from "../utils/appError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import Cart from "../models/cartModel.js";

const addSellerProduct = catchAsync(async (req, res, next) => {
  const sellerId = req.user._id;
  const image = req.body.image || req.file.path;
  console.log(image);
  const { title, description, category, price, totalQuantity } = req.body;
  if (
    !title ||
    !description ||
    !category ||
    !price ||
    !image ||
    !totalQuantity
  ) {
    return next(new AppError("please fill all field", 401));
  }
  const productData = await Product.create({ ...req.body, image, sellerId });
  // productData._id = sellerId;
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { title, description, category, price, image, totalQuantity } =
    req.body;
  const productData = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        title,
        description,
        category,
        price,
        image,
        totalQuantity,
      },
    },
    { new: true }
  );
  if (!productData) {
    return next(new AppError("No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: productData,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const productData = await Product.findByIdAndDelete(productId);
  if (!productData) {
    return next(new AppError("No Product found with this Id", 401));
  }
  res.status(201).json({
    status: "success",
    data: null,
  });
});

const getAllProduct = catchAsync(async (req, res, next) => {
  const totalProduct = await Product.find().countDocuments();
  const features = new ApiFeatures(Product.find(), req.query)
    .pagination()
    .sort()
    .filter()
    .limitFields()
    .search();
  const productData = await features.query;

  if (!productData) {
    return next(new AppError(" No Product found with this Id", 401));
  }

  res.status(201).json({
    status: "succes",
    totalProduct,
    filterProduct: productData.length,
    data: productData,
  });
});

const getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const productData = await Product.findById(productId);
  res.status(201).json({
    status: "succes",
    data: productData,
  });
});

const productQuantity = catchAsync(async (req, res, next) => {
  const { productId, totalProduct } = req.body;
  const productData = await Product.findById(productId);
  if (totalProduct > productData.totalQuantity) {
    return next(new AppError(`${productData.totalQuantity}`, 401));
  }
  const cartData = await Cart.findById(req.user._id);
  cartData.cartProduct.map((data) => {
    if (data.productId.toString() === productId) {
      data.productQuantity = totalProduct;
    }
  });
  await cartData.save();

  res.status(200).json({ status: "success", data: cartData });
});

export {
  addSellerProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  productQuantity,
};
