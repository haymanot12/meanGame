angular.module("meanGames").controller("GamesController", GamesController);

function GamesController($route, GameDataFactory, AuthFactory){
    var vm = this;
    vm.title = "MEAN Games App";
    vm.isSubmitted = false;

    GameDataFactory.getAllGames()
        .then(function(response){
            vm.games = response;
        });

    vm.addGame = function(){
        var postData = {
            title: vm.newGameTitle,
            price: vm.newGamePrice,
            year : vm.newGameYear,
            rate: vm.newGameRating,
            minPlayers: vm.newGameMinPlayers,
            maxPlayers: vm.newGameMaxPlayers,
            minAge: vm.newGameMinAge,
            designers: vm.newGameDesigner
        };

        if(vm.gameForm.$valid){
            GameDataFactory.addOneGame(postData).then(function(response){
                console.log("Game Saved");
            }).catch(function(error){
                console.log(error);
            })
        }else {
            vm.isSubmitted = true;
            console.log("Data Validation FAiled")
        }
    }

    vm.isLoggedIn = function(){
        if(AuthFactory.auth.isLoggedIn){
            return true;
        }else {
            return false;
        }
    }

    vm.searchGame = function(){
        var searchString = vm.search;
        GameDataFactory.searchGame(searchString).then(function(response){

            vm.games = response;
        }).catch(function(err){

        })
    }
}
