'use strict';
//dependencies
const fs = require('fs');
const mkdirp = require('mkdirp');
const json2csv = require('json2csv');
const StringBuilder = require('string-builder');
const fileManagerConstants = require('./file-manager-constants');

module.exports = {
    createAndDownloadFile: async function (csv, directory, fileName, query) {
        let sb = new StringBuilder();
        sb.append(fileManagerConstants.DOWNLOADS_ROOT);
        this.checkDirectory(sb.toString());
        sb.append(query);
        this.checkDirectory(sb.toString());
        sb.append(directory);
        this.checkDirectory(sb.toString());
        let path = fileManagerConstants.DOWNLOADS_ROOT + query + directory;
        this.checkDirectory(path);

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
                    console.log(sb.toString());
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

        if (fs.exists(directory)) {
            console.log("dir already exist:" + directory);
        } else {
            mkdirp.mkdirP(directory, function (e) {
                if (e) {
                    console.error(e);
                }
                else {
                    console.log("dir created:" + directory);
                }
            });


        }
    }
};