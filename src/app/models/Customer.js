const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const CustomerSchema = new Schema({
    customerName: { type: String, required: true },
    address: { type: String},
    phoneNumber: {type: String}
});

CustomerSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Customer', CustomerSchema, 'customer');
