'use strict';

const fileManager = require('./file-manager');
const fileManagerConstants = require('file-manager-constants');
const axios = require('axios');

axios.get('https://poloniex.com/public?command=returnChartData&currencyPair=USDT_BTC&end=9999999999&period=300&start=1405699200')
    .then(response => {
        console.log(response.data[0]);
        const fieldsPoloniex = ['date', 'high', 'low', 'open', 'close', 'volume', 'quoteVolume','weightedAverage'];
        for (let i = 0; i < 2; i++) {
            fileManager.createCSV(fieldsPoloniex, response.data)
                .then(result => {
                    fileManager.createAndDownloadFile(result, fileManagerConstants.ANALYTICS,
                        fileManagerConstants.ANALYTICS_CSV, 'poloniex')
                        .catch(error => {
                                console.log(error);
                            }
                        )
                });
        }
    })
    .catch(error => {
        console.log(error);
    });