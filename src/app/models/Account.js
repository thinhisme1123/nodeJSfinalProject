const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Account = new Schema({
    _id: { type: Schema.Types.ObjectId },
    username: { type: String, require:true},
    password: { type: String},
}, {
    _id: false,
});

// tham số cuối cùng là tên của collection trong db 
module.exports = mongoose.model('Model', Account, 'account')