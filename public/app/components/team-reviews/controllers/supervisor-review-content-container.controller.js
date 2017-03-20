app
	.controller('supervisorReviewContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		var reviewID = $stateParams.reviewID;

		$scope.form = {}

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Supervisor Review';

		$scope.toolbar.hideSearchIcon = true;

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
					Helper.post('/review/supervisor-response', $scope.review)
						.success(function(){
							Helper.stop();
							$state.go('main.team-reviews');
						})
						.error(function(){
							Helper.failed()
								.then(function(){
									submit();
								})
						})
				}
				else{
					Helper.post('/review/update-supervisor-response', $scope.review)
						.success(function(){
							Helper.stop();
							Helper.notify('Changes saved.')
							$state.go('main.team-reviews');
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

		$scope.setRating = function(data){
			data.raw_score = Math.floor(data.raw_score);

			if(data.raw_score < 70)
			{
				data.supervisor_rating = 1;
			}
			else if(data.raw_score >= 70 && data.raw_score < 80)
			{
				data.supervisor_rating = 2;				
			}
			else if(data.raw_score >= 80 && data.raw_score < 90)
			{
				data.supervisor_rating = 3;				
			}
			else if(data.raw_score >= 90 && data.raw_score < 96)
			{
				data.supervisor_rating = 4;				
			}
			else if(data.raw_score >= 96 && data.raw_score <= 100)
			{
				data.supervisor_rating = 5;				
			}
		}

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
				'relation':'goals.supervisor_goal_responses.user',
				'withTrashed': false,
			},
			{
				'relation':'behavioral_competencies.behavioral_competency',
				'withTrashed': false,
			},
			{
				'relation':'behavioral_competencies.supervisor_behavioral_competency_responses.user',
				'withTrashed': false,
			},
			{
				'relation': 'user',
				'withTrashed': false,	
			}
		];
		$scope.request.where = [
			{
				'label': 'id',
				'condition': '=',
				'value': reviewID,
			},
		];

		$scope.init = function(query){		
			var userCheck = function(){
				Helper.post('/user/check')
					.success(function(data){
						var user = data;

						var supervisor = $filter('filter')(data.roles, {'name': 'supervisor'}, true) ? true : false;
						var manager = data.head_of ? true : false;
						var director = $filter('filter')(data.roles, {'name': 'director'}, true) ? true : false;

						var review = function(){
							Helper.post(route + '/enlist', query)
								.success(function(data){
									if(!data || (!data.goals.length && !data.behavioral_competencies.length) || user.id == data.user_id)
									{
										$state.go('page-not-found');
									}

									data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start);
									data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end);

									$scope.toolbar.childState = data.user.last_name + ', ' + data.user.first_name + ' ' + data.user.middle_name.charAt(0).toUpperCase() +'.';
									
									$scope.create = true;

									angular.forEach(data.behavioral_competencies, function(item){
										var response = $filter('filter')(item.supervisor_behavioral_competency_responses, {'user_id':user.id}, true);
										var supervisor_response = $filter('filter')(item.supervisor_behavioral_competency_responses, {'rank':'supervisor'}, true);
										var manager_response = $filter('filter')(item.supervisor_behavioral_competency_responses, {'rank':'manager'}, true);

										if(response.length)
										{
											item.supervisor_rating = response[0].supervisor_rating;
											item.supervisor_behavioral_competency_response_id = response[0].id;
											$scope.create = false;
										}
										else{
											item.supervisor_rating = 3;

											if(!supervisor_response.length && supervisor)
											{
												if(user.department_id != data.user.department_id)
												{
													$state.go('page-not-found');
												}

												item.rank =  'supervisor'; 
											}
											else if(supervisor_response.length && manager){
												if(user.department_id != data.user.department_id)
												{
													$state.go('page-not-found');
												}

												item.rank = 'manager';
											}
											else if(supervisor_response.length && manager_response.length && director){
												item.rank = 'director';
											}
											else{
												$state.go('page-not-found');
											}
										}
									});
									
									angular.forEach(data.goals, function(item){
										var response = $filter('filter')(item.supervisor_goal_responses, {'user_id':user.id}, true);
										var supervisor_response = $filter('filter')(item.supervisor_goal_responses, {'rank':'supervisor'}, true);
										var manager_response = $filter('filter')(item.supervisor_goal_responses, {'rank':'manager'}, true);


										if(response.length)
										{
											item.supervisor_goal_response_id = response[0].id;
											item.raw_score = response[0].raw_score;
											item.supervisor_rating = response[0].supervisor_rating;
											item.supervisor_remarks = response[0].supervisor_remarks;
										}
										else{

											if(!supervisor_response.length && supervisor)
											{
												item.rank =  'supervisor'; 
											}
											else if(supervisor_response.length && manager){
												if(user.department_id != data.user.department_id)
												{
													$state.go('page-not-found');
												}

												item.rank = 'manager';
											}
											else if(supervisor_response.length && manager_response.length && director){
												item.rank = 'director';
											}
											else{
												$state.go('page-not-found');
											}
										}

									});

									$scope.review = data;

									$scope.isLoading = false;
								})
								.error(function(){
									Helper.failed()
										.then(function(){
											review(query);
										});
								});
						}

						review(query);

					})
					.error(function(){
						Helper.failed()
							.then(function(){
								userCheck();
							})
					})
			}

			userCheck();
		}

		$scope.refresh = function(){
			$scope.isLoading = true;

  			$scope.init($scope.request);
		};

		$scope.isLoading = true;
		$scope.init($scope.request);
	}]);