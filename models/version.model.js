const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Version:
 *       type: object
 *       required:
 *         - android
 *         - ios
 *         - description
 *       properties:
 *         android:
 *           type: string
 *           description: Version Android de l'application
 *         ios:
 *           type: string
 *           description: Version iOS de l'application
 *         description:
 *           type: string
 *           description: Description des changements de cette version
 */

const versionSchema = new Schema({
  android: { type: String, required: true },
  ios: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true, versionKey: false });

module.exports.Version = model('Version', versionSchema); 