(function() {
    
    angular.module('modwatchApp')
    
    .controller('MainCtrl', ['$scope', 'Main', function($scope, Main) {
        
        $scope.users = ['Loading...'];
        $scope.blog = {};
        $scope.blogloading = true;
        
        Main.getUsers(
            function(res) {
                $scope.users = res.usernames;
            },
            function(res) {
                console.log(res);
            }
        );
        
        Main.getBlog(
            function(res) {
                $scope.blog = res;
                $scope.blogloading = false;
            },
            function(res) {
                console.log(res);
                $scope.blogloading = false;
            }
        );
        
    }]);
    
}());