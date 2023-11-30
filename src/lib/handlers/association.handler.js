const loadFiles = require("./file.handler");
const {AlignmentEnum} = require("ascii-table3");
const Sequelize = require("sequelize");

module.exports = (db) => {
    const table = require("@utils/table")("Associations", ["Association", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
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
};
