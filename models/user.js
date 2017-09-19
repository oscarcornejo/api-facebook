var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");

var Schema = mongoose.Schema;
mongoose.connect("mongodb://buscar-amigos.com/taller_facebook");

var userSchema = new Schema({
	name: String,
	provider: String,
	uid: String
});

userSchema.plugin(findOrCreate);


module.exports = mongoose.model("User",userSchema);