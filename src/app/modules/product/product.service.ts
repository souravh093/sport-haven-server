import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { ProductSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: TProduct, file: any) => {
  // check is product already exist with name
  const isProductAlreadyExist = await Product.findOne({
    name: payload.name,
  });

  //   throw error is product exist
  if (isProductAlreadyExist) {
    throw new AppError(409, 'Product Already Exist');
  }

  // send image to cloudinary
  const imageName: string = `${payload.name}-${Date.now()}`;
  const path: string = file?.path;

  const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
    secure_url: string;
  };

  const result = await Product.create({
    ...payload,
    price: Number(payload.price),
    stockQuantity: Number(payload.stockQuantity),
    image: secure_url,
  });

  return result;
};

// get all product
const getAllProductFromDB = async (query: Record<string, unknown>) => {

  const productQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  return result;
};

// get single product
const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id);

  if (!result) {
    throw new AppError(404, 'Product not found');
  }

  return result;
};

const updateProductFromDB = async (
  id: string,
  payload: Partial<TProduct>,
  file: any,
) => {
  // check is product already exist with
  const findProductById = await Product.findById(id);

  //   if product not found then throw error message
  if (!findProductById) {
    throw new AppError(404, 'Product not found');
  }

  // send image to cloudinary
  if (file) {
    const imageName: string = `${payload.name}-${Date.now()}`;
    const path: string = file?.path;

    const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
      secure_url: string;
    };

    payload.image = secure_url;
  }

  //   then update the product
  const result = await Product.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  );

  return result;
};

const deleteProductFromDB = async (id: string) => {
  // check is product already exist with
  const findProductById = await Product.findById(id);

  //   if product not found then throw error message
  if (!findProductById) {
    throw new AppError(404, 'Product not found');
  }

  //   then delete the product
  const result = await Product.findByIdAndDelete(id, { new: true });

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductFromDB,
  updateProductFromDB,
  deleteProductFromDB,
  getSingleProductFromDB,
};
