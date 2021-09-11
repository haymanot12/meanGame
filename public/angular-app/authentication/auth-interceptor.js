angular.module("meanGames").factory("AuthInterceptor", AuthInterceptor);

function AuthInterceptor($location, $q, $window, AuthFactory){
    return {
        request: request,
        response: response,
        responseError: responseError
    }

    function request(config){

        config.headers = config.headers || {};

        if($window.sessionStorage.token){
            config.headers.Authorization = $window.sessionStorage.token;
        }

        return config;
    }

    function response(response){

        if(response.status === 200 && $window.sessionStorage.token && !AuthFactory.auth.isLoggedIn){
            AuthFactory.auth.isLoggedIn = true;
        }
        if(response.status === 401){
            AuthFactory.auth.isLoggedIn = false;
        }
        return response || $q.when(response);
    }

    function responseError(rejection){
        if(rejection.status == 401 || rejection.status==403){
            delete $window.sessionStorage.token;
            AuthFactory.auth.isLoggedIn = false;
            $location.path("/");
        }
        return $q.reject(rejection);
    }
}