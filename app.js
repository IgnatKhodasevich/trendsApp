'use strict';

const express = require('express');
const json2csv = require('json2csv');
const methodOverride = require('method-override');
var googleTrends = require('./node_modules/google-trends-api/lib/google-trends-api.min.js');

const port = 3000;
const app = express();

var fs = require('fs');
var query = 'bitcoin';
var dataObjects = [];
var frequency = 24;
console.log(frequency);
setInterval(googleTrends.interestOverTime, 15000);

googleTrends.interestOverTime({
  keyword: query,
  startTime: new Date(Date.now() - (frequency * 60 * 60 * 1000)),
  granularTimeResolution: true
}, function(err, results) {
  if (err) {
    console.log('oh no error!', err);
  }
  else {
    results = JSON.parse(results);
    var dataArray = results.default.timelineData;
    for (var i = 0; i < dataArray.length; i++){
        var tempObject = new DataObject(dataArray[i].formattedTime, dataArray[i].value);
        dataObjects.push(tempObject);
      }
    }
    var fields = ['time', 'popularity'];
    createCSV(fields, dataObjects);
});

function createCSV(fields, data){
  var csv = json2csv({ data: data, fields: fields });

fs.writeFile('saved/file.csv', csv, function(err) {
  if (err) throw err;
  console.log('File saved to ./saved');
});
}

function DataObject(time, popularity) {
  this.time = time;
  this.popularity = popularity;
}
