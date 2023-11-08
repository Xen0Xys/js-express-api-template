// noinspection SqlNoDataSourceInspection

const db = require("@models/index");
const loadFiles = require("@handlers/file.handler");

async function migrate(){
    console.log("------ Starting migrations ------");
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
            console.log(`✅  Migration ${file} done!`);
        }catch (e){
            try{
                console.error(`❌  Error while migrating ${file}: ${e}`);
                await migration.down(db.sequelize.getQueryInterface(), db.Sequelize);
            }catch (e){
                console.error(`❌  Error while un-migrating ${file}: ${e}`);
            }
        }
    }
}

async function seed(){
    console.log("------ Starting seeds ------");
    const files = loadFiles("./src/database/seeders", true);
    for(const file of files){
        const seeder = require(`@seeders/${file}`);
        try{
            await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
            console.log(`✅  Seed ${file} done!`);
        }catch (e){
            try{
                console.error(`❌  Error while seeding ${file}: ${e}`);
                await seeder.down(db.sequelize.getQueryInterface(), db.Sequelize);
            }catch (e){
                console.error(`❌  Error while un-seeding ${file}: ${e}`);
            }
        }
    }
}

module.exports = {
    migrate,
    seed
};
