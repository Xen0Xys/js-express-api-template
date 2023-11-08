const loadFiles = require("./file.handler");

module.exports = () => {
    console.log("------ Loading tasks ------");
    const files = loadFiles("./src/api/tasks", true);
    files.forEach(file => {
        try{
            require(`@tasks/${file}`)
            console.log(`✅  Task ${file} registered!`);
        } catch (e){
            console.error(`❌  Error while registering task ${file}: ${e}`);
        }
    });
};
