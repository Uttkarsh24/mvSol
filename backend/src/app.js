import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.resolve(__dirname, '../public');

app.use(cors());
app.use(express.json());

import healthCheckRouter from "./routes/healthcheck.routes.js"
app.use("/api/v1/",healthCheckRouter);

import requestRouter from "./routes/request.routes.js"
app.use("/api/v1/",requestRouter);

app.use(express.static(frontendBuildPath));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
        if (err) {
            next();
        }
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[Error Middleware] ${statusCode} - ${message}`, err.stack || '');
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

export default app;