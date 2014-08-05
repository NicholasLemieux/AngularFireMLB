var myApp = angular.module('myApp',['ngRoute', 'ngCookies', 'firebase']);

myApp.config(function($routeProvider){
    $routeProvider.
    when('/',{templateUrl:'partials/teams.html'}).
    when('/view/:id',{templateUrl:'partials/players.html',controller:'playersController'}).
    when('/view/:teamId/player/:playerId',{templateUrl:'partials/player.html',controller:'playerController'}).
    when('/admin',{templateUrl:'partials/admin.html',controller:'adminController'}).
    otherwise({redirectTo:'/'})
});