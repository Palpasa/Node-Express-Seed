'use strict';

import * as path from 'path';

let currentAPIVersion = process.env.api_version || '',
    apiDocumentFileName = `${currentAPIVersion}apilog.json`,
    apiDocumentLocation = path.join(__dirname, `../../apidoc/${apiDocumentFileName}`);

let hello = {
    api: {
        desc: 'This is quick way to verify if the app is up or not',
        params: {},
        response: '200 with message \'Hello from the other side\''
    },
    protected: false,
    route: '',
    appendFileNameToRoutePrefix: true,
    method: (req, res) => res.json({ msg: 'Hello from the other side!' })
};

let docs = {
    api: {
        desc: 'Returns the published app documentation. This documentation is automatically generated and hence gets updated with every deployment',
        params: {},
        response: '200 with api documents'
    },
    protected: false,
    route: '/apidoc',
    method: (req, res) => {
        let environment = process.env.NODE_ENV;
        if (/local/i.test(environment) || /development/i.test(environment)) {
            res.sendFile(apiDocumentLocation)
        } else {
            res.status(404).end();
        }

    }
};

export let get = [hello, docs];