const {AsciiTable3} = require("ascii-table3");

module.exports = (name, headings, alignments) => {
    const table = new AsciiTable3(name).setStyle("reddit-markdown");
    table.setHeading.bind(table)(...headings);
    alignments.forEach((alignment, index) => {
        table.setAlign.bind(table)(index + 1, alignment);
    });
    return table;
};
