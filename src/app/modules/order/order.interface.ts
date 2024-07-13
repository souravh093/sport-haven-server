import { Types } from 'mongoose';

export type TUserOrderInfo = {
  name: string;
  email: string;
  address: string;
  number: string;
  paymentMethod: string;
};

export type TOrderItem = {
  userId: Types.ObjectId;
  totalPrice: number;
  quantity: number;
  productId: Types.ObjectId;
};

export type TOrder = {
  name: string;
  email: string;
  address: string;
  number: string;
  paymentMethod: string;
  orderItems: TOrderItem[];
};
