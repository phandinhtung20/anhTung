var express		= require('express'),
    router 		= express.Router(),
    mongoose	= require('mongoose'),
	fileDB		= require('../db/FileInfo'),
	userDB		= require('../db/UserInfo'),
	scriptDB	= require('../db/Script'),
	multer  	= require('multer'),
	async 		= require('async'),
	diskStorage = require('../configAndConstant/Config'),
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
		console.log(req.body.idUser)
		console.log(req.files);
		if (!mongoose.Types.ObjectId.isValid(req.body.idUser) ||
			!mongoose.Types.ObjectId.isValid(req.body.idScript1) ||
			!mongoose.Types.ObjectId.isValid(req.body.idScript2) ||
			!mongoose.Types.ObjectId.isValid(req.body.idScript3) ||
			req.files.file1 == undefined ||
			req.files.file2 == undefined ||
			req.files.file3 == undefined) {
			res.send("<h1>Upload file khong thanh cong</h1>")
		} else {
			async.waterfall([
				function(cb) { // Check userid
					userDB.findUser("5bb8e0d04df33705e4edf5c5", function(info) {
						console.log(info);
						if(info == null) {
							cb(null);
						} else {
							cb(info.message);
						}
					})
				},
				function(cb) { // Check scriptid
					scriptDB.findInListId(
						req.body.idScript1,
						req.body.idScript2,
						req.body.idScript3,
						function(err) {
							
						});
				}], function(err) {
					console.log(err)
				}
			);



			var files = [
				{
					userId: req.body.idUser,
					scripId: req.body.idScript1,
					scriptInfo: req.files.file1[0].filename
				},{
					userId: req.body.idUser,
					scripId: req.body.idScript2,
					scriptInfo: req.files.file2[0].filename
				},{
					userId: req.body.idUser,
					scripId: req.body.idScript3,
					scriptInfo: req.files.file3[0].filename
				}				
			]

			res.redirect('/');
		}
	}
)

router.get("/", function(req,res){
	res.render('upload');
})

module.exports = router;