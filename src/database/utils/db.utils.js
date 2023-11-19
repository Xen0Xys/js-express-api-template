// noinspection SqlNoDataSourceInspection

const db = require("@database/index");
const loadFiles = require("@handlers/file.handler");
const {AlignmentEnum} = require("ascii-table3");

async function migrate(){
    const table = require("@utils/table")("Migrations", ["Migration", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT])
    let doneMigrations;
    try{
        doneMigrations = await db.sequelize.query("SELECT name FROM `SequelizeMeta`", {type: db.sequelize.QueryTypes.SELECT});
    }catch (e){
        await db.sequelize.query("CREATE TABLE `SequelizeMeta` (`name` VARCHAR(255) NOT NULL, PRIMARY KEY (`name`))");
        doneMigrations = [];
    }
    const files = loadFiles("./src/database/migrations", true);
    for(const file of files){
        if(doneMigrations.find(migration => migration.name === file))
            continue;
        const migration = require(`@migrations/${file}`);
        try{
            await migration.up(db.sequelize.getQueryInterface(), db.Sequelize);
            await db.sequelize.query(`INSERT INTO \`SequelizeMeta\` VALUES ('${file}')`);
            table.addRow(file, "✅", "");
        }catch (e){
            try{
                table.addRow(file, "❌", e);
                await migration.down(db.sequelize.getQueryInterface(), db.Sequelize);
            }catch (e){
                table.addRow(file, "❌", e);
            }
        }
    }
    console.log(table.toString().slice(0, -1));
}

async function seed(){
    const table = require("@utils/table")("Seeds", ["Seed", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT])
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
    console.log(table.toString().slice(0, -1));
}

module.exports = {
    migrate,
    seed
};
