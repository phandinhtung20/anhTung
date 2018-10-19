var express		= require('express'),
    router 		= express.Router(),
	fileDB		= require('../db/FileInfo'),
	fs 			= require('fs'),
	archiver 	= require('archiver'),
	exceljs 	= require('exceljs'),
	async 		= require('async');

// Route download file
router.get('/', function(req, res) {
	async.waterfall([
			function(callback) {
				getAllFileInfo(function(err, docs) {
					if (err) {
						console.log('Find file info error: getAllFileInfo')
						callback(err);
					} else {
						callback(null, docs);
					}
				})
			},
			function(files, callback) {
				generateFileInfoCSV(files);
				callback(null);
			},
			function(callback) {
				var output = fs.createWriteStream(process.cwd() + '\\VNSoundSample.zip');
				var zip = archiver('zip');
				output.on('close', function() {
				    console.log(zip.pointer() + ' total bytes');
				    console.log('Zip has been finalized and the output file descriptor has closed.');
					res.download(process.cwd() + '\\VNSoundSample.zip')
				});
				zip.on('error', function(err) {
					console.log("Error: "+err)
					callback("ZIP_FALSE")
				    throw err;
				});
				zip.pipe(output);
				zip.directory('uploads', false, { date: new Date() });
				zip.finalize();
			}
		], 
		function(err) {
			res.send(err);
		}
	);
});

var getAllFileInfo = callback => {fileDB.find({}, callback)};
var generateFileInfoCSV = function(files) {
	console.log('files: '+files.length);
	// var workbook = createAndFillWorkbook();
	// workbook.csv.writeFile(filename)
 //    .then(function() {
 //        // done
 //    });
}


module.exports = router;