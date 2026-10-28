import { app } from "./app";
import { env } from "./constants/env";
import { connectDB } from "./providers/database/connection";

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
