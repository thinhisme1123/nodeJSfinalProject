const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const BrandSchema = new Schema({
    brandName: { type: String, required: true },
    image: { type: String },
    category: { type: String, default: ''  }
});

BrandSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Brand', BrandSchema, 'brand');
