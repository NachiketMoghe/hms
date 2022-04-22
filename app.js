// immediately invoked functions expression.
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// Restful Routing for CGs:
// Index: /campgrounds
// New: /campgrounds/new
// Create: /campgrounds
// Show: /campgrounds/:id

// Restful Routing for comments:
// New: campground/:id/comments/new     GET
// Create: campgrounds/:id/comments     POST

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://lyproject:fgWQJR.KFn!F3uE@cluster0.otnug.mongodb.net/LYPROJECTVIN?retryWrites=true&w=majority");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

// PASSPORT CONFIG

app.use(require("express-session")({
    secret: "This is gonna help me in Hashing.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("land");
});


app.get("/campgrounds", isLoggedIn , function(req, res){
    // Get all CG from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Error; the world is against you.");
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});    
});



app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("Error; the world is against you.");
            console.log(err);
        }
        else{
            res.redirect("/campgrounds"); 
        }
    });
   
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// SHOW - SHows more info about one CG
app.get("/campgrounds/:id", function(req, res){
    // Find CG with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            // render show template with the same CG
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else {
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req,res)=>{
    // lookup Cg using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id );
                }
            });
        }
    });
    // create new comment
    // connect new comment to CG
    // redirect to CG showpage
});

// AUTH
// showing register
app.get("/register", function(req,res){
    res.render("register");
});

// Handling SignUp Logic
app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// Login

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/"
}), function(req,res){
});

// LogOut

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}
app.listen(process.env.PORT||3000, process.env.IP, function(){
    console.log("Yelp Server has started.");
}); 