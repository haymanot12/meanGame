angular.module("meanGames").directive("gameRating",GameRating);

function GameRating(){
    return{
        //E element A attribute
        restrict:"E",
        templateUrl:"angular-app/game-rating-directive/rating.html",
        bindToController:true,
        controller:"GameController",
        controllerAs:"vm",
        scope:{
            stars:"@"
        }
    }
}