require("module-alias/register");
require("dotenv").config();

const database = require("@database/index");
const app = require("@api/api");

module.exports = {
    database,
    app
};
