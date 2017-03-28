app
	.controller('appraisalPeriodDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		var route = '/appraisal-period';

		$scope.years = [];

		for (var i = new Date().getFullYear(); i >= 2016; i--) {
			$scope.years.push(i);
		}

		$scope.minDate = new Date('12/01/2015');
		$scope.today = new Date();

		if($scope.config.action == 'create')
		{
			$scope.appraisal_period = {};

			$scope.appraisal_period.start = new Date(new Date().getFullYear()-2, 11, 1);
			$scope.appraisal_period.end = new Date(new Date().getFullYear()-1, 10, 30);
		}
		else if($scope.config.action == 'edit')
		{
			var query = {}

			query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': $scope.config.id,
				}
			];

			query.first = true;

			Helper.post(route + '/enlist', query)
				.success(function(data){
					$scope.appraisal_period = data;

					$scope.appraisal_period.behavioral_competency_percentage = $scope.appraisal_period.behavioral_competency_percentage * 100;
					$scope.appraisal_period.goals_percentage = $scope.appraisal_period.goals_percentage * 100;

					$scope.appraisal_period.start = new Date($scope.appraisal_period.start);
					$scope.appraisal_period.end = new Date($scope.appraisal_period.end);
					

				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.setBehavorial = function(){
			$scope.appraisal_period.behavioral_competency_percentage = 100 - $scope.appraisal_period.goals_percentage;
		}

		$scope.setGoals = function(){
			$scope.appraisal_period.goals_percentage = 100 - $scope.appraisal_period.behavioral_competency_percentage;
		}

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			if($scope.appraisal_period.start > $scope.appraisal_period.end)
			{
				$scope.appraisal_period.end = new Date($scope.appraisal_period.start);
			}

			$scope.appraisal_period.start = new Date($scope.appraisal_period.start).toDateString();
			$scope.appraisal_period.end = new Date($scope.appraisal_period.end).toDateString();

			Helper.post(route + '/check-duplicate', $scope.appraisal_period)
				.success(function(data){
					$scope.duplicate = data;

					$scope.appraisal_period.start = new Date($scope.appraisal_period.start);
					$scope.appraisal_period.end = new Date($scope.appraisal_period.end);
				})
				.error(function(){
					$scope.error = true;

					$scope.appraisal_period.start = new Date($scope.appraisal_period.start);
					$scope.appraisal_period.end = new Date($scope.appraisal_period.end);	
				})
		}

		var revertDates = function(){
			$scope.appraisal_period.start = new Date($scope.appraisal_period.start);
			$scope.appraisal_period.end = new Date($scope.appraisal_period.end);
		}

		$scope.submit = function(){
			if($scope.appraisalPeriodForm.$invalid){
				angular.forEach($scope.appraisalPeriodForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			$scope.appraisal_period.start = new Date($scope.appraisal_period.start).toDateString();
			$scope.appraisal_period.end = new Date($scope.appraisal_period.end).toDateString();

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post(route, $scope.appraisal_period)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							revertDates();
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put(route + '/' + $scope.config.id, $scope.appraisal_period)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							revertDates();
						});
				}
			}
		}
	}]);