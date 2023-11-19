const env = process.env.NODE_ENV || "development";
const config = require("@config/config.json")[env];
const Sequelize = require("sequelize");
const fs = require("fs");
const db = {};

let sequelize;
if (config.use_env_variable)
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
else {
    if(config.storage)
        config.storage = config.storage.split("/").slice(-1)[0];
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const {sequelizeJoi} = require("sequelize-joi");
const {AlignmentEnum} = require("ascii-table3");
sequelizeJoi(sequelize);

const createTable = require("@utils/table");
let table = createTable("Models", ["Model", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
fs.readdirSync(__dirname + "/models")
    .filter(file => {
        return (
            file.indexOf(".") !== 0 &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach(file => {
        try{
            const model = require(`@models/${file}`)(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
            table.addRow(file, "✅", "");
        }catch (e){
            table.addRow(file, "❌", e);
        }
    });
console.log(table.toString().slice(0, -1));

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
console.log(table.toString().slice(0, -1));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
