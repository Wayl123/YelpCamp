var Campground = require("../models/campground"),
	Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		next();
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("/login");
	}
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				//Check ownership
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				Comment.findById(req.params.comment_id, function(err, foundComment){
					if(err || !foundComment){
						req.flash("error", "Comment not found");
						res.redirect("back");
					} else {
						//Check ownership
						if(foundComment.author.id.equals(req.user._id)){
							next();
						} else {
							req.flash("error", "You don't have permission to do that.");
							res.redirect("back");
						}
					}
				});
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

module.exports = middlewareObj;