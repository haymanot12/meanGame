angular.module("meanGames").controller("RegisterController",RegisterController);

function RegisterController(GameDataFactory){
    var vm = this;

    vm.register = function(){
        var user = {
            username: vm.username,
            password: vm.password,
            name: vm.name
        }
    
        if(!vm.username || !vm.password){
            vm.err = "Please write a username and password"; 
            vm.message = "";
        }else {
            if(vm.password !== vm.passwordRepeat){
                vm.err = "Please make sure the password mathch."
                vm.message = ""
            }else {
               
                GameDataFactory.registerUser(user).then(function(result){
                    console.log(result);
                    console.log("success");
                    vm.message = "Successful registration, please login.";
                    vm.err = "";
                }).catch(function(err){
                    console.log(err);
                })
            }
        }
    }
    
}