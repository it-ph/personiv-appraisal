app
	.controller('supervisorReviewContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		var reviewID = $stateParams.reviewID;

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
					Helper.post('/review/update-supervisor-response', $scope.review)
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

						var review = function(){
							Helper.post(route + '/enlist', query)
								.success(function(data){
									if(!data || (!data.goals.length && !data.behavioral_competencies.length))
									{
										$state.go('page-not-found');
									}

									data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start);
									data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end);

									$scope.toolbar.childState = data.user.last_name + ', ' + data.user.first_name + ' ' + data.user.middle_name.charAt(0).toUpperCase() +'.';
									
									angular.forEach(data.behavioral_competencies, function(item){
										item.supervisor_rating = 3;
									})

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