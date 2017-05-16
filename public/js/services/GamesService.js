angular.module('GameService', []).factory('Game', ['$http', function($http) {

    return {
        get : function() {
            return $http.get('/api/games');
        },
    }

}]);
