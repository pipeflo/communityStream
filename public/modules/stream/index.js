(function(){
	'use strict';

	angular.module('myApp.Stream', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider
	  .when('/stream', {
	    templateUrl: 'modules/stream/views/index.html',
	    controller: 'StreamListController'
	  })
	  ;
	}])
	.controller('StreamListController', StreamListController)
    .factory('StreamService', StreamService)
	;
    
    function StreamListController($scope, $http, $window, StreamService){
        
        $scope.mySplit = function(string, nb) {
            var array = string.split(':');
            return array[nb];
        }
        
        StreamService.getCommunityStream(JSON.parse($window.localStorage.getItem('infoComunidad')).source.resourceId)
        .success(function(data){
            console.log('ACTUALIZACIONES', data);
            $scope.stream = data.list;
        }).error(function(status){
            console.log('Se presentó un error al iniciar sesión ' + status);
        });
	}
    
    function StreamService($http){
        var streamService = {};
        
        streamService.getStream = function() {
            return $http.get('/api/v1/activityStream')
            .success(function(data) {
                return data;
            }).error(function(status){
                console.log(status);
            });
        };
        
        streamService.getCommunityStream = function(communityId) {
            return $http.get('/api/v1/activityStream/' + communityId)
            .success(function(data) {
                return data;
            }).error(function(status){
                console.log(status);
            });
        };
        
        return streamService;
    }

	StreamListController['$inject'] = ['$scope', '$http', '$window', 'StreamService'];
    StreamService['$inject'] = ['$http'];

}());