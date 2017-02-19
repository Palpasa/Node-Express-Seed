'use strict';
//read more @ http://mongoosejs.com/docs/connections.html


let mongoose   = require('mongoose');

let envBasedURL = {
    development : {
        url: 'mongodb://localhost:27017/seed'
    },
    test : {
        url : 'mongodb://localhost:27017/seedresttest'
    }
};

let env = process.env.NODE_ENV;

let init = () =>{

    // let dbUrl = envBasedURL[env];
    // if(!dbUrl){
    //     console.log('DATABASE connection url not configured!! Exiting the app!');
    //     process.exit(1);
    // }
    // connect to our database
    //mongoose.connect(dbUrl.url);
    //mongoose.set('debug', true);
};



init();