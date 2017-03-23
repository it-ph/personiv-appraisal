app
	.controller('reviewContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		var reviewID = $stateParams.reviewID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Team Review';

		$scope.toolbar.hideSearchIcon = true;
		
		/*
		 * Object for request
		 *
		*/
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
				'relation':'goals.supervisor_goal_responses',
				'withTrashed': false,
				'where': [
					{
						'label': 'confirmed', 
						'condition': '=',
						'value': 1,
					},
					{
						'label': 'rank', 
						'condition': '=',
						'value': 'supervisor',
					},
				],
			},
			{
				'relation':'behavioral_competencies.behavioral_competency',
				'withTrashed': false,
			},
			{
				'relation':'behavioral_competencies.supervisor_behavioral_competency_responses',
				'withTrashed': false,
				'where': [
					{
						'label': 'confirmed', 
						'condition': '=',
						'value': 1,
					},
					{
						'label': 'rank', 
						'condition': '=',
						'value': 'supervisor',
					},
				],
			},
			{
				'relation':'user',
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
			var fetchUser = function(){
				Helper.post('/user/check')
					.success(function(data){
						var user = data;

						var review = function(){
							Helper.post(route + '/enlist', query)
								.success(function(data){
									if(!data || (!data.goals.length && !data.behavioral_competencies.length) || user.id == data.user_id || user.department_id != data.user.department_id)
									{
										$state.go('page-not-found');
									}

									data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start);
									data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end);

									$scope.toolbar.childState = data.user.last_name + ', ' + data.user.first_name;
									
									$scope.review = data;

									$scope.isLoading = false;
								})
								.error(function(){
									Helper.failed()
										.then(function(){
											review();
										});
								});
						}

						review();
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								fetchUser();
							})
					});
			}

			fetchUser();
		}

		$scope.refresh = function(){
			$scope.isLoading = true;

  			$scope.init($scope.request);
		};

		$scope.evaluate = function(id){
			$state.go('main.supervisor-review', {'reviewID':id});
		}

		$scope.isLoading = true;
		$scope.init($scope.request);
	}]);