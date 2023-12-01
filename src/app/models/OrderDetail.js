const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const OrderDetailSchema = new Schema({
    namePro: { type: String, default: '' },
    order: { type: String },
    pricePro: { type: String },
    amountOrder: { type: String }
});

OrderDetailSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('OrderDetail', OrderDetailSchema, 'orderdetail');
