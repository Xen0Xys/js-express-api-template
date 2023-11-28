// noinspection SqlNoDataSourceInspection

import db from "#database/index";
import loadFiles from "#handlers/file.handler";
import {AlignmentEnum} from "ascii-table3";
import createTable from "#utils/table";

export async function migrate(){
    const table = createTable("Migrations", ["Migration", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
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
        const migration = (await import(`#migrations/${file}`)).default;
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

export async function seed(){
    const table = createTable("Seeds", ["Seed", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/database/seeders", true);
    for(const file of files){
        const seeder = (await import(`#seeders/${file}`)).default;
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
