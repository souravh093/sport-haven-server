import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    description: z.string({
      required_error: 'Product description is required',
    }),
    category: z.string({ required_error: 'Product category is required' }),
    brand: z.string({ required_error: 'Product brand is required' }),
    rating: z.number().optional(),
    price: z.number({ required_error: 'Product price is required' }),
    stockQuantity: z.number({ required_error: 'Product stock quantity is required' }),
    image: z.string({ required_error: 'Product image is required' }),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    rating: z.number().optional(),
    price: z.number().optional(),
    stockQuantity: z.number().optional(),
    image: z.string().optional(),
  }),
});


export const ProductValidations = {
    createProductValidation,
    updateProductValidation,
}