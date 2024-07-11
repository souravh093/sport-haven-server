import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import { ProductController } from './product.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.post(
  '/',
  upload.single('image'),
  validateRequest(ProductValidations.createProductValidation),
  ProductController.createProduct,
);

router.get('/', ProductController.getAllProduct);
router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  validateRequest(ProductValidations.updateProductValidation),
  ProductController.updateProduct,
);

router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
