require("module-alias/register");
const chaiHttp = require("chai-http");
const {database: db, api} = require("@src/app");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

before(async function(){
    await require("@handlers/migration.handler")(db);
    await require("@handlers/seeder.handler")(db);
    chai.use(chaiHttp);
    chai.use(chaiAsPromised);
});

module.exports = {
    api,
    db,
    expect: chai.expect,
    chai
};
