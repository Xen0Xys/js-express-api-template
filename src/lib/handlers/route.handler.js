const loadFiles = require("./file.handler");
const {AlignmentEnum} = require("ascii-table3");

module.exports = async(app, prefix) => {
    const table = require("@utils/table")("Routes", ["Route", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/api/routes/v1", true);
    for (const file of files){
        try{
            await app.register(require(`@routes/v1/${file}`), {prefix: prefix});
            table.addRow(file, "✅", "");
        } catch (e){
            table.addRow(file, "❌", e);
        }
    }
    console.log(table.toString());
};
