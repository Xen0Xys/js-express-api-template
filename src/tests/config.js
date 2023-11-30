require("module-alias/register");
const chaiHttp = require("chai-http");
const {database: db, api} = require("@src/app");
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
