var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	//models
	User = require("../models/user");
	
//Landing page
router.get("/", function(req, res){
	res.render("landing");
});

//Register form
router.get("/register", function(req, res){
	res.render("register");
});

//Handle registeration
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

//Login form
router.get("/login", function(req, res){
	res.render("login");
});

//Handle login
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){});

//Logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;