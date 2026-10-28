import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { userRepository } from "../../repositories/user.repository";
import { sessionRepository } from "../../repositories/session.repository";
import { AppError } from "../../utils/AppError";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// compared against when the email is unknown, so both failures take similar time
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

export const authService = {
  async signup(input: { name: string; email: string; password: string }) {
    const hash = await bcrypt.hash(input.password, 10);
    try {
      return await userRepository.create({ ...input, password: hash });
    } catch (err: any) {
      if (err?.code === 11000)
        throw new AppError(409, "Email is already registered");
      throw err;
    }
  },

  async login(email: string, password: string, userAgent: string) {
    const user = await userRepository.findByEmailWithPassword(email);
    const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
    if (!user || !valid) throw new AppError(401, "Invalid email or password");

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await sessionRepository.create({
      userId: user._id,
      token,
      expiresAt,
      userAgent,
    });

    return { token, expiresAt, user };
  },

  async logout(token: string) {
    await sessionRepository.deleteByToken(token);
  },
};
