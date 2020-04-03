var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
   	mediaId:Number,
	media:String,
	added_date:{
		type: Date,
		default: Date.now
	}
}, { versionKey: false });
module.exports = mongoose.model('media', mediaSchema);  