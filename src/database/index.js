const env = process.env.NODE_ENV || "development";
import fs from "fs";
import {AlignmentEnum} from "ascii-table3";
import {sequelizeJoi} from "sequelize-joi";
import createTable from "#utils/table";
import Sequelize from "sequelize";
const config = JSON.parse(fs.readFileSync("./src/database/config/config.json"))[env];
const db = {};

let sequelize;
if (config.use_env_variable)
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
else {
    if(config.storage)
        config.storage = config.storage.split("/").slice(-1)[0];
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
sequelizeJoi(sequelize);

await (await import("#handlers/model.handler")).default(db, sequelize);

const table = createTable("Associations", ["Association", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
Object.keys(db).forEach(modelName => {
    try{
        if(db[modelName].associate)
            db[modelName].associate(db);
        table.addRow(modelName, "✅", "");
    }catch (e){
        table.addRow(modelName, "❌", e);
    }
});
console.log(table.toString());

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
