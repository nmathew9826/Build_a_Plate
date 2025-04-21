/*
   tests prepared by:  Neenu Mathew
*/


const { homepage } = require('../v1/controller/product');
const db = require("../utils/db");
jest.setTimeout(50000);

db.connect();

describe('test 2 - rendering products in homepage', () => {
    test('testing home page', async () => {
        const req = {},
            res = { render: jest.fn() }
        let result = await homepage(req, res);
        expect(result).toBe(true);

    })
})