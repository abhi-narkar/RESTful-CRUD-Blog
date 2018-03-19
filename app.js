var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); // use this always after body-parser
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1496297485239-4265d2ba2105?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2fcca05467a72f429b3c885c9b605428&auto=format&fit=crop&w=500&q=60",
//     body: "Hello This is a blog post",
// });


//RESTful Routes

app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogsData){
       if(err){
           console.log(err);
       } else{
        res.render("index", {blogsVar: blogsData});    
       }
    });
});
// NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

// CREATE ROUTE

app.post("/blogs", function(req, res){
      
//       sanitizer
// console.log(req.body);
//  req.body.blog.body = req.sanitize(req.body.blog.body);
//  console.log("=========");

 // create blog
 //.blog is used because it is value of "name" used as an object in the form tag, ex blog[title].
 console.log(req.body);
 Blog.create(req.body.blog, function(err, newBlog){
     if(err){
        res.render("new");
     } else{
          //redirect to the blogs page
         res.redirect("/blogs");
     }
 });
 
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
           res.redirect("/blogs");
        } else{
            res.render("show", {blogVar: foundBlog});
        }
    });
});
 
 // EDIT ROUTE
 app.get("/blogs/:id/edit", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
               res.render("edit", {blogVar: foundBlog});
        }
     });
});
// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    // takes 3 parameters(id, data from form that need to update, callback function)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
             res.redirect("/blogs");
        }
    });
    //Redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The RESTful Server is Active");
});