var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieSession = require('cookie-session');
var Strategy = require("passport-facebook").Strategy;
var graph = require('fbgraph');
var User = require("./models/user");

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({keys: ['asdhbj2v123','asdbhasdbj12']}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','pug');

// Oauth 2.0 
passport.use(new Strategy({
	clientID: "129890780988605",
	clientSecret:"2394ce6365f22f9ba87215942570a5d1",
	callbackURL:"http://localhost:8000/auth/facebook/callback"
},function(accessToken,refreshToken, profile, cb){
	// TO DO: 
	var profile = profile;

	// Crear al usuario en MongoDB
	User.findOrCreate({uid: profile.id},
		{name: profile.displayName, provider:"facebook"},function(err,user){

				var userSession = {
					accessToken: accessToken,
					profile: user
				}

				return cb(null,userSession);

		});

	

}));

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});



app.get('/', function (req, res) {
	if(typeof req.session.passport != "undefined" && req.session.passport.user){
		res.render("home");
	}else{
		res.render('index');
	}
  // res.json(req.session.passport.user);
});

app.post("/logros",function(req,res){
	var publicacion = {
		message: req.body.logro
	};

	graph.setAccessToken(req.session.passport.user.accessToken);

	// Enviarselo a Facebook
	graph.post("/feed",publicacion,function(err,graphResponse){
		res.redirect("/");
	});

});

app.get("/friends",function(req,res){
	graph.setAccessToken(req.session.passport.user.accessToken);

	graph.get("/me/friends",function(err,graphResponse){
		if(graphResponse.data){

			var friendIDS = graphResponse.data.map(function(el){
				return el.id;
			});

			User.find({
				'uid':{
					$in: friendIDS
				}
			},function(err,users){
				res.render("friends",{users:users})
			});

		}else{
			res.json(graphResponse);
		}
	});
});

app.get('/auth/facebook',passport.authenticate('facebook',{scope: ['publish_actions','user_friends']}));

app.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect: '/'}),
	function(req,res){
		res.redirect('/');
	});

app.get("/auth/close",function(req,res){
	req.logout();
	res.redirect("/");
})

app.listen(8000, function () {
  console.log('Listening on port 8000');
});