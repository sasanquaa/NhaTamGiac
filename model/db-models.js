const Schema = require('mongoose').Schema;
const Model = require('mongoose').model;

//Schemas

const UserSchema = new Schema({
    _id: String,
    username: String,
    email: String,
    password: String,
    permission: Array
});

const ProductSchema = new Schema({
    _id: String,
    name: String,
    brand: String,
    images: Array,
    avail: Boolean,
    price: Number,
    type: String,
    size: Array,
    release: Date,
    description: String
});

const PaymentSchema = new Schema({
    _id: String,
    payments: [new Schema({
        _id: Number,
        username: String,
        phone: String,
        address: String,
        dtype: Number,
        ptype: Number,
        total: Number,
        date: Date
    })]
});

const UserReportSchema = new Schema({
    _id: String,
    reports: [new Schema({
        _id: Number,
        title: String,
        orderid: String,
        contents: String,
        date: Date
    })]
});

//Models

const User = Model('User', UserSchema, 'users');
const Product = Model('Product', ProductSchema, 'products');
const Payment = Model('Payment', PaymentSchema, 'payments');
const UserReport = Model('UserReport', UserReportSchema, 'reports' )

module.exports.User = User;
module.exports.Product = Product;
module.exports.UserReport = UserReport;
module.exports.Payment = Payment;
