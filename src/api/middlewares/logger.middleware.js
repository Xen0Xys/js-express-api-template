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

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
}

module.exports = async(req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        const currentTime = getCurrentTime();
        const method = req.method;
        const path = req.originalUrl;
        const statusCode = getStatusColor(res.statusCode);
        const duration = Date.now() - startTime;
        const resSize = res.get("Content-Length");
        console.log(`${currentTime} ${method} ${path} ${statusCode} ${duration}ms ${resSize}`);
    });
    next();
};
