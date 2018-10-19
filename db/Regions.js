var mongoose	= require('mongoose'),
	regionError	= require('../configAndConstant/Error').REGION_ERROR;

var regionSch= mongoose.Schema({
	region: {
		type: String,
		default: ''
	}
});

var region = module.exports = mongoose.model('regions', regionSch);

module.exports.findRegion = function(id, callback) {
	region.findById(id, callback)
}