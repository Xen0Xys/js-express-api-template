import loadFiles from "#handlers/file.handler";
import {AlignmentEnum} from "ascii-table3";
import createTable from "#utils/table";

export default async() => {
    const table = createTable("Tasks", ["Task", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/api/tasks", true);
    for(const file of files){
        try{
            await import(`#tasks/${file}`)
            table.addRow(file, "✅", "");
        } catch (e){
            table.addRow(file, "❌", e);
        }
    }
    console.log(table.toString());
};
