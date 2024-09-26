const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    libele: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Category = model('Category', categorySchema);