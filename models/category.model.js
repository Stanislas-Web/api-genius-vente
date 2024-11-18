const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 */
const categorySchema = new Schema({
  name: { type: String, required: true },
  nameEnglish: { type: String, required: true },
}, { timestamps: true, versionKey: false });

module.exports.Category = model('Category', categorySchema);
