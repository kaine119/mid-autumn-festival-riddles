app.controller("QuizController", ["$scope", "$http", function($scope, $http){
	$scope.currentRiddles = [];
	$scope.currentRiddle = $scope.currentRiddles.slice(-1)[0];
	$scope.doneRiddles = [];
	$scope.highlightCorrect = false;
	$scope.highlightWrong = false;
	var score = 0;
	$scope.attempts = 0;

	$http({
		method: "GET",
		url: "/get/userDetails"
	})
	.then(function successCallback(res) {
		$scope.email = res.data.google.email;
		$scope.score = res.data.score;
	})

	$scope.checkCorrect = function(answerCorrect){
		$scope.attempts++;
		var previousRiddle = $scope.currentRiddle;
		var currentAttempt = $scope.attempts;
		if ($scope.attempts > 5) {
			return;
		} 
		else { 
			previousRiddle.questionNumber = currentAttempt;
			previousRiddle.guess = answerCorrect;
			$scope.doneRiddles = prepend(previousRiddle, $scope.doneRiddles);
			console.log($scope.doneRiddles)
			if ($scope.attempts == 5) {
				postUserDone(score);
			}
			else if (answerCorrect) {
				console.log('answer was correct')
				score++;
				$scope.highlightCorrect = true;
				getRiddle();
			} else {
				console.log('answer was wrong')
				$scope.highlightWrong = true;
				getRiddle();
			}
		}
	}

	var getRiddle = function(){
		$scope.highlightCorrect = false;
		$scope.highlightWrong = false;

		var riddlesIds = []
		for (var i = $scope.currentRiddles.length - 1; i >= 0; i--) {
			riddlesIds.push( $scope.currentRiddles[i]._id );
		}
		$http({
			method: "POST",
			url: "./post/riddle",
			data: {pastRiddles: riddlesIds}
		})
		.then(function successCallback(res){
			console.log(res);
			var riddleToPush = {};
			riddleToPush.question = res.data.question;
			// shuffle(res.data.options);
			riddleToPush.options = res.data.options;
			riddleToPush._id = res.data._id;
			$scope.currentRiddles.push(riddleToPush);
			$scope.currentRiddle = $scope.currentRiddles.slice(-1)[0];
		}, function errorCallback(err){
			console.log(err)
		})		
	};

	var postUserDone = function(score){
		$http({
			method: "POST",
			url: "/post/userDone",
			data: {score: score}
		})
		.then(function successCallback(res){
			console.log(res);
			alert("Congrats! You've finished with a score of " + score + "/5");
			$http({
				method: "GET",
				url: "/get/userDetails"
			})
			.then(function successCallback(res) {
				$scope.score = res.data.score;
			})
			return true;

		});
		
	}	

	getRiddle();
	
	
}])

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function prepend(value, array) {
  var newArray = array.slice(0);
  newArray.unshift(value);
  return newArray;
}
