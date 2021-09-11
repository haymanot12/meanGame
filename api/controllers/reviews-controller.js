const e = require("express");
const mongoos =require("mongoose");
const Game = mongoos.model("Games");

module.exports.reviewsGetAll = function(req, res){
    var gameId = req.params.gameId;

    Game.findById(gameId).select("reviews").exec(function(err, game){
        if(err){
            res.status(500).json(err);
        }else {
            var reviews = game.reviews;
            res.status(200).json(reviews);
        }
    })
}

module.exports.reviewsGetOne = function(req, res){
    var gameId = req.params.gameId;
    var reviewId = req.params.reviewId;

    Game.findById(gameId).select("reviews").exec(function(err, game){
        if(err){
            res.status(500).json(err);
        } else if(!game) {
            res.status(404).json({"message" : "Game not found"});
        }else {
            var review = game.reviews.id(reviewId);
            if(review){
                res.status(200).json(review);
            }else{
                res.status(404).json({"message": "Review not found"});
            }
        }
    })
}

module.exports.reviewsAddOne = function(req, res){
    const gameId = req.params.gameId;

    Game.findById(gameId).exec(function(err, game){
        if(err){
            res.status(500).json(err);
        }else if(!game){
            res.status(404).json({"message": "Game not found"});
        }else {
            if(req.body && req.body.review){
                game.reviews.push(
                    {review : req.body.review}
                );

                game.save(function(err, updatedGame){
                    const response = {
                        status : 201,
                        message : updatedGame
                    }
                    if(err){
                        response.status = 500;
                        response.message = err;
                    }
                    res.status(response.status).json(response.message);
    
                })
            }else {
                res.status(400).json({error: "Required data missing from POST"});

            }

          
        }
    });
}

module.exports.reviewsUpdateOne = function(req, res){
    const gameId = req.params.gameId;
    var reviewId = req.params.reviewId;

    Game.findById(gameId).exec(function(err, game){
        if(err){
            res.status(500).json(err);
        }else if(!game){
            res.status(404).json({"message": "Game not found"});
        }else {
            var review = game.reviews.id(reviewId);
            if(review){
                var reviewIndex = game.reviews.indexOf(review);

                game.reviews[reviewIndex] = {
                    _id : review._id,
                    review : req.body.review
                }

                game.save(function(err, updatedGame){
                    const response = {
                        status : 204,
                        message : updatedGame
                    }
                    if(err){
                        response.status = 500;
                        response.message = err;
                    }
                    res.status(response.status).json(response.message);
    
                })
            }else {
                res.status(404).json({"messag": "Review not found."});

            }
        }
    });
}

module.exports.reviewsDeleteOne = function(req, res){
    var gameId = req.params.gameId;
    var reviewId = req.params.reviewId;

    Game.findById(gameId).select("-publisher").exec(function(err, game){

        if(err){
            res.status(500).json(err);
        } else if(!game) {
            res.status(404).json({"message" : "Game not found"});
        }else {
            var review = game.reviews.id(reviewId);

            if(review){
                var reviewIndx = game.reviews.indexOf(review);

                game.reviews.splice(reviewIndx, 1);
    
                game.save(function(err, updatedGame){
                    const response = {
                        status : 204,
                        message : updatedGame
                    }
                    if(err){
                        response.status = 500;
                        response.message = err;
                    }
    
                    res.status(response.status).json(response.message);
                });
            }else {
                res.status(400).json({"message" : "Review not found"});

            }
            
        }
    })
}
