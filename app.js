'use strict';

const express = require('express');
const fileManager = require('./file-manager');
const fileManagerConstants = require('./file-manager-constants');
let googleTrends = require('./node_modules/google-trends-api/lib/google-trends-api.min.js');

const port = 3000;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

let index = require('./routes/index');
let tasks = require('./routes/tasks');

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/', tasks);

app.listen(port, function(){
    console.log('Server started on port ' + port);
});

let query = 'bitcoin';
let dataObjects = [];
//Frequency of delivery of data from google in hours
let frequency = 1;

//field constants for csv files
const fieldsForAnalyticsData = ['time', 'popularity'];
const fieldsForRelatedData = ['dateStart', 'dateEnd', 'query', 'value'];
const fieldsForTrendData = ['dateStart', 'dateEnd', 'query', 'trend'];
const hourInMillis = 3600000;




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
                    console.error(err.toString(), err);
                } else {
                    results = JSON.parse(results);
                    let dataArray = results.default.timelineData;
                    for (let i = 0; i < dataArray.length; i++) {
                        let tempObject = new DataObject(dataArray[i].formattedTime, dataArray[i].value);
                        dataObjects.push(tempObject);
                    }
                    fileManager.createCSV(fieldsForAnalyticsData, dataObjects)
                        .then(result => {
                            fileManager.createAndDownloadFile(result, fileManagerConstants.ANALYTICS,
                                fileManagerConstants.ANALYTICS_CSV, query).catch(
                                error => {
                                    console.log(error);
                                }
                            );
                        });

                }
            });
        }, hourInMillis);
    });
}

function getRelatedData(query) {
    return new Promise(function (resolve, reject) {
        setInterval(function () {
            googleTrends.relatedQueries({
                keyword: query,
                startTime:new Date(Date.now() - (frequency * 60 * 60 * 1000)),
                granularTimeResolution: true
            },function (err, results) {
                if (err) {
                    console.error(err.toString());
                } else {
                    results = JSON.parse(results);
                    let relatedData = results.default.rankedList[0];
                    console.log(new Date(Date.now()));
                    console.dir(relatedData, {depth: null, colors: true});

                }
            })
        }, 10000)
    })

}

async function getAnalyticsPerDay(query, startDay, endDay, withGranular) {
    googleTrends.interestOverTime({
        keyword: query,
        startTime: new Date(startDay),
        endTime: new Date(endDay),
        granularTimeResolution: withGranular
    }, function (err, result) {
        if (err) {
            console.error(err);
    } else {
            console.dir(JSON.parse(result), {depth:null, colors: true});
             console.log(result);
            return result;
        }
    })

}


function DataObject(time, popularity) {
    this.time = time;
    this.popularity = popularity;
}
