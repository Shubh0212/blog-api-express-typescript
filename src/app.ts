import express from "express";
import routes from "./routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";

export const app = express();

app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
