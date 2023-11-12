require("module-alias/register");
const fs = require("fs");
if (!fs.existsSync(".env")){
    try {
        const envExampleContent = fs.readFileSync(".env.example", "utf8");
        fs.writeFileSync(".env", envExampleContent, "utf8");
        console.log(".env created from .env.example!");
    } catch (err){
        console.error("An error occurred :", err);
    }
}

require("dotenv").config();
const {migrate, seed} = require("@utils/db.utils");
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
