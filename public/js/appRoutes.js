angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        .when('/sliding-puzzle', {
            templateUrl: 'views/sliding-puzzle.html',
            controller: 'SlidingPuzzleController'
        })

        .when('/maze', {
            templateUrl: 'views/maze.html',
            controller: 'MazeController'
        })

    $locationProvider.html5Mode(true);

}]);
