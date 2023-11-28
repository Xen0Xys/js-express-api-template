import fs from "fs";
import db from "#database/index";
import app from "#api/api";
import {migrate, seed} from "#utils:db/db.utils";
import chaiHttp from "chai-http";
import chai from "chai";
if (!fs.existsSync(".env")){
    try {
        const envExampleContent = fs.readFileSync(".env.example", "utf8");
        fs.writeFileSync(".env", envExampleContent, "utf8");
        console.log(".env created from .env.example!");
    } catch (err){
        console.error("An error occurred :", err);
    }
}
const dotenv = await import("dotenv");
dotenv.config();

before(async function(){
    await migrate();
    await seed();
    chai.use(chaiHttp);
});

export default {
    app,
    db,
    expect: chai.expect,
    chai
};
