import {  z } from 'zod';

const createOrderValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    address: z.string({ required_error: 'Address is required' }),
    number: z.string({ required_error: 'Number is required' }),
    paymentMethod: z.string({ required_error: 'Payment method is required' }),
    orderItems: z.array(
      z.object({
        productId: z.string({ required_error: 'Product ID is required' }),
        quantity: z.number({ required_error: 'Quantity is required' }),
        totalPrice: z.number({ required_error: 'Total price is required' }),
      }),
    ),
  }),
});



export const OrderValidations = {
    createOrderValidation,
}
