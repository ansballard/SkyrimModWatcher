(function() {

    angular.module('modwatchApp')

    .factory('Main', ['$http', function($http) {

        return {

            getFile: function(username, filename, success, error) {
                $http.get('/api/user/'+username+'/'+filename)
                    .success(success)
                    .error(error)
                ;
            },
            getProfile: function(username, success, error) {
              $http.get('/api/user/'+username+'/profile')
                .success(success)
                .error(error)
              ;
            },
            getFileNames: function(username, success, error) {
              $http.get('/api/user/'+username+'/files')
                .success(success)
                .error(error)
              ;
            },
            setTag: function(username, tag, success, error) {
              $http.post('/newTag/'+username, {"tag":tag})
                .success(success)
                .error(error)
              ;
            },
            setENB: function(username, enb, success, error) {
              $http.post('/newENB/'+username, {"enb":enb})
                .success(success)
                .error(error)
              ;
            }

        }

    }]);

}());