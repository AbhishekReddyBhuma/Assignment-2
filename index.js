const express = require("express");
const app = express();
const userRoutes = require("./routers/routes");
const postRoutes = require("./routers/post");
const users = require("./models/users");
const jwt = require("jsonwebtoken");
const secret = "RESTAPI";
const PORT = 3000;

app.use(express.json());
app.listen(PORT,() => console.log("Server is running"))

app.get("/users",async(req,res) => {
    try{
        const Users = await users.find()
        res.status(200).json({
            Users
        })
    }catch(e){
        res.status(400).json({
            status:"Failed",
            error:e.message
        })
    }
})

app.use("/",async(req,res,next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(400).json({
            status:"Failed",
            error:"Not authenticated"
        })
    }       
    jwt.verify(token,secret,async(err, decoded) => {
        if(err){
            return res.status(400).json({
                status:"Failed",
                error:"Invalid token"
            })
        }
        next()
    });
})

app.use("/",userRoutes);

app.use("/posts",async(req,res,next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(400).json({
            status:"Failed",
            error:"Not authenticated"
        })
    }       
    jwt.verify(token,secret,async(err, decoded) => {
        if(err){
            return res.status(400).json({
                status:"Failed",
                error:"Invalid token"
            })
        }
        const User = await users.findOne({_id:decoded.data});
        req.body.user = User._id;
        next()
    });
})

app.use("/posts",postRoutes)
app.get("/",(req,res) => {
    res.send("Success")
})
