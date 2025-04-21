const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../../utils/config.js');
const personModel = require('../../models/person');
const orderModel = require('../../models/order');

class UserDashboard {
    async getUser(req, res) {
        let user_id;
        let email;
        const token = req.cookies['token'];
        try {
            if (token == undefined || token =='') {
                res.render("login");
            }
            else {
                jwt.verify(req.cookies['token'], config.jwtSecretKey, function (err, decoded) {
                    if (err) throw err;
                    email = decoded.email;
                })
                try {

                    const person = await personModel.find({ person_email: email }).lean();
                    user_id = person[0]._id;
                    const order = await orderModel.find({ customer_id: user_id }).lean();

                    res.render("userDashboard", { person: person[0], order: order });

                } catch (error) {
                    console.log(error)
                    return promise.reject(error)
                }
            }

        } catch (error) {
            console.log(error)
            return promise.reject(error)
        }
    }
}

module.exports = new UserDashboard();
