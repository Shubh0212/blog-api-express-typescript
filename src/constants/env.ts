import "dotenv/config";

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  MONGODB_URI: required("MONGODB_URI"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
