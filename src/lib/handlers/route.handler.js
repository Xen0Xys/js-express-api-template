const loadFiles = require("./file.handler");
const {AlignmentEnum} = require("ascii-table3");

module.exports = (router) => {
    const table = require("@utils/table")("Routes", ["Route", "Status", "Error"], [AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.LEFT]);
    const files = loadFiles("./src/api/routes/v1", true);
    files.forEach(file => {
        try{
            require(`@routes/v1/${file}`)(router);
            table.addRow(file, "✅", "");
        } catch (e){
            table.addRow(file, "❌", e);
        }
    });
    console.log(table.toString().slice(0, -1));
};
