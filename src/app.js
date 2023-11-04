require("dotenv").config();

const database = require("./database/models/index");
const app = require("./api/api");

module.exports = {
    database,
    app
};
