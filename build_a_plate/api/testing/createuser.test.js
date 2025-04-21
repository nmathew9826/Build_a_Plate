const { JsonWebTokenError } = require('jsonwebtoken');
const {createUser} = require('../../api/v1/helpers/userHelper');
const db = require("../utils/db")
const {homepage} = require("../../api/v1/controller/product")

const {forgotPassword} = require('../../api/v1/helpers/userHelper')

jest.setTimeout(10000)

db.connect();

describe('Test 1 - createuser() function', ()=>{
    test('returns true if the user is created', async ()=>{
        let user = {
            fullname: 'Vedha Ragavan',
            address: '123 easy street',
            pcity: 'Toronto',
            pstate: 'Ontario',
            country: 'Canada',
            pzip: 'M1E 0B8',
            email: 'testing@myseneca.ca',
            password: 'Vedha.321',
            pphonenumber: '9876541230'
                    }
        let result = await(createUser(user));
        expect(result).toBe(true);
    })
})




