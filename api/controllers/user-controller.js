const mongoos =require("mongoose");
const User = mongoos.model("User");
const bcrypte = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

module.exports.register = function(req, res){
    console.log("Register User");
 
    if(req.body.username && req.body.password){
        var username = req.body.username;
        var name = req.body.name;
        var password = bcrypte.hashSync(req.body.password, bcrypte.genSaltSync(10));

        User.create({
            username: username,
            name: name,
            password: password
        }, function(err, user){
            if(err){
                console.log(err);
                res.status(400).json(err)
            }else {
                res.status(201).json(user);
            }
        })
    }else {
        res.status(404).json({"message" : "Required Fields are not passed"})

    }
    
}

module.exports.login = function(req, res){
    console.log("Loggin in user");
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username}).exec(function(err, user){
        if(err){
            console.log(err);
            res.status(400).json(err);
        }

        console.log(user);
        if(user && bcrypte.compareSync(password, user.password)){
            var token = jwt.sign({username: user.name}, "cs572", {expiresIn: 3600});
            console.log(token);
            res.status(200).json({success: true, token: token});
            
        }else {
            res.status(400).json("Unauthorized");
        }
    });
}

// middleware
module.exports.authenticate = function(req, res, next){
    console.log(req);
    var headerExists = req.headers.authorization;
    
    if(headerExists){
        console.log( req.headers);
        let token = req.headers.authorization;
        jwt.verify(token, "cs572", function(err, decoded){
            if(err){
                console.log(err);
                res.status(401).json("Unauthorized");
            }else {
                req.user = decoded.user;
                next();
            }
        }); 
    } else {
        res.status(403).json("No token provided.");
    }
}