var express= require('express'),
    router= express.Router(),
	constant 	= require('../configAndConstant/Constant');

router.get('/', function(req, res) {
	res.render('record',{ages: constant.age})
})
module.exports = router;