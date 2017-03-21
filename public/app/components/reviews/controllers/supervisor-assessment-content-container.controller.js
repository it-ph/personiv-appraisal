app
	.controller('supervisorAssessmentContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		var reviewID = $stateParams.reviewID;
		var supervisorID = $stateParams.supervisorID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Supervisor Assessment';

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
						'label': 'user_id', 
						'condition': '=',
						'value': supervisorID,
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
						'label': 'user_id', 
						'condition': '=',
						'value': supervisorID,
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

		$scope.confirm = function(){
			var dialog = {
				'title':'Confirm Results',
				'message': 'Enter Password',
				'ok': 'Submit',
				'cancel': 'cancel',
			}

			Helper.prompt(dialog)
				.then(function(response){
					Helper.preload();

					var request = {
						'password': response,
					}

					var review = function(){						
						Helper.post('/review/confirm', request)
							.success(function(data){
								if(data)
								{
									var confirm = {
										'title': 'Incorrect Password',
										'message': 'The password you have entered is incorrect. Please try again.',
										'ok': 'Okay',
										'cancel': 'cancel',	
									}

									Helper.confirm()
										.then(function(){
											$scope.confirm();	
										})
								}
								else{
									Helper.stop();
									Helper.notify('Results applied.');
									$state.go('main');
								}
							})
							.error(function(){
								Helper.failed()
									.then(function(){
										$scope.confirm();			
									})
							})
					}

					review();
				})
		}

		$scope.init = function(query){		
			var fetchUser = function(){
				Helper.post('/user/check')
					.success(function(data){
						var user = data;

						var review = function(){
							Helper.post(route + '/enlist', query)
								.success(function(data){
									if(!data || (!data.goals[0].supervisor_goal_responses.length && !data.behavioral_competencies[0].supervisor_behavioral_competency_responses.length) || user.id != data.user_id)
									{
										$state.go('page-not-found');
									}


									data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start);
									data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end);

									$scope.toolbar.childState = data.goals[0].supervisor_goal_responses[0].user.last_name + ', ' + data.goals[0].supervisor_goal_responses[0].user.first_name;
									
									$scope.review = data;

									var self_assessment = {
										'goals': 0,
										'behavioral_competencies': 0
									}

									var supervisor = {
										'goals': 0,
										'behavioral_competencies': 0
									}

									angular.forEach($scope.review.goals, function(goal){
										self_assessment.goals += goal.self_assessment * goal.goal.weight;
										supervisor.goals += goal.supervisor_goal_responses[0].raw_score * goal.goal.weight;
									});

									angular.forEach($scope.review.behavioral_competencies, function(behavioral_competency){
										self_assessment.behavioral_competencies += behavioral_competency.self_appraisal_rating;
									});

									angular.forEach($scope.review.behavioral_competencies.supervisor_behavioral_competency_responses, function(supervisor_behavioral_competency){
										supervisor.behavioral_competencies += supervisor_behavioral_competency.supervisor_rating;
									});

									$scope.goals_self_assessment_rating_average = Math.floor(self_assessment.goals);
									
									if(supervisor.goals < 70)
							        {
							            $scope.goals_supervisor_rating_average = 1;
							        }
							        else if(supervisor.goals >= 70 && supervisor.goals < 80)
							        {
							            $scope.goals_supervisor_rating_average = 2;             
							        }
							        else if(supervisor.goals >= 80 && supervisor.goals < 90)
							        {
							            $scope.goals_supervisor_rating_average = 3;             
							        }
							        else if(supervisor.goals >= 90 && supervisor.goals < 96)
							        {
							            $scope.goals_supervisor_rating_average = 4;             
							        }
							        else if(supervisor.goals >= 96 && supervisor.goals <= 100)
							        {
							            $scope.goals_supervisor_rating_average = 5;             
							        }

									$scope.confirmed = $filter('filter')($scope.review.goals.supervisor_goal_responses, {'confirmed': 1}, true) ? true : false;

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

		$scope.isLoading = true;
		$scope.init($scope.request);
	}]);