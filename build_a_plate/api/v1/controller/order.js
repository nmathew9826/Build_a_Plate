const orderModel = require("../../models/order")

class Order {
    async postOrder(req, res) {
        try {
            
            const data = {
                customer_id: req.user_id,
                customer_name: req.user_name,
                products: req.body.products
            };
            console.log(data)
            const order = await orderModel.create(data)
            console.log(order)
            res.json({ order_id: order._id })
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ code: 0 })
        }
    }
    async renderOrderConfirmationPage(req, res) {
        const order = await orderModel.findById(req.params.id).lean()
        console.log(order)
        res.render("orderConfirmation", { order });
    }
}

module.exports = new Order()