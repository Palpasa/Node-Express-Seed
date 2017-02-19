'use strict';

let mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    Schema = mongoose.Schema,
    errorBuilder = require('../config/errorbuilder');


let emailValidator = [
        validate({
            validator: 'isEmail',
            message: 'not a valid email'
        })];

let Person = new Schema({
    fname: {type: String, required: '{PATH} is required'},
    lname: {type: String, required: '{PATH} is required'},
    email: {type: String, required: '{PATH} is required', validate: emailValidator, index: {unique: true}}
}, {minimize: false, autoIndex: false, validateBeforeSave: false, timestamps: {}});

let personEmailRegex = (email) => new RegExp('^' + email + '$', 'i');

Person.statics.findByEmail = (email, fields, successFn, errorFn) => {
    fields = fields || 'fname lname email';
    let emailRegex = personEmailRegex(email);
    mongoose.models['Person'].find({email: {$regex: emailRegex}}, fields)
        .then((success) => {
            let profile = success[0] || {};
            successFn(profile);
        }, (err) => {
            errorFn(err);
        });
};

module.exports = mongoose.model('Person', Person);