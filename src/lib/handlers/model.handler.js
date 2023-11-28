import loadFiles from "#handlers/file.handler";
import {AlignmentEnum} from "ascii-table3";
import createTable from "#utils/table";
import Sequelize from "sequelize";

export default async(db, sequelize) => {
    const table = createTable("Models", ["Route", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/database/models", true);
    for (const file of files){
        try {
            const model = (await import(`#models/${file}`)).default(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
            table.addRow(file, "✅", "");
        } catch (e){
            table.addRow(file, "❌", e);
        }
    }
    console.log(table.toString());
};
