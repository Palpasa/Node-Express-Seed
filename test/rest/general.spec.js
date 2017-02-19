'use strict';


let helper = require('../helper'),
    request = require('supertest'),
    app = require('../../app');


describe('General Endpoint test', () => {

    let prefixForGeneralEndpoint = helper.getApi1URL('general/');

    it('Verify Hello endpoint works', (done) => {
        let endPoint = prefixForGeneralEndpoint;
        request(app)
            .get(endPoint)
            .expect(200, done);
    });

    it('Verify API Documentation endpoint works', (done) => {
        let endPoint = prefixForGeneralEndpoint + 'docs/';
        request(app)
            .get(endPoint)
            .expect(200, done);
    });
});

