const loadFiles = require("./file.handler");

module.exports = (router) => {
    console.log("------ Loading routes ------");
    const files = loadFiles("./src/api/routes/v1", true);
    files.forEach(file => {
        try{
            require(`@routes/v1/${file}`)(router);
            console.log(`✅  Route ${file} registered!`);
        } catch (e){
            console.error(`❌  Error while registering route ${file}: ${e}`);
        }
    });
};
