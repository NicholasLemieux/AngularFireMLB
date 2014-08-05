myApp.
controller('teamController',['$scope','$http','$firebase','$firebaseSimpleLogin', 'auth',function($scope,$http,$firebase,$firebaseSimpleLogin,auth){
    /*$http.get('https://vivid-fire-5435.firebaseio.com/.json').success(function(data){
        $scope.teams=data
    })*/
    $scope.auth = auth;
    var ref = new Firebase('https://vivid-fire-5435.firebaseio.com/');
    $firebase(ref.child('teams')).$bind($scope, 'teams');
}]).

controller('playersController',['$scope','$routeParams', '$firebase','auth',function($scope,$routeParams,$firebase,auth){
    $scope.teamId = $routeParams.id;

    $scope.auth = auth;
    
    var ref = new Firebase('https://vivid-fire-5435.firebaseio.com/');
    var playersRef = ref.child('players').child($scope.teamId);
    $firebase(playersRef).$bind($scope, 'playersObj');   

    $scope.createPlayer = function () {
        playersRef.push($scope.newPlayer);
    };

    $scope.$watch('playersObj', function (playersObj) {
        $scope.players = [];
        playersObj = angular.fromJson(angular.toJson(playersObj));
        angular.forEach(playersObj, function (player, playerKey) {
            //if (playerKey[0] == "$") return;
            player._key = playerKey;
            $scope.players.push(player); 
        });
    }, true);
}]).

controller('playerController', ['$scope', '$routeParams', '$firebase', '$location', 'auth', function($scope, $routeParams, $firebase, $location, auth) {
    var ref = new Firebase('https://vivid-fire-5435.firebaseio.com/players');
    var playerRef = ref.child($routeParams.teamId).child($routeParams.playerId);
    $scope.player = $firebase(playerRef);
    $scope.auth = auth;
    
    $scope.removePlayer = function () {
        $scope.player.$remove();
        //$location.path('#/view/' + $routeParams.teamId);
    };
}]).

controller('adminController', ['$scope', '$routeParams', '$firebase', '$location', 'auth', function($scope, $routeParams, $firebase, $location, auth) {
    var ref = new Firebase('https://vivid-fire-5435.firebaseio.com/');
    $scope.auth = auth;
    $firebase(ref.child('users')).$bind($scope, 'users');
    
    $scope.setTest = function () {
        ref.child('users').child(auth.user.uid).child('privledges').child('editUsers').set(true); 
    };
}]);