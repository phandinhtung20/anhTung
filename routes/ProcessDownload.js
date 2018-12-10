var express		= require('express'),
    router 		= express.Router(),
	fileDB		= require('../db/FileInfo'),
	constant 	= require('../configAndConstant/Constant'),
	fs 			= require('fs'),
	archiver 	= require('archiver'),
	exceljs 	= require('exceljs'),
	async 		= require('async');

// Route download file
router.get('/', function(req, res) {
	async.waterfall([
			function(cb) {
				getAllFileInfo(function(err, docs) {
					if (err) {
						console.log('Find file info error: getAllFileInfo')
						cb(err.message);
					} else {
						cb(null, docs);
					}
				})
			},
			function(files, cb) {
				generateFileInfoXLS(files, function(err) {
					if (err) {
						cb(err.message);
					} else {
						cb(null, files);
					}
				});
			},
			function(files, cb) {
				var output = fs.createWriteStream(process.cwd() + '\\VNSoundSample.zip');
				var zip = archiver('zip');
				output.on('close', function() {
				    console.log(zip.pointer() + ' total bytes');
				    console.log('Zip has been finalized and the output file descriptor has closed.');
					res.download(process.cwd() + '\\VNSoundSample.zip')
				});
				zip.on('error', function(err) {
					console.log("Error: "+err)
					cb("ZIP_FALSE")
				    throw err;
				});
				zip.pipe(output);

				for (var i = 0; i < files.length; i++) {
					var file = files[i].fileInfo;
					if (fs.existsSync(process.cwd() + "\\uploads\\"+file)) {
						zip.append(fs.createReadStream(process.cwd() + "\\uploads\\"+file), { name: file });
					}
				}
				zip.append(fs.createReadStream(process.cwd() + "\\uploads\\AudioInfo.xlsx"), {name: "AudioInfo.xlsx"});

				zip.finalize();
			}
		], 
		function(err) {
			res.send(err);
		}
	);
});
// Render page download
router.get('/page', function(req,res) {
	res.render('download')
});
var getAllFileInfo = (callback) => {
	fileDB.getAllInfo(callback)
};
var generateFileInfoXLS = (files, callback) => {
	var workbook = new exceljs.Workbook();
	var sheet = workbook.addWorksheet('info');
	sheet.columns = [
	    { header: 'fileName', key: 'name', width: 30 },
	    { header: 'duration', key: 'duration', width: 10 },
	    { header: 'sample frequency', key: 'projectRate', width: 10 },
	    { header: 'snr', key: 'snr', width: 10 },
	    { header: 'userId', key: 'userId', width: 30 },
	    { header: 'script', key: 'script', width: 50 },
	    { header: 'sex', key: 'sex', width: 10 },
	    { header: 'age', key: 'age', width: 10 },
	    { header: 'region', key: 'region', width: 20 }
	];

	for (var i = 0; i < files.length; i++) {
		sheet.addRow({
			name 		: files[i].fileInfo,
			duration	: files[i].duration,
			projectRate	: files[i].projectRate,
			snr			: files[i].snr,
			userId		: files[i].userId,
			script		: files[i].script, 
			sex 		: constant.sex[files[i].sexId],
			age 		: constant.age[files[i].ageId],
			region		: files[i].region
		});
	}

	workbook.xlsx.writeFile(process.cwd()+"\\uploads\\AudioInfo.xlsx").then(callback);
}

module.exports = router;