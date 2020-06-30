//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _ =require("lodash");
const request=require ("request");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://chelsikumari1022:3september@cluster0-amsqr.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema={
  title:String,
  content:String
};
const individualSchema={
  E_mail:String,
  info:blogSchema
};
const Post=mongoose.model("Post",blogSchema);
const Indiv=mongoose.model("Individual",individualSchema);


  //console.log(posts);

app.get("/",function(req,res){
  res.render("signup");
});
var email="";
app.post("/",function(req,res){
  var fname=req.body.firstname;
  var lname=req.body.lastname;
  email=req.body.email;
  //console.log(email);

  //console.log(fname,lname,email);
  var data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
        FNAME:fname,
        LNAME:lname
      }
      }
    ]
  };
  var jsonData=JSON.stringify(data);
  var options={
  url:"https://us8.api.mailchimp.com/3.0/lists/0707de555f",
  method:"POST",
  headers:{
    "Authorization":"kuku2460 4e54f47c62794931b8be04e37981ea5b-us8"
  },
    body: jsonData
};
  request (options,function(error,response,body){
    if (error){
      res.render("failure");
    }
    else {
      if(response.statusCode===200){
        res.render("success");
      }
      else {
        res.render("failure");
      }
    }

 });
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",function(req,res){
  email=req.body.email;
//  console.log(email);
  res.redirect("/home");
});
app.post ("/success",function(req,res){
  res.redirect("/home");
});
app.post ("/failure",function(req,res){
  res.redirect("/");
});
//4e54f47c62794931b8be04e37981ea5b-us8 ============api key
//0707de555f=====list // ID
app.get("/home",function(req,res){
  Indiv.find({E_mail:email},function(err,found){
      res.render('home',{para:homeStartingContent,posthome:found,Email:email});

  });
  });
app.get("/about",function(req,res){
  res.render('about',{About:aboutContent});

});
app.get ("/contact",function(req,res){
  res.render ("contact",{Contact:contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose",{Email:email});
})

app.post("/compose",function(req,res){
  const post=new Post({
    title:req.body.posttitle,
    content:req.body.postbody
  });
  const indiv=new Indiv({
    E_mail:email,
    info:post
  });
  indiv.save(function(err){
    if (!err){
        res.redirect("/home");
    }
  });
});
app.get('/posts/:postId', function (req, res) {
  const requested_id=req.params.postId;
  Indiv.findOne({_id:requested_id},function(err,posts){
      res.render("post",{posttitle:posts.info.title,postcontent:posts.info.content});
  });
  //console.log(req.params.postName);
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
