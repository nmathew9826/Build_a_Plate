const {forgotPassword} = require("../../api/v1/controller/product")
const db = require("../utils/db")
jest.setTimeout(10000)
db.connect();




describe('test 2 - sending invalid email for forgetting password', () => {

    test('testing forgot password invalid email ', async () => {

        const req = {body: { email : 'invalidemail@myseneca.ca'}},

        res = {render: jest.fn()} 
        let result = await forgotPassword(req, res);

        expect(result).toBe(false);

 })



})