/*
   tests prepared by:  Neenu Mathew
*/

const { forgotPassword } = require('../v1/helpers/userHelper');
const {signinValidation} = require('../v1/validators/userValidator');
const db = require("../utils/db");
jest.setTimeout(50000);

db.connect();


describe('test 1 - forgotPassword() function', () => {
    test('testing forgot password fn', async () => {

        let email = 'nmathew10@myseneca.ca';
        let result = await(forgotPassword(email))
        expect(result).toBe(true);
    })
})


describe('test 2 - signinValidation function', () => {
    test('testing validation of credentials', async () => {

        let id = {
            email:'nmathew10@myseneca.ca',
            password:'password'
        };
        let result = await(signinValidation(id))
        expect(result).toBe(true);
    })
})