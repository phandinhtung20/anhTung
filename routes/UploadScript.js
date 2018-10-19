var express		= require('express'),
    router 		= express.Router(),
	multer  	= require('multer'),
	diskStorage = require('../configAndConstant/Config.js'),
	upload 		= multer({dest: 'uploads/', storage: diskStorage.storage}),
	exceljs 	= require('exceljs'),
	scriptDB	= require('../db/Script'),
	async 		= require("async");

router.post("/", upload.single('file', 3), function(req,res){	
	if (req.file == undefined || req.file.originalname != 'script.xlsx') {
		res.send("<h1>Upload file khong thanh cong</h1>")
	} else {
	    var workbook = new exceljs.Workbook();
		
		async.waterfall([
				function(callback) {
	    			var listScript = [];
				    workbook.xlsx.readFile(process.cwd() +"\\"+ req.file.path).then(function() {
						var worksheet = workbook.getWorksheet(1)
						var col = worksheet.getColumn(1);
						col.eachCell(function(cell, colNumber) {
							listScript.push(cell.value);
						    if (worksheet.rowCount == colNumber) {
								callback(null, listScript);
						    }
						});
					});
				},
				function(listScript, cb) {
					console.log("length: "+listScript.length)
					async.each(listScript, function(script, callback) {
						console.log('script: ' + script);

						var newScript = new scriptDB({
							script: script
						});

						scriptDB.saveScript(newScript, function(err, docs) {
							if(err) {
								callback(err);
							} else {
								callback(null);
							}
						});
					}, function(err) {
						if( err ) {
							console.log('A script failed to process');
							cb(err);
						} else {
							console.log('All script have been processed successfully');
							cb(null);
						}
					});
				},
				function(callback) {
				    res.redirect('/');
				}
			], function (err, result) {
				res.send(err)
			});
	}
})

module.exports = router;