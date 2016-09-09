app.controller("AdminController", ["$scope", "$http", function($scope, $http){
	$scope.players = [];
	$http({
		method: "GET",
		url: "../get/users"
	})
	.then(function successCallback(res){
		$scope.players = res.data
	});

	$scope.clearPlayer = function(player){
		$http({
			method: "POST",
			url: "../post/clearUser",
			data: {id: player._id}
		})
		.then(function successCallback(res){
			player.cleared = true;
		})
	}
}]);