import type { Types } from "mongoose";
import { Session } from "../models/session.model";

export const sessionRepository = {
  create: (data: {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    userAgent: string;
  }) => Session.create(data),
  findByToken: (token: string) => Session.findOne({ token }),
  deleteByToken: (token: string) => Session.deleteOne({ token }),
  deleteAllForUser: (userId: Types.ObjectId) => Session.deleteMany({ userId }), // bonus: logout-all
};
