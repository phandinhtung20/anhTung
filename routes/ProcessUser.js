var express		= require('express'),
    router 		= express.Router(),
	userDB		= require('../db/UserInfo'),
	regionDB	= require('../db/Regions'),
	async 		= require('async'),
	constant	= require('../configAndConstant/Constant.js'),
	error		= require('../configAndConstant/Error').USER_ERROR,
	mongoose	= require('mongoose');

router.post("/", function(req,res){
	async.waterfall([
		function(cb) { // Check validate
			if (req.body.ageId 		== undefined ||
				req.body.sexId 		== undefined ||
				req.body.regionId 	== undefined ||
				constant.sex[req.body.sexId] == undefined||
				constant.age[req.body.ageId] == undefined||
				!mongoose.Types.ObjectId.isValid(req.body.regionId)) {
				cb(error.REQ_INFO_WRONG);
			} else {
				cb(null);
			}
		},
		function(cb) { // Check regionID
			regionDB.findRegion(req.body.regionId, function(err, doc) {
				if (err) {
					cb(regionError.QUERY_DB_ERROR)
				} else {
					if (doc == null) {
						cb(regionError.REGION_ID_INVALID)
					} else {
						cb(null)
					}
				}
			});
		},
		function(cb) { // Check email user
			userDB.findUserByEmail(req.body.email, function(err, id) {
				if (err == null) {
					cb(null);
				} else {
					if (err.code == error.USER_EXIST.code) {
						res.send({
							status: 200,
							message: id
						});
					} else {
						cb(err);
					}
				}
			})
		},
		function(cb) { // Save user
			var user = userDB({
				email	: req.body.email,
				regionId: req.body.regionId,
				ageId	: req.body.ageId,
				sexId	: req.body.sexId
			});
			userDB.saveUser(user, function(err, docs) {
				if (err) {
					console.log(err)
					cb(error.QUERY_DB_ERROR);
				} else {
					res.send({
						status: 200,
						message: docs.id
					});
				}
			})
		}], function(err) {
			res.send({
				status: 400,
				message: err.message
			});
		});
})

router.get("/options", function(req,res) {
	// gui len email
	// response

	// {
	// 	status: 200
	// message: {
	// 	sexId,
	// 	ageId,
	// 	userId,
	// 	regionId	
	// }
	//
	// }
	// status 201 => ko cos
	// status 200 => co, message chua id cua email
})

router.get("/", function(req,res) {
	res.render('createUser')
})

module.exports = router;