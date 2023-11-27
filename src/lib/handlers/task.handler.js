const loadFiles = require("./file.handler");
const {AlignmentEnum} = require("ascii-table3");

module.exports = () => {
    const table = require("@utils/table")("Tasks", ["Task", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/api/tasks", true);
    files.forEach(file => {
        try{
            require(`@tasks/${file}`);
            table.addRow(file, "✅", "");
        } catch (e){
            table.addRow(file, "❌", e);
        }
    });
    console.log(table.toString());
};
