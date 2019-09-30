var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	eSession = require("express-session"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	momentJs = require("moment"),
	//models
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	//seed
	seedDB = require("./seeds"),
	//routes
	campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");

//seedDB();
const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = momentJs;

//Passport configuration
app.use(eSession({
	secret: "Secret goes here",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Global variable
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`YelpCamp is running on port ${ PORT }`);
});