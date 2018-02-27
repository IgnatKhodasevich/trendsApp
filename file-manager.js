'use strict';
//dependencies
const fs = require('fs');
const fsPath = require('fs-path');
const json2csv = require('json2csv');
const fileManagerConstants = require('./file-manager-constants');


module.exports = {
    createAndDownloadFile: async function (csv, directory, fileName, query) {
        let path =  fileManagerConstants.DOWNLOADS_ROOT + query + directory;
        console.log(path);
        let newFileName = "";
        // this.checkDirectory(fileManagerConstants.DOWNLOADS_ROOT);
        // this.checkDirectory(fileManagerConstants.DOWNLOADS_ROOT + query);
        // this.checkDirectory(path);

        await fs.readdir(path, (err, files) => {
            let numberOfFiles;
            try {
                numberOfFiles = files.length;
            } catch (error) {
                numberOfFiles = 0;
            }

            let newNumber = numberOfFiles + 1;
            newFileName = fileName + newNumber.toString() + '.csv';
            });
        console.log(newFileName);
        let fullPath = path + newFileName.toString();
        fs.writeFile('./downloads/bitcoin/analytics/analytics4.csv', csv, function (err) {
            if (err) {
                console.log(newFileName);
                console.log(err);
                throw err;
            } else {
                console.log('File was downloaded to ' + path);
            }
        });

    },

    createCSV: async function (fields, data) {
        let csv;
        try {
            csv = await json2csv({data: data, fields: fields});
        } catch (error) {
            console.log(error);
        }
        return csv;
    },

    checkDirectory : function (directory) {
            try {
                fs.statSync(directory);
                console.log("dir already exist:" + directory);
            } catch(e) {
                fs.mkdirSync(directory);
                console.log("dir created:" + directory);
            }
        }

};