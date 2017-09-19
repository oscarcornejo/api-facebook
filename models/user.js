var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");

var Schema = mongoose.Schema;
var mongoURI = "mongodb://localhost/taller_facebook";
mongoose.connect(process.env.MONGOLAB_URI || mongoURI);

process.env.MONGOLAB_URI
var userSchema = new Schema({
	name: String,
	provider: String,
	uid: String
});

userSchema.plugin(findOrCreate);


module.exports = mongoose.model("User",userSchema);