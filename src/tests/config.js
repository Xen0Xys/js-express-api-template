require("module-alias/register");
require("dotenv-safe").config({
    path: ".env.ci",
    allowEmptyValues: true,
    example: ".env.example"
});
const chaiHttp = require("chai-http");
const db = require("@database/index");
const api = require("@api/api");
const chai = require("chai");

before(async function(){
    await require("@handlers/migration.handler")(db);
    await require("@handlers/seeder.handler")(db);
    chai.use(chaiHttp);
});

module.exports = {
    api,
    db,
    expect: chai.expect,
    chai
};
