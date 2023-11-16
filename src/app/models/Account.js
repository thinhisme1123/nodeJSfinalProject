const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
//nếu muốn thêm _id tự động từ mongo tạo cho thì không cần phải khai báo _id

const AccountSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, default: '' },
    role: { type: String },
});

AccountSchema.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model('Account', AccountSchema, 'account');
