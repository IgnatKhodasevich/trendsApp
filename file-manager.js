'use strict';
//dependencies
const fs = require('fs');
const json2csv = require('json2csv');
const StringBuilder = require('string-builder');
const fileManagerConstants = require('./file-manager-constants');

module.exports = {
    createAndDownloadFile: async function (csv, directory, fileName, query) {
        let sb = new StringBuilder();
        sb.append(fileManagerConstants.DOWNLOADS_ROOT);
        sb.append(query);
        sb.append(directory);
        let path = fileManagerConstants.DOWNLOADS_ROOT + query + directory;
        this.checkDirectory(sb.toString());

        await fs.readdir(path, (err, files) => {
            let numberOfFiles;
            try {
                numberOfFiles = files.length;
            } catch (error) {
                numberOfFiles = 0;
            }

            let newNumber = numberOfFiles + 1;
            sb.append(fileName);
            sb.append(newNumber.toString());
            sb.append(fileManagerConstants.CSV);
            console.log(sb.toString());

            fs.writeFile(sb.toString(), csv, function (err) {
                if (err) {
                    console.log(newFileName);
                    console.log(err);
                    throw err;
                } else {
                    console.log('File was downloaded to ' + path);
                }
            });
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

    checkDirectory: function (directory) {
        try {
            fs.statSync(directory);
            console.log("dir already exist:" + directory);
        } catch (e) {
            fs.mkdirSync(directory);
            console.log("dir created:" + directory);
        }
    }

};