'use strict';

var mongoClient = require('mongodb').MongoClient;

/**
 *
 * @param endpoint endpoint should not start with /. It will be appended
 */
let getApi1URL = (endpoint) => '/api1/' + endpoint;
let generateRandomEmail = () => {

    let email = '';
    let possible = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    for (let i = 0; i < 15; i++) {
        email += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return email + '@test.com';
};

let generateRandomString = (length) => {
    length = length || 20;

    let email = '';
    let possible = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
        email += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return email;
};

let talkToMongo = () => {

    return new Promise((resolve, reject) => {
        //mongo client document https://docs.mongodb.org/getting-started/node/client/
        let localTestURL = 'mongodb://localhost:27017/seedresttest';
        mongoClient.connect(localTestURL, function (err, db) {
            if (err) {
                reject(Error('Error in helper file to connect to mongodb.\n ' + err));
            }else{
                resolve(db);
            }
        });
    });
};

let emptyCollection = () => {
    talkToMongo()
    .then((db) => {
        db.dropDatabase();
        db.close();
    })
};


let init = () => {
    emptyCollection()
};

init();

module.exports = {
    getApi1URL: getApi1URL,
    generateEmail: generateRandomEmail,
    generateString: generateRandomString,
    talkToMongoDB: talkToMongo
};