const fsPromise = require('fs/promises')
module.exports = class Files {
    static async promiseReadFile(pathToFile) {
        try {
            let content = await fsPromise.readFile(pathToFile, "utf-8");
            console.log("File was read");
            return content;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static async promiseWriteFile(pathToFile, data) {
        try {
            await fsPromise.writeFile(pathToFile, data, "utf-8");
            console.log("File was rewrited");
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static async promiseAppendFile(pathToFile, data) {
        try {
            await fsPromise.appendFile(pathToFile, data, "utf-8");
            console.log("File was appended");
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}