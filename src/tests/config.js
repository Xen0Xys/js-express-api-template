require("module-alias/register");
require("dotenv-safe").config({
    path: ".env.ci",
    allowEmptyValues: true,
    example: ".env.example"
});
const {migrate, seed} = require("@utils:db/db.utils");
const chaiHttp = require("chai-http");
const db = require("@database/index");
const app = require("@api/api");
const chai = require("chai");

before(async function(){
    await migrate();
    await seed();
    chai.use(chaiHttp);
});

module.exports = {
    app,
    db,
    expect: chai.expect,
    chai
};
