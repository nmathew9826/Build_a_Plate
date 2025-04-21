const productModel = require("../../models/product")
const userModel = require("../../models/person")
const orderModel = require("../../models/order")

class Product {
    async renderProductDetailsPage(req, res) {
        const product = await productModel.findById(req.params.id).lean()
        console.log(product)
        res.render("productDetails", { product });
    }
    async renderHomepage(req, res) {
        try {
            const products = await productModel.find({}).lean()
            res.render("home", { products });
            return true
        } catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
            return false
        }
    }
    async renderCartPage(req, res) {
        res.render("cart");
    }

    async adminDashboard(req, res) {
        try {
            const products = await productModel.find({}).lean()
            const users = await userModel.find({ is_admin: false }).lean()
            const orders = await orderModel.find({}).lean()
            res.render("adminDashboard", { products, users, orders });
        }
        catch (error) {
            //console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async userDetail(id, res) {
        try {
            const user = await userModel.findById(id).lean()
            const pastOrder = await orderModel.findOne({ customer_id: id }).lean()
            //console.log(pastOrder)
            res.render("userDetails", { user, pastOrder });
        }
        catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async adminProductDetail(id, res) {
        try {
            const product = await productModel.findById(id).lean()
            res.render("adminProductDetails", { product });
        }
        catch (error) {
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async updateUserDetail(id,res,details){
        try{
            let flag;
            if(details.is_active=="on"){
                    flag = true;
            }
            else{
                flag = false;
            }
            var query = {_id:id};
            var newValues = { $set: 
                {
                    person_name : details.person_name,
                    person_email : details.person_email,
                    person_phone : details.person_phone,
                    person_address : details.person_address,
                    city : details.city,
                    province: details.province,
                    postal_code : details.postal_code,
                    is_active : flag
                }}
            await userModel.updateOne(query, newValues)
            res.redirect("/adminDashboard")
        }
        catch(error){
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }

    async updateProductDetail(id,res,details){
        try{
            var query = {_id:id};
            console.log(details)
            var newValues = { $set: 
                {
                    product_name : details.product_name,
                    product_description: details.product_description,
                    product_price : details.product_price,
                }}
            await productModel.updateOne(query, newValues)
            res.redirect("/adminDashboard")
        }
        catch(error){
            console.log(error)
            res.send("Uh Oh! Something went wrong.")
        }
    }
}

module.exports = new Product()