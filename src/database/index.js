const env = process.env.NODE_ENV || "development";
import fs from "fs";
const config = JSON.parse(fs.readFileSync("./src/database/config/config.json"))[env];
import {AlignmentEnum} from "ascii-table3";
import {sequelizeJoi} from "sequelize-joi";
import createTable from "#utils/table";
import Sequelize from "sequelize";
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

let table = createTable("Models", ["Model", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
for (const file1 of fs.readdirSync("./src/database/models")
    .filter(file => {
        return (
            file.indexOf(".") !== 0 &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })){
    try{
        const model = (await import(`#models/${file1}`)).default(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        table.addRow(file1, "✅", "");
    }catch (e){
        table.addRow(file1, "❌", e);
    }
}
console.log(table.toString());

table = createTable("Associations", ["Association", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
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
