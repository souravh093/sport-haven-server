import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProductFromDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const updateRating = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProductRatingFromDB(
    req.params.id,
    req.body.rating,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product rating updated successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateRating,
};
