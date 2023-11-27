const chalk = require("chalk");

function getStatusColor(statusCode){
    switch (Math.floor(statusCode / 100)){
    case 2:
        return chalk.green(statusCode);
    case 3:
        return chalk.cyan(statusCode);
    case 4:
        return chalk.yellow(statusCode);
    case 5:
        return chalk.red(statusCode);
    default:
        return chalk.white(statusCode);
    }
}

module.exports = async(req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        const method = req.method;
        const path = req.originalUrl;
        const statusCode = getStatusColor(res.statusCode);
        const duration = Date.now() - startTime;
        const resSize = res.get("Content-Length");
        console.log(`${method} ${path} ${statusCode} ${duration}ms ${resSize}`);
    });
    next();
};
