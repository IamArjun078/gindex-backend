const express = require("express");
const router = express.Router();
const checkOrigin = require("../plugins/checkOrigin");

//Model Imports
const User = require("../models/user");
const CategoryPost = require("../models/categoryPost");
const HeroPost = require("../models/heroPost");
const TrendingPost = require("../models/trendingPost");

router.post("/all", function(req, res){
  if(checkOrigin(req.headers.origin)){
    User.findOne({ email: req.body.email }, function(error, result){
      if(result){
        TrendingPost.find({ root: req.body.root }, function(error, trendingPosts){
          HeroPost.find({ root: req.body.root }, function(error, heroPosts){
            CategoryPost.find({ root: req.body.root }, function(error, categoryPosts){
              if(trendingPosts.length < 1 && heroPosts.length < 1 && categoryPosts.length < 1){
                res.status(200).send({ auth: false, registered: true, message: "No Posts Found in Your DB" });
              } else {
                res.status(200).send({ auth: true, registered: true, root: req.body.root, hero: heroPosts, category: categoryPosts, trending: trendingPosts });
              }
            })
          })
        })
      } else {
        res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" });
      }
    })
  } else {
    res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
  }
})

router.use("/categories", require("./posters/categories"));
router.use("/hero", require("./posters/hero"));
router.use("/trending", require("./posters/trending"));

module.exports = router
