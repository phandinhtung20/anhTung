var mongoose	= require('mongoose')

mongoose.connect('mongodb://tungpd:tungpd22@ds117148.mlab.com:17148/voice_record_sampling', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log("Connect database success")
});

module.exports = db;