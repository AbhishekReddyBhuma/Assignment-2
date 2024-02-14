const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../models/users");
const post = require("../models/posts");
const {body ,validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const secret = "RESTAPI";

async function connection(){
    try{
       await mongoose.connect("mongodb://localhost/assignment");
        console.log("connected")
    }catch(err){
        console.log(err);
    }
}

connection();

router.post("/register",body("name").isAlpha(),body("email").isEmail(),body("password").isLength({min:6,max:10}),
    async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status:"Failed",
                message:"Invalid details",
                errors:errors.array()
            })
        }
        bcrypt.hash(req.body.password,10,async(err,hash) => {
            if(!err){
                try{
                    const data = await user.create({
                        name:req.body.name,
                        email:req.body.email,
                        password:hash
                    })
                    return res.status(200).json({
                        status:"success",
                        data
                    })
                }catch(e){
                    res.status(500).json({
                        status:"Failed",
                        error:e.message
                    })
                }
            }
            res.status(400).json({
                status:"Failed",
                message:err.message
            })
        })
    }
)

router.post("/login", body("email").isEmail(), body("password").isLength({min:6,max:10}),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Invalid details",
                    errors: errors.array()
                })
            }
            const User = await user.findOne({ email: req.body.email })
            if (!User) {
                return res.status(400).json({
                    status: "Failed",
                    error: "User not registered"
                })
            }

            bcrypt.compare(req.body.password, User.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + (60*60),
                        data:User._id
                    },secret);
                    res.status(200).json({
                        status: "success",
                        token:token
                    })
                }else{
                    res.status(200).json({
                        status: "Failed",
                        error:"Wrong password"
                    }) 
                }
            })

        }catch(e){
            res.status(400).json({
                status:"Failed",
                error:e.message
            })
        }

})

router.put("/:userId",async(req,res) => {
    const userId = req.params.userId;
    const newData = req.body;
    try{
        await users.updateOne({_id:userId},newData);
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

router.delete("/:userId",async(req,res) => {
    const userId = req.params.userId;
    try{
        await users.deleteOne({_id:userId});
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