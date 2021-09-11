angular.module("meanGames").directive("gamesNavigation", GameNavigation);

function GameNavigation(){
    return{
        restrict: "E",
        templateUrl: "angular-app/navigation-directive/navigation-directive.html"
    };
}