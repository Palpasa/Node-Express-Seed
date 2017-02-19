'use strict';


let exp = {};


exp.buildLairError = (error, type) => {

    let lairError;

    if(typeof error === 'object'){
        lairError = error;

    }else if(typeof error === 'string' && error != ''){
        lairError = new Error(error);

    }else{
        lairError = new Error('Error message was not set');
    }

    lairError.type = type || "LAIR_DEFAULT";
    lairError.app = "LAIR";
    return lairError;
};

module.exports = exp;