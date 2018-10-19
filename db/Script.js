var mongoose= require('mongoose'),
	error	= require('../configAndConstant/Error').SCRIPT_ERROR;

var scriptSch= mongoose.Schema({
	script: {
		type: String,
		default: ''
	}
});

var script = module.exports= mongoose.model('script', scriptSch);

module.exports.saveScript= function(scr, callback){
  	scr.save(callback);
}

module.exports.findInListId= function(id1, id2, id3, callback){
	script.find({'_id': { $in: [
		mongoose.Types.ObjectId(id1),
		mongoose.Types.ObjectId(id2), 
		mongoose.Types.ObjectId(id3)
	]}}, function(err, docs){
		if (docs == null || docs.length < 3) {
			callback(error.SCRIPT_ERROR);
		} else {
			callback(error.null);
		}
	});
}

module.exports.getLength = function(callback) {
	script.countDocuments({}, callback)
}

module.exports.getRandom = function(skip, limit, callback) {
	script.find().skip(skip).limit(limit).exec(callback);
}