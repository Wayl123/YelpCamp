var express = require("express"),
	router = express.Router({mergeParams: true}),
	//models
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	//middleware
	middleware = require("../middleware");

//New - form for new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//Create - create new comment
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					var author = {
						id: req.user._id,
						username: req.user.username
					}
					comment.author = author;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully created comment.");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//Edit - form to edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
	});
});

//Update - update the edited comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		req.flash("success", "Comment edited.");
		res.redirect("/campgrounds/" + req.params.id);
	});
});

//Destroy - delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		req.flash("success", "Comment deleted.");
		res.redirect("/campgrounds/" + req.params.id);
	});
});

module.exports = router;