const mongoos =require("mongoose");
const Game = mongoos.model("Games");

module.exports.publisherGetOne = function(req, res){
    var gameId = req.params.gameId;

    Game.findById(gameId).select("publisher").exec(function(err, game){
        if(err){
            res.status(500).json(err);
        }else if(!game){
            res.status(404).json({"message" : "Game not found"});
        }else {
            var publisher = game.publisher;
            res.status(200).json(publisher);
        }
        
    })
}

module.exports.publisherAddOne = function(req, res){
    var gameId = req.params.gameId;

    Game.findById(gameId).exec(function(err, game){

        if(err){
            res.status(500).json(err);
        } else if(!game) {
            res.status(404).json({"message" : "Game not found"});
        }else {
            game.publisher = new Object(); 
            game.publisher.name = req.body.name;
            game.publisher.country = req.body.country;
            game.publisher.established = req.body.established;
            game.publisher.location = {
                address : req.body.address,
                coordinates : [req.body.long, req.body.lat]
            }

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
            });
        }
    })
}

module.exports.publisherUpdateOne = function(req, res){
    var gameId = req.params.gameId;

    Game.findById(gameId).exec(function(err, game){

        if(err){
            res.status(500).json(err);
        } else if(!game) {
            res.status(404).json({"message" : "Game not found"});
        }else {
            // game.publisher = new Object(); 
            game.publisher.name = req.body.name;
            game.publisher.country = req.body.country;
            game.publisher.established = req.body.established;
            game.publisher.location = {
                address : req.body.address,
                coordinates : [req.body.long, req.body.lat]
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
            });
        }
    })
}

module.exports.publisherDeleteOne = function(req, res){
    var gameId = req.params.gameId;

    Game.findById(gameId).select("-reviews").exec(function(err, game){

        if(err){
            res.status(500).json(err);
        } else if(!game) {
            res.status(404).json({"message" : "Game not found"});
        }else {
            game.publisher.remove();

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
        }
    })
}