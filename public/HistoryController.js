app.controller("HistoryController", ["$scope", "$http", function($scope, $http){
	$http({
		method: "GET",
		url: "../get/userHistory"
	})
	.then(function successCallback(res){
		console.log(res.data)
		$scope.attempts = res.data
	})
}]);