import { Request, Response } from "express";
import AddItemDto from "../types/AddItemDto";
import CartService from "./../services/CartService";

export const addItem = async (req: Request, res: Response) => {
  const userId = req.currentUser!.userId;
  const addItemDto: AddItemDto = req.body;

  const cart = await CartService.addItem(userId, addItemDto);

  res.status(201).json({
    status: "success",
    data: cart,
  });
};

export const removeItem = async (req: Request, res: Response) => {
  const { cartItemId } = req.params;
  const userId = req.currentUser!.userId;
  const cart = await CartService.removeItem(cartItemId, userId);

  res.status(203).json({
    status: "success",
    data: cart,
  });
};

export const getItems = async (req: Request, res: Response) => {
  const userId = req.currentUser!.userId;
  const cart = await CartService.getItems(userId);
  res.status(200).json({
    status: "success",
    data: cart,
  });
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.currentUser!.userId;
  const cart = await CartService.clearCart(userId);
  res.status(203).json({
    status: "success",
    data: cart,
  });
};

export const updateItem = async (req: Request, res: Response) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;
  const cart = await CartService.updateItem(cartItemId, quantity);

  res.status(200).json({
    status: "success",
    data: cart,
  });
};
