import { model, Schema } from 'mongoose';
import { TOrderItem, TUserOrderInfo } from './order.interface';

const userOrderInfoSchema = new Schema<TUserOrderInfo>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});

const orderItemSchema = new Schema<TOrderItem>({
  userId: { type: Schema.Types.ObjectId, required: true },
  totalPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productId: { type: Schema.Types.ObjectId, required: true },
});

export const UserOrderInfo = model<TUserOrderInfo>(
  'UserOrderInfo',
  userOrderInfoSchema,
);
export const OrderItem = model<TOrderItem>('OrderItem', orderItemSchema);
