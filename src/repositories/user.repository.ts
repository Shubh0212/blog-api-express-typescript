import { User } from "../models/user.model";

export const userRepository = {
  create: (data: { name: string; email: string; password: string }) =>
    User.create(data),
  findById: (id: string) => User.findById(id),
  findByEmailWithPassword: (email: string) =>
    User.findOne({ email }).select("+password"),
  updateName: (id: string, name: string) =>
    User.findByIdAndUpdate(id, { name }, { new: true, runValidators: true }),
};
