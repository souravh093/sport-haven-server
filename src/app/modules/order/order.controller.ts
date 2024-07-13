import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
console.log(req.body)
    const result = await OrderServices.createOrderIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Order created successfully',
        data: result,
    })
})


export const OrderController = {
    createOrder,
}