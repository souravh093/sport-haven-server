import mongoose from 'mongoose';
import { TOrder } from './order.interface';
import { OrderItem, UserOrderInfo } from './order.model';
import { Product } from '../product/product.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createOrderIntoDB = async (payload: TOrder) => {
  const { orderItems } = payload;
  const userDataInfo = {
    name: payload.name,
    email: payload.email,
    address: payload.address,
    number: payload.number,
    paymentMethod: payload.paymentMethod,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Await the creation of user order info and access _id after it's resolved
    const createUserOrderInfo = await UserOrderInfo.create([userDataInfo], {
      session,
    });
    const userOrderInfoId = createUserOrderInfo[0]._id; // Assuming create returns an array

    const orderItemsWithUserOrderInfoId = orderItems.map((orderItem) => ({
      ...orderItem,
      userId: userOrderInfoId,
    }));

    // Await the creation of order items
    await OrderItem.create(orderItemsWithUserOrderInfoId, { session });


    for (const orderItem of orderItems) {
      await Product.updateOne(
        { _id: orderItem.productId },
        { $inc: { stockQuantity: -orderItem.quantity } },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return createUserOrderInfo;
  } catch (error) { 
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order');
  }
};

export const OrderServices = {
  createOrderIntoDB,
};
