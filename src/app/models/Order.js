const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const OrderSchema = new Schema({
    productName: { type: String, required: true },
    category: { type: String, default: '' },
    brand: { type: String },
    price: { type: String },
    description: { type: String },
    quantity: { type: String },
    createdBy: { type: String },
    image: { type: String }
});

OrderSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Order', OrderSchema, 'order');
