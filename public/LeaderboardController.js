app.controller("LeaderboardController", ['$scope', '$http', function($scope, $http){
	$http({
		url: '../get/leaderboardEntries',
		method: 'GET'
	})
	.then(function successCallback(res){
		$scope.entries = res.data;
	})
}]);