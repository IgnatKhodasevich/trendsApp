'use strict';

const express = require('express');
const fileManager = require('./file-manager');
const fileManagerConstants = require('./file-manager-constants');
let googleTrends = require('./node_modules/google-trends-api/lib/google-trends-api.min.js');


const port = 3000;
const app = express();

let query = 'bitcoin';
let dataObjects = [];
//Frequency of delivery of data from google
let frequency = 24;

//field constants for csv files
const fieldsForAnalyticsData = ['time', 'popularity'];


getAnalyticsData(query).catch();


/**
 * Get analytics data from google trends for query
 * @returns {Promise}
 */
function getAnalyticsData(query) {
    return new Promise(function (resolve, reject) {
        setInterval(function () {
            googleTrends.interestOverTime({
                keyword: query,
                startTime: new Date(Date.now() - (frequency * 60 * 60 * 1000)),
                granularTimeResolution: true
            }, function (err, results) {
                if (err) {
                    console.log('oh no error!', err);
                } else {
                    results = JSON.parse(results);
                    let dataArray = results.default.timelineData;
                    for (let i = 0; i < dataArray.length; i++) {
                        let tempObject = new DataObject(dataArray[i].formattedTime, dataArray[i].value);
                        dataObjects.push(tempObject);
                    }
                    let csv = fileManager.createCSV(fieldsForAnalyticsData, dataObjects);
                    fileManager.createAndDownloadFile(csv, fileManagerConstants.ANALYTICS,
                                                            fileManagerConstants.ANALYTICS_CSV, query).catch();
                }


            });
        }, 10000);
    });
}

function DataObject(time, popularity) {
    this.time = time;
    this.popularity = popularity;
}
