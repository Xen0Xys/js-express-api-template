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
sequelizeJoi(sequelize);

console.log("------ Loading models ------");
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
            console.log(`✅  Model ${file} registered!`);
        }catch (e){
            console.log(`❌  Error loading model ${file}: ${e.message}`);
        }
    });

console.log("------ Loading associations ------");
Object.keys(db).forEach(modelName => {
    try{
        if(db[modelName].associate)
            db[modelName].associate(db);
        console.log(`✅  ${modelName} associations registered!`);
    }catch (e){
        console.log(`❌  Error loading ${modelName} associations: ${e.message}`);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;