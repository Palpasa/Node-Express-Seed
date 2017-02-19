'use strict';


let helper = require('../helper'),
    request = require('supertest'),
    app = require('../../app');

describe('Person controller test', () => {

    let personPrefix = helper.getApi1URL('person/');

    describe('Register a person', () => {

        let registerPrefix = personPrefix + 'register/';
        let firstName = 'firstName', lastName = 'lastName', email = helper.generateEmail();

        it('Can create a person', (done) => {
            let payLoad = {
                firstName: firstName,
                lastName: lastName,
                email: email
            };

            request(app)
                .post(registerPrefix)
                .send(payLoad)
                .expect(201, done);
        });

        it('Retrieve a person by email', (done) => {
            let endPoint = personPrefix + email;

            request(app)
                .get(endPoint)
                .expect(200)
                .end((err, res) => {
                    if(err){
                        return done(err);
                    }

                    let response = res.body;
                    expect(response.email).toBe(email);
                    expect(response.fname).toBe(firstName);
                    expect(response.lname).toBe(lastName);
                    done();
                });
        });

    });
});