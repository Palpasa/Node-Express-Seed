'use strict';

import * as Person from '../model/person';

let registerAPerson = {
    api: {
        desc: 'Create an account for a person',
        params: {
            firstName: 'Required. Should be string',
            lastName: 'Required. Should be string',
            email: 'Required. Should be String and same as the profile email.'
        },
        response: 'Http status code of 201 means profile was created.'
    },
    route: 'user/register',
    protected: false,
    method: async (req, res, next) => {
        try {
            await Person.registerUser();
        } catch (err) {
            next(err);
        }

    }
};

let getAPerson = {
    api: {
        desc: 'Create an account for a person',
        params: {
            email: 'Required. Should be String and same as the profile email.'
        },
        response: 'Returns profile object'
    },
    route: ':email',
    protected: false,
    method: (req, res, next) => {

        let success = (profile) => {
            let profileFound = profile.email;
            if (profileFound) {
                res.status(200).json(profile);
            } else {
                next(errorBuilder.buildLairError('Profile not found', 'ITEM_NOT_FOUND'));
            }
        },
            error = next;

        Person.findByEmail(req.params.email, null, success, error);
    }
};

export let get = [getAPerson];
export let post = [registerAPerson];