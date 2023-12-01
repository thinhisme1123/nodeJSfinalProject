const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const OrderSchema = new Schema({
    cusID: { type: String, required: true },
    staffID: { type: String, required: true },
    totalAmount: { type: String, default: '' },
    givenAmount: { type: String },
    change: { type: String },
    dateBuy: { type: Date, default: Date.now },
    amount: { type: String }
});

OrderSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Order', OrderSchema, 'order');
