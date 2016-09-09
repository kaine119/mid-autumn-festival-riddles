app.controller("QuizController", ["$scope", "$http", function($scope, $http){
	$scope.currentRiddles = [];
	$scope.currentRiddle = $scope.currentRiddles.slice(-1)[0];
	$scope.doneRiddles = [];
	$scope.highlightCorrect = false;
	$scope.highlightWrong = false;
	var score = 0;
	$scope.attempts = 0;

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
			if ($scope.attempts == 5) {
				postUserDone(score);
			}
			else if (answerCorrect) {
				console.log('answer was correct')
				score++;
				$scope.highlightCorrect = true;
				setTimeout(function() {
					$scope.highlightCorrect = false;
					getRiddle();
				}, 100);
			} else {
				console.log('answer was wrong')
				$scope.highlightWrong = true;
				setTimeout(function() {
					$scope.highlightWrong = false;
					getRiddle();
				}, 100);
			}
		}
	}

	var getRiddle = function(){
		$http({
			method: "POST",
			url: "./post/riddle"
		})
		.then(function successCallback(res){
			console.log(res);
			var riddleToPush = {};
			riddleToPush.question = res.data.question;
			shuffle(res.data.options);
			riddleToPush.options = res.data.options;
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
			$scope.userID = res.data;
			
				alert("Congrats! You've finished with a score of " + score + "/5");
			return true;
		});
	}	

	for (var i = 5 - 1; i >= 0; i--) {
		getRiddle();
	}
	
	
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
