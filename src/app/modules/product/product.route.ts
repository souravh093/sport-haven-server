import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import { ProductController } from './product.controller';


const router = Router();

router.post(
  '/',
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
router.patch("/rating/:id", ProductController.updateRating);

router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
