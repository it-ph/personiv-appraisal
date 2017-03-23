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
				// 'with':['user'],
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
				// 'with':['user'],
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
				'template':'/app/components/reviews/templates/dialogs/confirm-results-dialog.template.html',
				'controller':'confirmResultsDialogController',
			}

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Results applied.');
					$state.go('main');
				});
		}

		var rating = function(data){
			if(data < 70)
	        {
	            return 1;
	        }
	        else if(data >= 70 && data < 80)
	        {
	            return 2;             
	        }
	        else if(data >= 80 && data < 90)
	        {
	            return 3;             
	        }
	        else if(data >= 90 && data < 96)
	        {
	            return 4;             
	        }
	        else if(data >= 96 && data <= 100)
	        {
	            return 5;             
	        }
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

									var current_supervisor = $filter('filter')(data.goals[0].supervisor_goal_responses, {'user_id': supervisorID});

									$scope.toolbar.childState = current_supervisor[0].user.last_name + ', ' + current_supervisor[0].user.first_name;
									
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

									$scope.goals_supervisor_rating_average = rating(supervisor.goals);
									$scope.goals_self_assessment_rating_average = Math.round(self_assessment.goals);

									$scope.behavioral_competencies_supervisor_rating_average = supervisor.behavioral_competencies / $scope.review.behavioral_competencies.length;
									$scope.behavioral_competencies_self_assessment_rating_average = self_assessment.behavioral_competencies / $scope.review.behavioral_competencies.length;
									
									$scope.confirmed = $filter('filter')($scope.review.goals[0].supervisor_goal_responses, {'confirmed': 1}).length ? true : false;

									if(!$scope.confirmed)
									{
										$scope.review.average_goals_score = Math.round(($scope.goals_self_assessment_rating_average  + $scope.goals_supervisor_rating_average) / 2);
										$scope.review.average_behavioral_competency_score = Math.round(($scope.behavioral_competencies_self_assessment_rating_average  + $scope.behavioral_competencies_supervisor_rating_average) / 2);
										$scope.review.overall_rating = Math.round($scope.review.average_goals_score * $scope.review.appraisal_form.appraisal_period.goals_percentage + $scope.review.average_behavioral_competency_score * $scope.review.appraisal_form.appraisal_period.behavioral_competency_percentage);
									}

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