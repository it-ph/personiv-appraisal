app
	.controller('appraisalFormDialogController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		var appraisalFormID = Helper.fetch();

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.manageEmployees = function(){
			Helper.stop();

			$state.go('main.manage-appraisal-form-employees', {'appraisalFormID': appraisalFormID});
		}

		$scope.update = function(){
			Helper.stop();

			$state.go('main.manage-appraisal-forms', {'appraisalFormID': appraisalFormID});
		}

		$scope.delete = function(){
			Helper.stop($scope.appraisal_form);
		}

		var query = {};

		query.with = [
			{
				'relation': 'account',
				'withTrashed': false,
			},
			{
				'relation': 'department',
				'withTrashed': false,
			},
			{
				'relation': 'goals',
				'withTrashed': false,
			},
			{
				'relation': 'behavioral_competencies',
				'withTrashed': false,
			},
			{
				'relation': 'reviews.user',
				'withTrashed': false,
			},
			{
				'relation': 'reviews.goals',
				'withTrashed': false,
			},
			{
				'relation': 'reviews.behavioral_competencies',
				'withTrashed': false,
			},
		];

		query.where = [
			{
				'label': 'id',
				'condition': '=',
				'value': appraisalFormID,
			},
		];

		query.first = true;

		Helper.post('/appraisal-form/enlist', query)
			.success(function(data){
				angular.forEach(data.reviews, function(review){
					if(review.behavioral_competencies.length || review.goals.length)
					{
						$scope.hideUpdate = true;
					}
				})

				$scope.appraisal_form = data;

			})
			.error(function(){
				Helper.error();
			});
	}]);