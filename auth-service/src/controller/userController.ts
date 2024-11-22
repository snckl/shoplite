import { Request, Response } from "express";
import UserService from "../services/UserService";

export const getUser = async (req: Request, res: Response) => {
  const user = await UserService.getUser(req.params.id);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  await UserService.updateUser(req.currentUser!.userId, req.body);

  res.status(204).json();
};

export const deleteUser = async (req: Request, res: Response) => {
  await UserService.deleteUser(req.currentUser!.userId);

  res.status(204).json();
};

export const listUsers = async (req: Request, res: Response) => {
  const page = req.query.page === undefined ? 1 : +req.query.page;

  const users = await UserService.listUsers(page);

  res.status(200).json({
    status: "success",
    data: {
      page,
      count: users.length,
      users,
    },
  });
};
