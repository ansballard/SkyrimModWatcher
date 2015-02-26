(function() {

    angular.module('modwatchApp')

    .factory('Main', ['$http', function($http) {

        return {

            getUsers: function(success, error) {
                $http.get('/api/users/list')
                    .success(success)
                    .error(error)
                ;
            }

        }

    }]);

}());