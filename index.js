var express 	= require('express'),
	app 		= express(),
	https 		= require('https'),
	http 		= require('http'),
	config 		= require('./configAndConstant/Config.js'),
	constVal	= require('./configAndConstant/Constant.js'),
	bodyParser	= require('body-parser');

// Setup server
app.use(express.static('public', config.optionServer))
app.set('view engine','ejs');
app.set('views', './views')

// Start server
http.createServer(app).listen(8000,'127.0.0.1', function () {
	console.log("Start server HTTP ");
	// https.createServer(options, app).listen(443,'127.0.0.1', function() {
	// 	console.log("Start server HTTPS");
	// });
});

// Setup DB
var db = require('./db/ConnectDatabase.js');
// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// config logger https://github.com/log4js-node/log4js-node

// Route
app.use('/', require('./routes/Home.js'));
app.use('/download', require('./routes/ProcessDownload.js'));
app.use('/uploadScript', require('./routes/UploadScript.js'));
app.use('/upload', require('./routes/ProcessUpload.js'));
app.use('/user', require('./routes/ProcessUser.js'));