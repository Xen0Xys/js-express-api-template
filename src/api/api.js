const {StatusCodes, ReasonPhrases} = require("http-status-codes");
const {ValidationError} = require("express-validation");
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

function initMiddlewares(app){
    const cors = require("cors");
    const helmet = require("helmet");
    const rateLimit = require("express-rate-limit");
    const morgan = require("morgan");
    const compression = require("compression");

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
    app.use(morgan("dev"));
    app.use(compression());
}

/* eslint-disable no-unused-vars */
function loadRoutes(app, prefix){
    const router = express.Router();
    require("@handlers/route.handler")(router);
    app.use(prefix, router);
    app.use(function(err, req, res, _){
        if (err instanceof ValidationError)
            return res.status(err.statusCode).json(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    });
    app.use(({res}) => res.status(StatusCodes.NOT_FOUND).json({message: ReasonPhrases.NOT_FOUND}));
}

function loadTasks(){
    require("@handlers/task.handler")();
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

function initApi(){
    initMiddlewares(app);
    loadRoutes(app, process.env.PREFIX);
    loadTasks();
    startServer(app);
}

initApi();

module.exports = app;
