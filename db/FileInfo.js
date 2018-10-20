var mongoose= require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var fileSch= mongoose.Schema({
	userId: ObjectId,
	scripId: ObjectId,
	fileInfo: {
		type: String,
		default: ''
	}
});

var file = module.exports= mongoose.model('file', fileSch);

module.exports.saveFile= function(scr, callback){
  scr.save(callback);
}

module.exports.saveFiles= function(files, callback){
	file.insertMany(files, callback);
}

module.exports.getAllInfo= function(callback){
	file.aggregate([
	    {
	        $lookup: {
	            "from": "users",
	            "localField": "userId",
	            "foreignField": "_id",
	            "as": "user"
	        }
	    },
	    {
	        $unwind: "$user"
	    },
	    {
	        $project: {
	            fileInfo: 1,
	            scripId: 1,
	            ageId: "$user.ageId",
	            sexId: "$user.sexId",
	            regionId: "$user.regionId"
	        }
	    },
	    {
	        $lookup: {
	            "from": "regions",
	            "localField": "regionId",
	            "foreignField": "_id",
	            "as": "region"
	        }
	    },
	    {
	        $unwind: "$region"
	    },
	    {
	        $project: {
	            fileInfo: 1,
	            scripId: 1,
	            ageId : 1,
	            sexId : 1,
	            region : "$region.region"
	        }
	    },
	    {
	        $lookup: {
	            "from": "scripts",
	            "localField": "scripId",
	            "foreignField": "_id",
	            "as": "script"
	        }
	    },
	    {
	        $unwind: "$script"
	    },
	    {
	        $project: {
	            _id: 1,
	            fileInfo: 1,
	            ageId: 1,
	            sexId: 1,
	            region: 1,
	            script: "$script.script"
	        }
	    }
	], callback);
}