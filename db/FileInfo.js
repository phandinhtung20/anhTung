var mongoose= require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var fileSch= mongoose.Schema({
	userId: ObjectId,
	scripId: ObjectId,
	scriptInfo: {
		type: String,
		default: ''
	}
});

var file = module.exports= mongoose.model('file', fileSch);

module.exports.saveFile= function(scr, callback){
  scr.save(callback);
}

module.exports.saveFiles= function(files, callback){
	file.insertMany(files, callback);
}