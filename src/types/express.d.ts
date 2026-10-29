import type { UserDocument } from "../models/user.model";
import type { SessionDocument } from "../models/session.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      session?: SessionDocument;
    }
  }
}
export {};
