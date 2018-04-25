'use strict';

const fileManager = require('./file-manager');
const fileManagerConstants = require('./file-manager-constants');
let googleTrends = require('./node_modules/google-trends-api/lib/google-trends-api.min.js');
let query = 'bitcoin';
let frequency = 1;


getRelatedData(query).catch();


function getRelatedData(query) {
    return new Promise(function (resolve, reject) {
        googleTrends.relatedQueries({
                keyword: query,
                startTime:new Date(Date.now() - (frequency * 60 * 60 * 1000)),
                granularTimeResolution: true
            },function (err, results) {
                if (err) {
                    console.error(err.toString());
                } else {
                    results = JSON.parse(results);
                    let relatedData = results.default;
                    console.log(new Date(Date.now()));
                    console.dir(relatedData, {depth: null, colors: true});

                }
            })

    });

}