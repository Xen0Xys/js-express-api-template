import fs from "fs";

/**
 * Check if the given path is a directory.
 * @param path Folder's path
 */
function isDirectory(path){
    return fs.lstatSync(path).isDirectory();
}

/**
 * Check if the given path is a TypeScript file
 * @param path File's path
 */
function isJSFile(path){
    return path.endsWith(".js");
}

/**
 * Get list of file with sub folders (only JavaScript files).
 * @param path Folder's path
 * @param subFiles Should check sub folders?
 */
export default function loadFiles(path, subFiles){
    const files = [];
    fs.readdirSync(path).forEach((file) => {
        if (subFiles && isDirectory(`${path}/${file}`))
        {loadFiles(`${path}/${file}/`, subFiles).forEach((f) => files.push(`${file}/${f}`));}
        else if (isJSFile(file))
        {files.push(file);}
    });
    return files;
}
