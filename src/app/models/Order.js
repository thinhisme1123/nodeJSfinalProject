const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const OrderSchema = new Schema({
    phoneNumber: { type: String, required: true },
    totalAmount: { type: String, default: '' },
    givenAmount: { type: String },
    change: { type: String },
    dateBuy: {
        type: Date,
        default: Date.now,
        get: function () {
            // Adjust the time zone to 'Asia/Bangkok' (GMT+7)
            const options = { timeZone: 'Asia/Bangkok', hour12: false };
            
            // Format the date to 'hh:mm DD/MM/YY'
            return new Date(this.createdAt).toLocaleString('en-US', options);
        }
    },
    amount: { type: String }
});

OrderSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Order', OrderSchema, 'order');
