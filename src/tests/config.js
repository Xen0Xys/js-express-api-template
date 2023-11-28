import fs from "fs";
if (!fs.existsSync(".env")){
    try {
        const envExampleContent = fs.readFileSync(".env.example", "utf8");
        fs.writeFileSync(".env", envExampleContent, "utf8");
        console.log(".env created from .env.example!");
    } catch (err){
        console.error("An error occurred :", err);
    }
}
const app = await import("#src/app");
const database = app.database;
const api = app.api;
import { migrate, seed } from "#utils:db/db.utils";
import chai from "chai";
import chaiHttp from "chai-http";

before(async function(){
    await migrate();
    await seed();
    chai.use(chaiHttp);
});

export default {
    api,
    database,
    chai,
    expect: chai.expect
};
