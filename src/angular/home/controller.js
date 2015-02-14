(function() {

    angular.module('modwatchApp')

    .controller('MainCtrl', ['$scope', 'Main', function($scope, Main) {

        $scope.users = ['Loading...'];
        $scope.blog = {};
        $scope.blogloading = false;

        Main.getUsers(
            function(res) {
                $scope.users = res.usernames;
            },
            function(res) {
                console.log(res);
            }
        );

    }]);

}());