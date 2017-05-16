angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        .when('/games', {
            templateUrl: 'views/game.html',
            controller: 'GameController'
        });

    $locationProvider.html5Mode(true);

}]);
