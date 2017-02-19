'use strict';

import * as fs from 'fs';
import * as path from 'path';

const DIRNAME = __dirname,
    SETTINGS_FILE_NAME = 'app.settings',
    SETTINGS_FILE_PATH = path.join(DIRNAME, `./${SETTINGS_FILE_NAME}`),
    SETTINGS_FILE_REGEX = /(.*;)+/gm,
    KEYVALUE_SEPERATOR_REGEX = /(.*)=(.*)/,
    VALUE_PLACEHOLDERS_FINDER_REGEX = /{.*?}/g;

let
    getSettingsFileContent = () => fs.readFileSync(SETTINGS_FILE_PATH, 'utf8'),
    parseSettingFileIntoKeyValuePair = (settingsFileData) => {
        let keyValStringsArray = settingsFileData.match(SETTINGS_FILE_REGEX),
            keyWhoseValueUsesPlaceHolder = [],
            keyValPair = {};

        //parse all keyvalue pair
        keyValStringsArray.forEach((keyValString) => {
            let matcher = keyValString.match(KEYVALUE_SEPERATOR_REGEX);

            if (matcher) {
                let key = matcher[1].trim(), value = matcher[2].trim().replace(/'|;/g, '');
                keyValPair[key] = value;

                //test if value has placeholder
                if (VALUE_PLACEHOLDERS_FINDER_REGEX.test(value)) {
                    keyWhoseValueUsesPlaceHolder.push(key); //we will get back to you
                }
            }
        });

        return {
            keyval: keyValPair,
            placeholder: keyWhoseValueUsesPlaceHolder
        }
    },
    replacePlaceHolderValuesWithRealValue = (data) => {
        let keyWhoseValUsesPlaceHolder = data.placeholder,
            keyValPair = data.keyval;
        //now we have all the values set, replace all the placeholders in values
        keyWhoseValUsesPlaceHolder.forEach((key) => {
            let value = keyValPair[key],
                placeholders = value.match(VALUE_PLACEHOLDERS_FINDER_REGEX);

            placeholders.forEach((placeHolder) => {
                let placeHolderWithStrippedBraces = placeHolder.replace(/{|}/g, ''),
                    placeHolderReplacementValue = keyValPair[placeHolderWithStrippedBraces];

                if (placeHolderReplacementValue)
                    keyValPair[key] = value.replace(placeHolder, placeHolderReplacementValue);
                else
                    throw new Error(`Value not defined for placeholder ${placeHolder} in ${SETTINGS_FILE_NAME}`)
            })
        })

        return keyValPair;
    },
    setKeyValuePair = () => {
        let keyValPair = replacePlaceHolderValuesWithRealValue(parseSettingFileIntoKeyValuePair(getSettingsFileContent()));
        Object.keys(keyValPair).forEach((key) => process.env[key] = keyValPair[key]);
    };

setKeyValuePair();