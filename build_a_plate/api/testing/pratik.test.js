const { renderLoginPage } = require('./api/v1/controller/user')
const { resetPassword } = require('./api/v1/helpers/userHelper')
const { isProductExist } = require('./api/v1/validators/productValidator')

describe('Pratik - Login', _ => {
    test("testing login page", async _ => {
        const req = {},
            res = { render: jest.fn() }
        await renderLoginPage(req, res)
        console.log(res.render.mock.calls[0][0])
        expect(res.render.mock.calls[0][0]).toBe('login')
    })
})

describe('Pratik - resetPassword', _ => {
    test("testing resetPassword page", async _ => {
        const result = await resetPassword('adasds', 'pass', 'pass')
        console.log(result)
        expect(result).toBe(2)
    })
})

describe('Pratik - isProductExist', _ => {
    test("testing isProductExist page", async _ => {
        const result = await isProductExist('62b08fcf204840842445a4af')
        console.log(result)
        expect(result).toBe(true)
    })
})