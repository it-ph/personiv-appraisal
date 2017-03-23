app
	.controller('confirmResultsDialogController', ['$scope', '$stateParams', 'Helper', function($scope, $stateParams, Helper) {
		var query = {
			'where' : [
				{
					'label':'id',
					'condition':'=',
					'value': $stateParams.reviewID,
				}
			],
			'first': true,
		}

		Helper.post('/review/enlist', query)
			.success(function(data){
				$scope.review = data;
				$scope.review.supervisor_id = $stateParams.supervisorID;
			})
			.error(function(){
				Helper.error();
			})


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