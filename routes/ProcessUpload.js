var express		= require('express'),
    router 		= express.Router(),
    objectId	= require('mongoose').Types.ObjectId,
	fileDB		= require('../db/FileInfo'),
	userDB		= require('../db/UserInfo'),
	scriptDB	= require('../db/Script'),
	regionDB	= require('../db/Regions'),
	multer  	= require('multer'),
	async 		= require('async'),
	diskStorage = require('../configAndConstant/Config'),
	constant 	= require('../configAndConstant/Constant'),
	childProcess= require("child_process"),
	upload 		= multer({dest: 'uploads/', storage: diskStorage.storage});

router.post("/", upload.fields(
	[
		{
			name: 'file1',
			maxCount: 1
		},{
			name: 'file3',
			maxCount: 1
		},{
			name: 'file2',
			maxCount: 1
		}
	]), function(req,res){
		console.log(req.files);
		console.log(req.body);
		var sexId = req.body.sexId,
			ageID = req.body.ageId,
			regionId = req.body.regionId;
		if ( constant.sex[sexId] == undefined ||
			 constant.age[ageID] == undefined ||
			!objectId.isValid(req.body.regionId) ||
			!objectId.isValid(req.body.idScript1) ||
			!objectId.isValid(req.body.idScript2) ||
			!objectId.isValid(req.body.idScript3) ||
			req.files.file1 == undefined ||
			req.files.file2 == undefined ||
			req.files.file3 == undefined
			) {
				console.log(req.body)
				res.send({
					status: 400,
					message: "Sai thong tin"
				});
		} else {
			async.waterfall([
				function(cb) { // Check regionId
					regionDB.findRegion(regionId, function(err, region) {
						if(err) {
							cb(err);
						} else {
							if(region = null) {
								cb("Region is wrong");
							} else {
								cb(null);
							}
						}
					})
				},
				function(cb) { // Check scriptid
					scriptDB.findInListId(
						req.body.idScript1,
						req.body.idScript2,
						req.body.idScript3,
						function(err) {
							if (err) {
								cb(err);
							} else {
								cb(null)
							}
						});
				},
				function(cb) { // Check email
					var email = req.body.email;
					if (email) {
						userDB.findUserByEmail(email, function(err, user) {
							if (err) {
								cb(err.message);
							} else {
								checkUser(user, email, sexId, ageID, regionId, cb);
							}
						});
					} else {
						userDB.findUserByProp(sexId, ageID, regionId, function(err, user) {
							if (err) {
								cb(err.message);
							} else {
								checkUser(user, email, sexId, ageID, regionId, cb);
							}
						})
					}
				},
				function(id, cb) { // Get infor file
					var spawn = childProcess.spawn;
					var process = spawn('python',
						["./python/snr.py",
						req.files.file1[0].path,
						req.files.file2[0].path,
						req.files.file3[0].path] );
					process.stdout.on('data', function(data) {
						var wavInfo = JSON.parse(data.toString());
						if (wavInfo.status) {
							cb(null, id, wavInfo.message)
						} else {
							cb('Python snr error')
						}
				    })
				},
				function(id, wavInfo, cb) {
					var files = [{
							userId		: id,
							scripId 	: req.body.idScript1,
							fileInfo 	: req.files.file1[0].filename,
							duration	: wavInfo.file1.dr,
							projectRate	: wavInfo.file1.rate,
							snr 		: wavInfo.file1.srn
						},{
							userId 		: id,
							scripId 	: req.body.idScript2,
							fileInfo 	: req.files.file2[0].filename,
							duration 	: wavInfo.file2.dr,
							projectRate	: wavInfo.file2.rate,
							snr 		: wavInfo.file2.srn
						},{
							userId		: id,
							scripId 	: req.body.idScript3,
							fileInfo 	: req.files.file3[0].filename,
							duration 	: wavInfo.file3.dr,
							projectRate : wavInfo.file3.rate,
							snr 		: wavInfo.file3.srn
						}];
					fileDB.saveFiles(files, function(err, docs) {
						if (err) {
							cb(err.message);
						} else {
							res.send({
								status: 200,
								message: files
							})
						}
					})
				}], function(err) {
					res.send({
						status: 400,
						message: err
					});
				}
			);
		}
	}
)

checkUser = function(user, email,sex, age, region, callback) {
	if (user) { // had prop
		var id = user._id;
		if (email) {
			if (user.regionId != region || user.ageId != age || user.sexId != sex) {
				user.regionId = region;
				user.ageId = age;
				user.sexId = sex;
				userDB.updateOne({email: email}, {$set: {regionId: region, ageId: age, sexId: sex}}, {}, function(err, user) {
					callback(null, id);
				});
			} else {
				callback(null, id);
			}
		} else {
			callback(null, id);
		}
	} else { // did not have prop
		var user = userDB({
			email	: email,
			regionId: region,
			ageId	: age,
			sexId	: sex
		});
		userDB.saveUser(user, function(err, doc) {
			if (err) {
				callback(error.QUERY_DB_ERROR);
			} else {
				callback(null, doc._id)
			}
		})
	}
}

router.get("/", function(req,res){
	res.render('upload');
})

module.exports = router;