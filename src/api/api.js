import {StatusCodes, ReasonPhrases} from "http-status-codes";
import {ValidationError} from "express-validation";
import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
const app = express();

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import logger from "#middlewares/logger.middleware"

function initMiddlewares(app){
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors());
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.use(compression());
    if(process.env.NODE_ENV !== "test")
        app.use(logger);
}

/* eslint-disable no-unused-vars */
async function loadRoutes(app, prefix){
    const router = express.Router();
    await (await import("#handlers/route.handler")).default(router);
    app.use(prefix, router);
    app.use(function(err, req, res, _){
        if (err instanceof ValidationError)
            return res.status(err.statusCode).json(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    });
    app.use(({res}) => res.status(StatusCodes.NOT_FOUND).json({message: ReasonPhrases.NOT_FOUND}));
}

async function loadTasks(){
    await (await import("#handlers/task.handler")).default();
}

function loadHttpServer(app, bindAddress, port){
    http.createServer({}, app).listen(parseInt(port), bindAddress, () => {
        log(false, bindAddress, port);
    });
}

function loadHttpsServer(app, bindAddress, port, keyFile, certFile){
    https.createServer({
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile)
    }, app).listen(parseInt(port), bindAddress, () => {
        log(true, bindAddress, port);
    });
}

function log(secure, bindAddress, port){
    console.log(`Server started on ${secure ? "https" : "http"}://${bindAddress}:${port}`);
}

function startServer(app){
    switch (process.env.SERVER_TYPE.toLowerCase()){
    case "http":
        loadHttpServer(app, process.env.BIND_ADDRESS, process.env.PORT);
        break;
    case "https":
        loadHttpsServer(app, process.env.BIND_ADDRESS, process.env.PORT, process.env.SSL_KEY_FILE, process.env.SSL_CERT_FILE);
        break;
    case "both":
        loadHttpServer(app, process.env.BIND_ADDRESS, process.env.PORT);
        loadHttpsServer(app, process.env.BIND_ADDRESS, process.env.PORT, process.env.SSL_KEY_FILE, process.env.SSL_CERT_FILE);
        break;
    default:
        throw new Error("Invalid SERVER_TYPE value");
    }
}

async function initApi(){
    initMiddlewares(app);
    await loadRoutes(app, process.env.PREFIX);
    await loadTasks();
    startServer(app);
}

await initApi();

export default app;
