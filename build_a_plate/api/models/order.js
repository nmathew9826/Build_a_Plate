const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    "product_id": [{ type: Schema.Types.ObjectId, ref: 'product' }],
    "quantity": Number,
    "schedule": String,
    "selling_price": Number
}, { _id: false })

const orderSchema = new Schema({
    id: ObjectId,
    order_date: { type: Date, default: Date.now() },
    customer_id: { type: Schema.Types.ObjectId, ref: 'person' },
    customer_name: { type: Schema.Types.String, ref: 'person' },
    tax_rate: { type: Number, default: 13 },
    products: [productSchema]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 