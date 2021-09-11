
const mongoos =require("mongoose");
const Game = mongoos.model("Games");


module.exports.gameSearch = function(req,res){ 
    
    Game.find({"bornCoutry":req.query.bornCountry}).exec(function(err, game) {

        console.log("game first section");
        var response ={
            status:200,
            message:game
        }
        if(err){//error checking
           
            console.log("error section");
            response.status=500;
            response.message=err;
            

        }else if(!game){//result checking
            console.log("game section");
            response.status=404;
            response.message={"message":"Game Id no found"};
        }
        res.status(response.status).json(response.message);

    });
  

}

/*var runGeoQuery = function(req ,res){
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    // GeoJSON point 
    const point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    Game.aggregate([
        {
            "$geoNear" : {
                "near" : point, 
                "spherical": true, 
                "distanceField" : "distance", 
                "maxDitance" : 7500000, 
                "limit" : 5
            }
        }
    ], function(err, results){
        console.log("Geo results ", results);
        console.log("Geo error ", err);
        res.status(200).json(results);
    }
    );
}*/

module.exports.gamesGetAll = function(req, res){
    console.log("Get all games");
    console.log(req.query);

    var offset = 0;
    var count = 5;
    const maxCount = 10;

    var searchString = null;

    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset);
    }
    if(req.query && req.query.count){
        count = parseInt(req.query.count); 
    }

    if(res.query && req.query.lat && res.query && req.query.lng ){
        runGeoQuery(req, res);
        return;
    }

    if(req.query && req.query.search){
        searchString = req.query.search;
    }

    console.log(count);

    if(isNaN(offset) || isNaN(count)){
        res.status(404).json({"message": "QueryString offset and count should be numbers"});
        return;
    }

    if(count > maxCount){
        res.status(400).json({"message": "Count exceeds maximum of " + maxCount});
    }

    if(searchString){
        Game.find({title: new RegExp(searchString+'+', "i")}).skip(offset).limit(count).exec(function(err, games){
            if(err){
                console.log("Err finding games");
                res.status(500).json(err);
            }
            // console.log("Found games ", games.length);
            res.status(200).json(games);
        });
    }else {
        Game.find().skip(offset).limit(count).exec(function(err, games){
            if(err){
                console.log("Err finding games");
                res.status(500).json(err);
            }
            console.log("Found games ", games.length);
            res.status(200).json(games);
        });
    }
    

}

module.exports.gamesGetOne = function(req, res){
    // var db = dbconnection.get();
    // var collection = db.collection("games");
    const gameId = req.params.gameId;

    Game.findById(gameId).exec(function(err, game){
        const response = {
            status : 200,
            message : game
        };

        if(err){
            console.log(err);
            response.status = 500;
            response.message = err;
            return;
        }else if(!game){
            response.status = 400;
            response.message = "Game ID not found.";
        }
        
        res.status(response.status).json(response.message);
    });
 
    
   
}

module.exports.gamesAddOne = function(req, res){
    console.log("POST to add a game");

    if(req.body && req.body.title && req.body.price){
              
        Game.create({
            title : req.body.title,
           // year : req.body.year,
            rate : req.body.rate, 
            price : req.body.price,
           /* minPlayers : req.body.minPlayers,
            maxPlayers : req.body.maxPlayers,
            publisher : "",
            reviews : [],
            minAge : req.body.minAge,
            designers :req.body.designers*/
        }, function(err, game){
            const response = {
                status : 201,
                message : game
            }
            if(err){
                response.status = 400;
                response.message = err
            }
            res.status(response.status).json(response.message);
        });

        console.log(req.body);
    }else {
        console.log("Data missing from POSt body");
        res.status(400).json({error: "Required data missing from POST"});
    }

}

module.exports.gamesUpdateOne = function(req, res){
    const gameId = req.params.gameId;
    Game.findById(gameId).select("-reviews -publisher").exec(function(err, game){
        const response = {
            status : 204,
            message : game
        }
        if(err){
            response.status = 500;
            response.message = err
        }else if(!game) {
            response.status = 404;
            response.message = {"message": "Game ID not found"};
        }
        // this means something went wrong
        if(response.status != 204){
            res.status(response.status).json(response.message);
        }else {
            // we got a game, now we need to update it 
            game.title = req.body.title;
            game.year = parseInt(req.body.year);
            game.price = parseFloat(req.body.price);
            game.rate = parseInt(req.body.rate);
            game.minPlayers = parseInt(req.body.minPlayers);
            game.maxPlayers = parseInt(req.body.maxPlayers);
            game.minAge = rparseInt(eq.body.minAge);
            game.designers = req.body.designers;
            game.save(function(err, updatedGame){
                response.message = updatedGame;
                if(err){
                    response.status= 500;
                    response.message = err;
                }
                res.status(response.status).json(response.message);

            });
        }
        res.status(response.status).json(response.message);
    })
}

module.exports.gamesDeleteOne = function(req, res){
    const gameId = req.params.gameId;
    console.log("game id: " + req.param.gameId);
    Game.findByIdAndRemove(gameId).exec(function(err, deletedGame){
        const response = {
            status : 204,
            message : deletedGame
        }
        if(err){
            response.status = 500;
            response.message = err
        }else if(!deletedGame) {
            response.status = 404;
            response.message = {"message": "Game ID not found"};
        }

        res.status(response.status).json(response.message);

    })
}

// npm install body-parser