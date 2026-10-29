import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export interface ISession {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  userAgent: string;
}
export type SessionDocument = HydratedDocument<ISession>;

const sessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL: delete at expiresAt
  userAgent: { type: String, default: "" },
});

export const Session = model<ISession>("Session", sessionSchema);
