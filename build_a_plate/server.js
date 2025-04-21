const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const config = require("./api/utils/config");
const db = require("./api/utils/db");
const product = require("./api/v1/controller/product");
const user = require("./api/v1/controller/user");
const { isAdmin, isUserLoggedinAndActive, getCookies } = require("./api/v1/validators/userValidator")
const userDashboard = require("./api/v1/controller/userDashboard");
var cookieParser = require('cookie-parser');
const order = require("./api/v1/controller/order");

const HTTP_PORT = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        dateEqual: function(value, options) {
            let date_ob = new Date(Date.now());
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let current = date_ob.getFullYear() + "-" + month + "-" + date_ob.getDate();
            if(value===current)
            {
                return options.fn(this);            
               
            }
            else{
                return options.inverse(this);                                      
            }
        }
    }
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.use(cookieParser());

// USER SIDE

app.get("/", product.renderHomepage);

app.get("/login", user.renderLoginPage);

app.get("/reset-password/:token", user.renderResetPasswordPage);

app.get("/product-details/:id", product.renderProductDetailsPage);

app.get("/cart", product.renderCartPage);

app.get("/registration", (req, res) => {
    res.render("registration.hbs");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact-us", (req, res) => {
    res.render("contactUs");
});

app.get("/user-dashboard", userDashboard.getUser);


app.get("/forgotPassword", (req, res) => {
    res.render("forgotPassword");
});

app.get("/aboutUS", (req, res) => {
    res.render("aboutUS");
});

app.get("/orderConfirmation/:id", order.renderOrderConfirmationPage);

app.post("/login", user.login);

app.post("/reset-password/:token", user.resetPassword);

app.post("/register", user.register);

app.post("/forgotPassword", user.forgotPassword);

app.get("/userprofile/update", user.getUserProfile)

app.post("/userprofile/update", user.updateUserProfile)

app.post("/contact-us", user.sendContactMail);


// ADMIN SIDE

app.get("/adminDashboard", isAdmin, product.adminDashboard);

app.get("/userDetails/:id", isAdmin, (req, res) => {
    product.userDetail(req.params.id, res)
});

app.get("/adminProductDetails/:id", isAdmin, (req, res) => {
    product.adminProductDetail(req.params.id, res)
});

app.post("/user/update/:id", (req, res) => {
    product.updateUserDetail(req.params.id, res, req.body)
})

app.post("/order", isUserLoggedinAndActive, order.postOrder)

app.post("/product/update/:id", (req,res)=>{
    product.updateProductDetail(req.params.id, res, req.body)
})

db.connect()
    .then(response => {
        console.log(response)
        app.listen(HTTP_PORT, async () => {
            console.log("server listening on port: " + HTTP_PORT);
        });
    })
    .catch(error => {
        console.log(error)
    })
