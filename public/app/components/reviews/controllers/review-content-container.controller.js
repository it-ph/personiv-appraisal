app
	.controller('reviewContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		$scope.form = {};

		var reviewID = $stateParams.reviewID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Review';

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {}

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.reviewForm.$invalid){
				angular.forEach($scope.form.reviewForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			var submit = function(){
				Helper.preload();

				if($scope.create)
				{							
					Helper.post('/review/self-assessment', $scope.review)
						.success(function(){
							Helper.stop();
							$state.go('main')
						})
						.error(function(){
							Helper.failed()
								.then(function(){
									submit();
								})
						})
				}
				else{
					Helper.post('/review/update-self-assessment', $scope.review)
						.success(function(){
							Helper.stop();
							Helper.notify('Changes saved.')
							$state.go('main');
						})
						.error(function(){
							Helper.failed()
								.then(function(){
									submit();
								})
						})
				}

			}

			submit();
		}

		$scope.request = {};

		$scope.request.withTrashed = false;
		$scope.request.first = true;	
		$scope.request.with = [
			{
				'relation':'appraisal_form.appraisal_period',
				'withTrashed': false,
			},
			{
				'relation':'goals.goal',
				'withTrashed': false,
			},
			{
				'relation':'behavioral_competencies.behavioral_competency',
				'withTrashed': false,
			},
		];
		$scope.request.where = [
			{
				'label': 'id',
				'condition': '=',
				'value': reviewID,
			},
		];


		$scope.init = function(query){
			Helper.post(route + '/enlist', query)
				.success(function(data){
					$scope.review = data;

					if(!data.goals.length && !data.behavioral_competencies.length)
					{
						$scope.create = true;
					}

					angular.forEach(data.goals, function(item){
						item.parameter = item.goal.parameter;
						item.weight = item.goal.weight;
					});

					angular.forEach(data.behavioral_competencies, function(item){
						item.parameter = item.behavioral_competency.parameter;
						item.description = item.behavioral_competency.description;
					});

					data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start)
					data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end)

					$scope.toolbar.childState = $filter('date')(data.appraisal_form.appraisal_period.start, 'MMM. dd, yyyy')  + ' to ' + $filter('date')(data.appraisal_form.appraisal_period.end, 'MMM. dd, yyyy');
				
					var appraisal_form_query = {
						'with': [
							{
								'relation': 'goals',
								'withTrashed': false,
							},
							{
								'relation': 'behavioral_competencies',
								'withTrashed': false,
							},
						],
						'where': [
							{
								'label': 'id',
								'condition': '=',
								'value': data.appraisal_form.id,
							},
						],
						'first': true,
						'withTrashed': false,
					}

					var appraisalForm = function(){
						Helper.post('/appraisal-form/enlist', appraisal_form_query)
							.success(function(data){
								angular.forEach(data.goals, function(item){
									item.self_assessment = 3;
								});

								angular.forEach(data.behavioral_competencies, function(item){
									item.self_appraisal_rating = 3;
								});

								$scope.appraisal_form = data;

								if(!$scope.review.goals.length)
								{
									$scope.review.goals = data.goals;
								}

								if(!$scope.review.behavioral_competencies.length)
								{									
									$scope.review.behavioral_competencies = data.behavioral_competencies;
								}
							})
							.error(function(){
								Helper.failed()
									.then(function(){
										appraisalForm();
									})
							})
					}

					appraisalForm();
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.init($scope.request);
						});
				});
		}

		Helper.get('/review/' + reviewID)
			.success(function(){
				$scope.init($scope.request);
			})
			.error(function(){
				$state.go('page-not-found');
			})
	}]);