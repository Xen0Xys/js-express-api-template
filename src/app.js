require("module-alias/register");
if(process.env.NODE_ENV === "test")
    require("dotenv").config({path: ".env.ci"});
else
    require("dotenv").config();

const database = require("@database/database");
let api;
if(process.env.NODE_ENV !== "test")
    require("@handlers/migration.handler")(database).then(() => {
        api = require("@api/api");
    });
else
    api = require("@api/api");


module.exports = {
    database,
    api
};
