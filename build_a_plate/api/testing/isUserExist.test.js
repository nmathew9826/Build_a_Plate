const {isUserExist} = require('../../api/v1/validators/userValidator')
const db = require("../utils/db")
jest.setTimeout(10000)
db.connect();

describe('test 3 finding user by Id', () => {

test('testing if the user exists ', async () => {
        
        let id = '62ec9ab1cfbfccd3c5464d79';
        let result = await isUserExist(id);

        expect(result).toBe(true);

 })



})