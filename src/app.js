require("module-alias/register");
if(process.env.NODE_ENV === "test"){
    require("dotenv-safe").config({
        path: ".env.ci",
        allowEmptyValues: true,
        example: ".env.example"
    });
}else{
    require("dotenv-safe").config({
        allowEmptyValues: false,
        example: ".env.example"
    });
}

const database = require("@database/database");
const api = require("@api/api");

module.exports = {
    database,
    api
};
