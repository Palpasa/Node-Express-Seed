'use strict';

import express from 'express';
import path from 'path';
import fs from 'fs';

const DIRNAME = __dirname;

let environment = process.env.NODE_ENV,
    currentAPIVersion = process.env.api_version || '',
    gloablSettingsToAppendCtrlFileNameToAllRoute = /true/i.test(process.env.append_controller_filename_to_all_route),
    allRoutesAPIVersionPrefix = currentAPIVersion ? `/${currentAPIVersion}` : '',
    apiDocumentFileName = `${currentAPIVersion}apilog.json`,
    apiDocumentLocation = path.join(DIRNAME, `../../apidoc/${apiDocumentFileName}`),
    ctrlDirPath = path.join(DIRNAME, '../controller'),
    appInfo = {
        openRoutes: {},
        protectedRoute: {},
        ctrlFiles: []
    };

let readCtrlDirForRouteInfoAndApiDoc = () => {
    // I really mean synchronous code here. This is not a mistake
    fs.readdirSync(ctrlDirPath).forEach(function (aFileInCtrlDir) {

        let controllerFileName = '/' + aFileInCtrlDir.split('.')[0],
            controllerContent = require(ctrlDirPath + '/' + aFileInCtrlDir);

        appInfo.ctrlFiles.push(controllerFileName);

        Object.keys(controllerContent).forEach((httpVerb) => {

            controllerContent[httpVerb].forEach((apiDocAndCallbackFn) => {

                let data = {
                    httpVerb: httpVerb,
                    aRequestAPIDocAndCallbackFn: apiDocAndCallbackFn
                };

                let isProtectedRoute = apiDocAndCallbackFn.protected && apiDocAndCallbackFn.protected == true;
                if (isProtectedRoute) {
                    if (!appInfo.protectedRoute[controllerFileName]) {
                        appInfo.protectedRoute[controllerFileName] = [];
                    }
                    appInfo.protectedRoute[controllerFileName].push(data);
                } else {
                    if (!appInfo.openRoutes[controllerFileName]) {
                        appInfo.openRoutes[controllerFileName] = [];
                    }
                    appInfo.openRoutes[controllerFileName].push(data);
                }

            });
        });
    });
};

let enableRouteProtection = (req, res, next) => {

    console.log(`********************************************************************************************************************\n
            This log is coming from router.index.js file.\n
            All the code where protected flag is set to true will execute this code.\n
            The purpose of this function should be something as auth token validation or something related to verifying request.\n
            *************************************************************************************************************************\n`)
    next();
};

let getApiRoute = (controllerFileName, apiDescription) => {

    //controllerFileName already has / appended in the front 
    let localSettingsToAppendCtrlFileNameToRoutePrefix = apiDescription.appendFileNameToRoutePrefix === undefined ? false : /true/i.test(apiDescription.appendFileNameToRoutePrefix),
        addCtrlFileNameToRoutePrefix = localSettingsToAppendCtrlFileNameToRoutePrefix || gloablSettingsToAppendCtrlFileNameToAllRoute,
        routeDefinedInControllerFileName = /^\/.*/.test(apiDescription.route) ? apiDescription.route : `/${apiDescription.route}`;
    return addCtrlFileNameToRoutePrefix ?
        allRoutesAPIVersionPrefix + controllerFileName + routeDefinedInControllerFileName :
        allRoutesAPIVersionPrefix + routeDefinedInControllerFileName;

};

let registerRoute = (app, routeObject) => {

    Object.keys(routeObject).forEach((controllerFileName) => {

        routeObject[controllerFileName].forEach((description) => {

            let httpVerb = description.httpVerb,
                aRequestAPIDocAndCallbackFn = description.aRequestAPIDocAndCallbackFn,
                fnToExecute = aRequestAPIDocAndCallbackFn.method,
                newRoute = getApiRoute(controllerFileName, aRequestAPIDocAndCallbackFn);

            if (/true/i.test(aRequestAPIDocAndCallbackFn.protected)) {
                app[httpVerb](newRoute, enableRouteProtection, fnToExecute);
            } else {
                app[httpVerb](newRoute, fnToExecute);
            }
        });
    })
};

let writeAPIDocument = () => {
    if (/local/i.test(environment) || /development/i.test(environment)) {
        //generate api document only for local and development environment

        let apiDocContent = {};

        appInfo.ctrlFiles.forEach((controllerFileName) => {
            apiDocContent[controllerFileName] = [];

            let allRoutes = [];
            let protectedRouteDesc = appInfo.protectedRoute[controllerFileName];
            let openRoutesDesc = appInfo.openRoutes[controllerFileName];

            if (protectedRouteDesc) {
                allRoutes = allRoutes.concat(...protectedRouteDesc);
            }

            if (openRoutesDesc) {
                allRoutes = allRoutes.concat(...openRoutesDesc);
            }

            allRoutes.forEach((aRoute) => {
                let aRequestAPIDocAndCallbackFn = aRoute.aRequestAPIDocAndCallbackFn,
                    apiDocument = {
                        HTTPVerb: aRoute.httpVerb,
                        api: aRequestAPIDocAndCallbackFn.api,
                        endpoint: getApiRoute(controllerFileName, aRequestAPIDocAndCallbackFn),
                        protected: aRequestAPIDocAndCallbackFn.protected
                    };
                apiDocContent[controllerFileName].push(apiDocument);
            });
        });

        fs.writeFile(apiDocumentLocation, JSON.stringify(apiDocContent), (err) => {
            if (err) throw err;
        });
    }
};

let cleanUp = () => appInfo = {};

export let init = (app) => {
    readCtrlDirForRouteInfoAndApiDoc()
    registerRoute(app, appInfo.openRoutes);
    registerRoute(app, appInfo.protectedRoute);
    writeAPIDocument();
    cleanUp();
};