import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

import healthCheckRouter from "./routes/healthcheck.routes.js"
app.use("/api/v1/",healthCheckRouter);

import requestRouter from "./routes/request.routes.js"
app.use("/api/v1/",requestRouter);

export default app;