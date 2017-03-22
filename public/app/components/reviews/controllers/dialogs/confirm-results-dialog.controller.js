app
	.controller('confirmResultsDialogController', ['$scope', '$stateParams', 'Helper', function($scope, $stateParams, Helper) {
		var supervisorID = $stateParams.supervisorID;

		$scope.review = {}

		$scope.review.id = $stateParams.reviewID;
		$scope.review.supervisor_id = $stateParams.supervisorID;

		$scope.busy = false;

		$scope.submit = function(){
			if($scope.confirmationForm.$invalid){
				angular.forEach($scope.confirmationForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			$scope.busy = true;

			Helper.post('/review/confirm', $scope.review)
				.success(function(data){
					$scope.busy = false;

					if(data)
					{
						$scope.incorrect = true;
					}
					else{
						Helper.stop();
					}
				})
				.error(function(){
					$scope.busy = false;
					$scope.error = true;
				})
		}
	}]);