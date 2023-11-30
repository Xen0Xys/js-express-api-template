const loadFiles = require("./file.handler");
const {AlignmentEnum} = require("ascii-table3");
const Sequelize = require("sequelize");

module.exports = (db, sequelize) => {
    const table = require("@utils/table")("Models", ["Model", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/database/models", true);
    files.forEach(file => {
        try{
            const model = require(`@models/${file}`)(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
            table.addRow(file, "✅", "");
        }catch (e){
            table.addRow(file, "❌", e);
        }
    });
    console.log(table.toString());
};
