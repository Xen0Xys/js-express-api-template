require("module-alias/register");
require("dotenv-safe").config({
    allowEmptyValues: false,
    example: ".env.example"
});

const database = require("@database/index");
const app = require("@api/api");

module.exports = {
    database,
    app
};
