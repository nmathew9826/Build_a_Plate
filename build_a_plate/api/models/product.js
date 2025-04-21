const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ingredientSchema = new Schema({
    name: String,
    quantity: String
}, { _id: false })

const productSchema = new Schema({
    id: ObjectId,
    product_name: String,
    product_description: String,
    product_price: Number,
    ingredients: [ingredientSchema]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 