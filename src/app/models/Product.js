const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const ProductSchema = new Schema({
    productName: { type: String, required: true },
    category: { type: String, default: '' },
    brand: { type: String },
    importPrice: { type: String },
    price: { type: String },
    description: { type: String },
    quantity: { type: String },
    createdBy: { type: String },
    image: { type: String }
});

ProductSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Product', ProductSchema, 'product');
