app.controller("QuizController", ["$scope", "$http", function($scope, $http){
	$scope.currentRiddle = {};
	$scope.highlightCorrect = false;
	$scope.highlightWrong = false;
	var score = 0;
	var attempts = 0;

	$scope.checkCorrect = function(answerCorrect){
		attempts++;
		if (attempts == 5) {
			postUserDone(score);
			alert("Congrats! You've finished with a score of " + score + "/5");
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

	var getRiddle = function(){
		$http({
			method: "POST",
			url: "./post/riddle"
		})
		.then(function successCallback(res){
			console.log(res);
			$scope.currentRiddle.question = res.data.question;
			shuffle(res.data.options);
			$scope.currentRiddle.options = res.data.options;
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
