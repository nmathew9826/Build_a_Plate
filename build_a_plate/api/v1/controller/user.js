const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../../utils/config.js');

const userHelper = require('../helpers/userHelper')
const contactMailHelper = require('../../utils/contactMailHelper')
const userValidator = require('../validators/userValidator')
const personModel = require('../../models/person');


class User {
    async register(req, res) {
        try {
            console.log(req.body)
            await userHelper.createUser(req.body, req.file);
            res.redirect('/');
        } catch (error) {
            console.log(error)
            if (req.file) { fs.unlink(req.file.path) }
            res.send("Uh Oh! Something went wrong.")
        }
    }
    async renderLoginPage(req, res) {
        res.render('login');
    }
    async login(req, res) {
        try {
            const person = await userValidator.signinValidation(req.body)
            console.log("person", person)
            if (!person) {
                res.render("login.hbs", { error: "Incorrect credentials" })
            } else {
                const email = req.body.email
                const token = jwt.sign({ email: email }, config.jwtSecretKey, {
                    expiresIn: 86400
                });
                res.cookie('token', token);
                if (person.is_admin) {
                    res.redirect('/adminDashboard')
                } else {
                    res.redirect('/')
                }
            }
        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }
    async forgotPassword(req, res) {
        try {
            let isMailSent = await userHelper.forgotPassword(req.body.email)
            if (!isMailSent) {
                res.render('forgotPassword.hbs', { errorMessage: 'Please enter valid email' })
            } else {
                res.render('forgotPassword.hbs', { successMessage: 'Please check your email for further instruction' })
            }
        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }
    async renderResetPasswordPage(req, res) {
        res.render("resetPassword", { token: req.params.token });
    }
    async resetPassword(req, res) {
        try {
            console.log(req.body)
            const status = await userHelper.resetPassword(req.params.token, req.body.password, req.body.confirmPassword)
            console.log(status)
            if (status == 0) {
                res.render("resetPassword.hbs", { error: "password and confirm password didn't mach" })
            } else if (status == 1) {
                res.render("resetPassword.hbs", { error: "Link is invalid" })
            } else if (status == 2) {
                res.redirect("/login");
            }
        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async sendContactMail(req, res) {
        try {
            await contactMailHelper.sendMail(req.body).then(
                res.render("contactUs", { message: "Your query has been submitted" })
            );

        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async updateUserProfile(req, res) {
        try {
            console.log(req.body)
            var query = { _id: req.body.id }
            var newValues = {
                $set:
                {
                    person_name: req.body.userName,
                    person_email: req.body.email,
                    person_phone: req.body.phone,
                    person_address: req.body.addressStreet,
                    city: req.body.addressCity,
                    province: req.body.addressProvince,                    
                    postal_code: req.body.addressPostalCode,
                }
            }
            await personModel.updateOne(query, newValues)
            res.redirect("/user-dashboard");

        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async getUserProfile(req, res) {
        let email;

        try {
            jwt.verify(req.cookies['token'], config.jwtSecretKey, function (err, decoded) {
                if (err) throw err;
                email = decoded.email;
            })
            const person = await personModel.find({ person_email: email }).lean();
            res.render("updateUserDetails", person[0])

        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }
}

module.exports = new User()