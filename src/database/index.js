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

// Load models
require("@handlers/model.handler")(db, sequelize);
// Load associations
require("@handlers/association.handler")(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
