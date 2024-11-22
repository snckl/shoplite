import { Request, Response } from "express";
import OrderService from "./../services/OrderService";

export const createOrder = async (req: Request, res: Response) => {
  const order = await OrderService.createOrder(req.currentUser!, req.body);
  res.status(201).json({
    status: "success",
    data: order,
  });
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await OrderService.getOrderById(req.params.id);
  res.status(200).json({
    status: "success",
    data: order,
  });
};

export const getUserOrders = async (req: Request, res: Response) => {
  const orders = await OrderService.getUserOrders(req.currentUser!.userId);
  res.status(200).json({
    status: "success",
    data: orders,
  });
};
