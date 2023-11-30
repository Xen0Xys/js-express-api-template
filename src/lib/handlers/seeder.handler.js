// noinspection SqlNoDataSourceInspection

const loadFiles = require("./file.handler");
const {AlignmentEnum} = require("ascii-table3");

module.exports = async(db) => {
    const table = require("@utils/table")("Migrations", ["Migration", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/database/seeders", true);
    for(const file of files){
        const seeder = require(`@seeders/${file}`);
        try{
            await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
            table.addRow(file, "✅", "");
        }catch (e){
            try{
                table.addRow(file, "❌", e);
                await seeder.down(db.sequelize.getQueryInterface(), db.Sequelize);
            }catch (e){
                table.addRow(file, "❌", e);
            }
        }
    }
    console.log(table.toString());
};
