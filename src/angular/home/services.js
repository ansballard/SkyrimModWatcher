(function() {

    angular.module('modwatchApp')

    .factory('Main', ['$http', function($http) {

        return {

            getUsers: function(success, error) {
                $http.get('/userlist')
                    .success(success)
                    .error(error)
                ;
            },
            getBlog: function(success, error) {
                $http.get('/api/blog/newest')
                    .success(success)
                    .error(error)
                ;
            },
            getBadge: function(username, success, error) {
              $http.get('/api/'+username+'/badge')
                .success(success)
                .error(error)
              ;
            }

        }

    }]);

}());