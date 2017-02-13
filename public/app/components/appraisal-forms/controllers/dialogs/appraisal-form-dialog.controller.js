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
				$scope.appraisal_form = data;
			})
			.error(function(){
				Helper.error();
			});
	}]);