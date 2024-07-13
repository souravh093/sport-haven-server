import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import { OrderController } from './order.controller';

const router = Router();

router.post(
  '/',
  validateRequest(OrderValidations.createOrderValidation),
  OrderController.createOrder,
);

export const OrderRoutes = router;
