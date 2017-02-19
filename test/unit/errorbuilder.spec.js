'use strict';

var errorBuilder = require('../../config/errorbuilder');

describe('Error builder', () => {

    it('Can build error when error object is sent', () => {
        let errorMsg = 'Error object test', type = 'unit test';
        let error = new Error(errorMsg);
        let errorBuilt = errorBuilder.buildLairError(error, type);
        expect(errorBuilt instanceof Error).toBe(true);
        expect(errorBuilt.message).toBe(errorMsg);
        expect(errorBuilt.app).toBe('LAIR');
        expect(errorBuilt.type).toBe(type);
    });

    it('Can build error when string is sent', () => {
        let errorMsg = 'String error test', type = 'unit test';
        let errorBuilt = errorBuilder.buildLairError(errorMsg, type);
        expect(errorBuilt instanceof Error).toBe(true);
        expect(errorBuilt.message).toBe(errorMsg);
        expect(errorBuilt.app).toBe('LAIR');
        expect(errorBuilt.type).toBe(type);
    });

    it('Can handle the case where error message is undefined and type is not set', () => {
        let errorBuilt = errorBuilder.buildLairError();
        expect(errorBuilt instanceof Error).toBe(true);
        expect(errorBuilt.message).toBe('Error message was not set');
        expect(errorBuilt.app).toBe('LAIR');
        expect(errorBuilt.type).toBe('LAIR_DEFAULT');
    });


    it('Can handle the case where error message is empty and type is not set', () => {
        let errorBuilt = errorBuilder.buildLairError('');
        expect(errorBuilt instanceof Error).toBe(true);
        expect(errorBuilt.message).toBe('Error message was not set');
        expect(errorBuilt.app).toBe('LAIR');
        expect(errorBuilt.type).toBe('LAIR_DEFAULT');
    });

    it('Can handle the case where error message is empty BUT type is set', () => {
        let type = 'unit test';
        let errorBuilt = errorBuilder.buildLairError('', type);
        expect(errorBuilt instanceof Error).toBe(true);
        expect(errorBuilt.message).toBe('Error message was not set');
        expect(errorBuilt.app).toBe('LAIR');
        expect(errorBuilt.type).toBe(type);
    });


});