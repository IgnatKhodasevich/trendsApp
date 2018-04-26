let DOC = require('dynamodb-doc');
let dynamo = new DOC.DynamoDB();
let googleTrends = require('./node_modules/google-trends-api/lib/google-trends-api.min.js');

exports.handler = function(event, context) {
    let query = 'bitcoin';
    getRelatedData(query).catch(err => {
        console.log(err);
    });
};


//Frequency of delivery of data from google in hours
let frequency = 1;


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
                    let relatedData = results.default.rankedList[0];
                    // console.dir(relatedData, {depth: null, colors: true});
                    for (let i = 1; i < relatedData.rankedKeyword.length; i++) {
                        let item = {
                            Query: query,
                            relatedQuery: relatedData.rankedKeyword[i].query,
                            Date: new Date(Date.now() - (frequency * 60 * 60 * 1000)),
                            popularity: relatedData.rankedKeyword[i].formattedValue
                        };
                        let callback = function(err, data) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(data);

                            }
                        };
                        dynamo.putItem({ TableName: "relatedPopularity", Item: item }, callback);
                    }

                }
            })

    });

}