const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../models/users");
const {body ,validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const posts = require("../models/posts");
const { post } = require("./routes");
const secret = "RESTAPI";

async function connection(){
    try{
       await mongoose.connect("mongodb://localhost/assignment");
        //console.log("connected")
    }catch(err){
        console.log(err);
    }
}

connection();

router.post("/",body("title").notEmpty(),body("body").notEmpty(),body("image").notEmpty(),body("user").notEmpty(),
 async(req,res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid details",
                errors: errors.array()
            })
        }
        
        const Post = await posts.create({
            title:req.body.title,
            body:req.body.body,
            image:req.body.image,
            user:req.body.user
        })  
        res.status(200).json({
            status:"post created",
            Post
        })   
    }catch(e){
        res.status(400).json({
            status:"Failed",
            error:e.message
        })
    }
})

router.get("/",async(req,res) => {
    try{
        const Posts = await posts.find({user:req.body.user})
        res.status(200).json({
            Posts
        })
    }catch(e){
        res.status(400).json({
            status:"Failed",
            error:e.message
        })
    }
})

router.put("/:postId",async(req,res) => {
    const postId = req.params.postId;
    const newData = req.body;
    try{
        await posts.updateOne({_id:postId},newData);
        res.status(200).json({
            status:"Success"
        })
    }catch(e){
        res.status(400).json({
            status:"Failed",
            error:e.message
        })
    }
})

router.delete("/:postId",async(req,res) => {
    const postId = req.params.postId;
    try{
        await posts.deleteOne({_id:postId});
        res.status(200).json({
            status:"Successfully deleted"
        })
    }catch(e){
        res.status(400).json({
            status:"Failed",
            error:e.message
        })
    }
})
module.exports = router;