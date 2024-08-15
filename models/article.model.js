const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const articleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Double, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String, required: true },
    merchantPhotoUrl: { type: String, required: true },
    merchantName: { type: String, required: true },
    quantity: { type: Number, required: true },
},{timestamps: true, versionKey: false });

module.exports.Article = model('Article', articleSchema);