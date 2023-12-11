const {StatusCodes, ReasonPhrases} = require("http-status-codes");
const {ValidationError} = require("express-validation");
const https = require("https");
const http = require("http");
const fs = require("fs");
const JoiCompiler = require("joi-compiler");
const joiCompilerInstance = new JoiCompiler();
const api = require("fastify")({
    schemaController: {
        bucket: joiCompilerInstance.bucket,
        compilersFactory: {
            buildValidator: joiCompilerInstance.buildValidator
        }
    }
});

async function initMiddlewares(app){
    await app.register(require("@fastify/express"));
    // app.use(express.json());
    // app.use(express.urlencoded({extended: true}));
    app.use(require("cors")());
    app.use(require("helmet")());
    app.use(require("express-rate-limit")({
        windowMs: 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.use(require("compression")());
    if(process.env.NODE_ENV !== "test")
        app.use(require("@middlewares/logger.middleware"));
}

/* eslint-disable no-unused-vars */
async function loadRoutes(app, prefix){
    await require("@handlers/route.handler")(app, prefix);
    // app.use(function(err, req, res, _){
    //     if (err instanceof ValidationError)
    //         return res.status(err.statusCode).json(err);
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    // });
    // app.use(({res}) => res.status(StatusCodes.NOT_FOUND).json({message: ReasonPhrases.NOT_FOUND}));
}

function loadTasks(){
    require("@handlers/task.handler")();
}

function loadHttpServer(app, bindAddress, port){
    app.listen({port: parseInt(port), host: bindAddress}, () => {
        log(false, bindAddress, port);
    });
}

function loadHttpsServer(app, bindAddress, port, keyFile, certFile){
    // TODO: Migrate https server to fastify
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
        loadHttpServer(app, process.env.BIND_ADDRESS, process.env.HTTP_PORT);
        break;
    case "https":
        loadHttpsServer(app, process.env.BIND_ADDRESS, process.env.HTTPS_PORT, process.env.SSL_KEY_FILE, process.env.SSL_CERT_FILE);
        break;
    case "both":
        loadHttpServer(app, process.env.BIND_ADDRESS, process.env.HTTP_PORT);
        loadHttpsServer(app, process.env.BIND_ADDRESS, process.env.HTTPS_PORT, process.env.SSL_KEY_FILE, process.env.SSL_CERT_FILE);
        break;
    default:
        throw new Error("Invalid SERVER_TYPE value");
    }
}

async function initApi(app){
    await initMiddlewares(app);
    await loadRoutes(app, process.env.PREFIX);
    loadTasks();
    startServer(app);
}

initApi(api);

module.exports = api;
