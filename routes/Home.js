var express= require('express'),
    router= express.Router();

router.get('/', function(req, res) {
	res.render('record2')
})
module.exports = router;