(function() {
    
    angular.module('modwatchApp')
    
    .controller('MainCtrl', ['$scope', 'Main', function($scope, Main) {
        
        $scope.users = [];
        $scope.loading = true;
        
        Main.getUsers(
            function(res) {
                $scope.users = res.usernames;
                $scope.loading = false;
            },
            function(res) {
                console.log(res);
                $scope.loading = false;
            }
        );
        
    }]);
    
}());