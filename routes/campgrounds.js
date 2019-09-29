var express = require("express"),
	router = express.Router(),
	//models
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	//middleware
	middleware = require("../middleware");

//Index - displays list of campgrounds in database
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

//New - show form to create new campground
router.get("/new", middleware.isLoggedIn,  function(req, res){
	res.render("campgrounds/new");
});

//Create - add new campgrounds to database
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.create(req.body.camp, function(err, campground){
		if(err){
			console.log(err);
		} else {
			var author = {
				id: req.user._id,
				username: req.user.username
			}
			campground.author = author;
			campground.save();
			req.flash("success", "Successfully created campground.");
			res.redirect("/campgrounds");
		}
	});
});

//Show - show more info about on campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found.");
			res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Edit - show page to edit the campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update - update the edited campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground){
		req.flash("success", "Campground edited.");
		res.redirect("/campgrounds/" + req.params.id);
	});
});

//Destroy - delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, removedCampground){
		Comment.deleteMany({_id: {$in: removedCampground.comments}}, function(err){
			if(err){
				res.redirect("/campgrounds");
			} else {
				req.flash("success", "Campground deleted.");
				res.redirect("/campgrounds");
			}
		});
	});
});

module.exports = router;