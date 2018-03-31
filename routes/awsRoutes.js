var AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = "us-west-2";

var s3_bucket = process.env.S3_BUCKET;

module.exports = function(app){
	app.post("/aws/storeimg", function(req, res){
		var s3 = new AWS.S3();
		var name = req.user.email;
		name = name.split('@');
		name = name.join('');
		name = name.split('.');
		name = name.join('');
		name = name.split('/');
		name = name.join('');
		var s3params = {
			Bucket: s3_bucket,
			Key: name,
			ContentType: req.body.type,
			Expires: 60,
			ACL: "public-read"
		};

		s3.getSignedUrl("putObject", s3params, function(err, data){
			if(err) {
				console.log("couldn't put object");
				res.end();
			}
			else {
				var returnData = {
					signedRequest: data,
					url:"https://" + s3_bucket + ".s3.amazonaws.com/" + name,
					fileName: name
				};
				res.json(returnData);
			}				
		});
	});

	app.delete("/aws/deleteimg/:filename", function(req, res){
		var s3 = new AWS.S3();
		var s3params = {
			Bucket: s3_bucket,
			Key: req.params.filename
		};

		s3.deleteObject(s3params, function(err, data){
			if(err)
				return res.json("false");
			else
				return res.json("true");
		});
	});
};