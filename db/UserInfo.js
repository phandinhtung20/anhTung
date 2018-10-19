var mongoose= require('mongoose'),
	error	= require('../configAndConstant/Error').ERROR,
	errorUser= require('../configAndConstant/Error').USER_ERROR;

var userSch= mongoose.Schema({
	email: {
		type: String,
        required: true,
		default: ''
	},
	regionId: {
		type: mongoose.Schema.Types.ObjectId,
        required: true
	},
	ageId: {
		type: Number,
        required: true,
		default: 0,
        min: 0,
        max: 8
	},
	sexId: {
		type: Number,
        required: true,
		default: 0,
        min: 0,
        max: 2
	}
});

user = module.exports= mongoose.model('user', userSch);

module.exports.saveUser= function(scr, cb){
	scr.save(cb);
};

module.exports.findUser= function(userID, callback) {
	if (!mongoose.Types.ObjectId.isValid(userID)) {
		callback(error.USERID_INVALID);
	}
	user.findById(userID, function(err, user) {
		if (err) {
			callback(error.QUERY_DB_ERROR);
		} else {
			if (user == null) {
				callback(error.USER_UNDEFINED);
			} else {
				callback(null);
			}
		}
	})
};

module.exports.findUserByEmail= function(email, callback) {
	user.findOne({email: email}, function(err, user) {
		if (err) {
			callback(errorUser.QUERY_DB_ERROR, null);
		} else {
			if (user == null) {
				callback(null, null);
			} else {
				callback(errorUser.USER_EXIST, user._id);
			}
		}
	})
};
