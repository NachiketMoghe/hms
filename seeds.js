var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment= require("./models/comment");


var data=[
    {name: "Vineet Gadiyar",
    image: "https://images5.alphacoders.com/555/thumb-1920-555700.jpg",
    description: "9152687334",
    rollno: "1813075"
    },
    {name: "Prajwal Gawde",
    image: "https://cdn.hipwallpaper.com/i/74/67/2CuRMd.jpg",
    description: "7718961071",
    rollno: "1813076"

    },
    {name: "Nikunj Gohil",
    image: "https://images5.alphacoders.com/555/thumb-1920-555700.jpg",
    description: "9920171811",
    rollno: "1813077"
    },
    {name: "Bhavik Dhimar",
    image: "https://images5.alphacoders.com/555/thumb-1920-555700.jpg",
    description: "9004696364",
    rollno: "1813072"
    }
]
//remove all CGs
function seedDB(){
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Entries."); 
        // adding new CGs
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err) 
                }
                else{
                console.log("Added an entry(shift)");
                    // comment creation
                    // Comment.create(
                    //     {
                    //     text: "Binod.",
                    //     author: "Binod Tharu"
                    //     }, 
                    //     function(err, comment){
                    //         if(err){
                    //         console.log(err);
                    //         }
                    //         else{
                    //             campground.comments.push(comment);
                    //             campground.save();
                    //             console.log("Created new comment");
                    //         }
                    //         });
                        }
        });
        });
    });
}
module.exports= seedDB;
// module.exports= mongoose.model("seedDB", seedDB);