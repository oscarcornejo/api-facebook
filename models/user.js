var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");

var Schema = mongoose.Schema;
mongoose.connect("mongodb://heroku_4zr5vr3g:dolarboy1@ds139964.mlab.com:39964/heroku_4zr5vr3g");

var userSchema = new Schema({
	name: String,
	provider: String,
	uid: String
});

userSchema.plugin(findOrCreate);


module.exports = mongoose.model("User",userSchema);