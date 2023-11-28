import loadFiles from "#handlers/file.handler";
import {AlignmentEnum} from "ascii-table3";
import createTable from "#utils/table";

export default async(router) => {
    const table = createTable("Routes", ["Route", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/api/routes/v1", true);
    for (const file of files) {
        try {
            await (await import(`#routes/v1/${file}`)).default(router);
            table.addRow(file, "✅", "");
        } catch (e) {
            table.addRow(file, "❌", e);
        }
    }
    console.log(table.toString());
};
