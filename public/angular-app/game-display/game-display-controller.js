angular.module("meanGames").controller("GameController", GameController);

function _getStarRating(stars){
    return new Array(stars);
}

function GameController($routeParams, GameDataFactory){
    var vm = this;
    vm.title = "MEAN Games App";

    var id = $routeParams.id;

    GameDataFactory.getOneGame(id)
        .then(function(response){
            vm.game = response;
            vm.rating = _getStarRating(response.rate);
    });

    vm.deleteSuccess = null;
    vm.deleteGame = function(gameId){
        if(gameId){
            console.log(gameId);
            GameDataFactory.deleteOneGame(gameId).then(function(response){
                console.log(response)
                vm.deleteSuccess = true;

            }).catch(function(error){
                vm.deleteSuccess = false;
                console.log(error);
            });
        }
    }
}