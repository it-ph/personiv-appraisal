app
	.controller('reviewContentContainerController', ['$scope', '$filter', '$state', 'Helper', function($scope, $filter, $state, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		$scope.form = {};

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
				'relation':'goals',
				'withTrashed': false,
			},
			{
				'relation':'behavioral_competencies',
				'withTrashed': false,
			},
		];


		$scope.init = function(query){
			Helper.post(route + '/enlist', query)
				.success(function(data){
					$scope.review = data;

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
								$scope.appraisal_form = data;
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

		$scope.init($scope.request);
	}]);