var app = angular.module('app', ['shared']);
app
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'reviewsContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'reviewsToolbarController',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main':{
						templateUrl: '/app/components/reviews/templates/content/reviews-content.template.html',
					}
				}
			})
			.state('main.self-assessment', {
				url: 'self-assessment/{reviewID}',
				params: {'reviewID':null},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'selfAssessmentContentContainerController',
					},
					'toolbar@main.self-assessment': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.self-assessment': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.self-assessment':{
						templateUrl: '/app/components/reviews/templates/content/self-assessment-content.template.html',
					}
				}
			})
			.state('main.supervisor-assessment', {
				url: 'review/{reviewID}/supervisor/{supervisorID}',
				params: {'reviewID':null, 'supervisorID':null},
				resolve: {
					authorization: ['Helper', '$state', '$stateParams', function(Helper, $state, $stateParams){
						Helper.get('/review/' + $stateParams.reviewID)
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'supervisorAssessmentContentContainerController',
					},
					'toolbar@main.supervisor-assessment': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.supervisor-assessment': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.supervisor-assessment':{
						templateUrl: '/app/components/reviews/templates/content/supervisor-assessment-content.template.html',
					}
				}
			})
			.state('main.team-reviews', {
				url: 'team-reviews',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.post('/user-role/review-authorization')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'teamReviewsContentContainerController',
					},
					'toolbar@main.team-reviews': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'teamReviewsToolbarController',
					},
					'left-sidenav@main.team-reviews': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.team-reviews':{
						templateUrl: '/app/components/team-reviews/templates/content/team-reviews-content.template.html',
					}
				}
			})
			.state('main.review', {
				url: 'team-review/{reviewID}',
				params: {'reviewID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.post('/user-role/review-authorization')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'reviewContentContainerController',
					},
					'toolbar@main.review': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.review': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.review':{
						templateUrl: '/app/components/reviews/templates/content/review-content.template.html',
					}
				}
			})
			.state('main.supervisor-review', {
				url: 'team-review/{reviewID}/supervisor',
				params: {'reviewID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.post('/user-role/review-authorization')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'supervisorReviewContentContainerController',
					},
					'toolbar@main.supervisor-review': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.supervisor-review': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.supervisor-review':{
						templateUrl: '/app/components/team-reviews/templates/content/supervisor-review-content.template.html',
					}
				}
			})
			.state('main.notifications', {
				url: 'notifications',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'notificationsContentContainerController',
					},
					'toolbar@main.notifications': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'notificationsToolbarController',
					},
					'left-sidenav@main.notifications': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.notifications':{
						templateUrl: '/app/components/notifications/templates/content/notifications-content.template.html',
					},
				}
			})
			// .state('main.reviews', {
			// 		url: 'reviews',
			// 		views: {
			// 			'content-container': {
			// 				templateUrl: '/app/shared/views/content-container.view.html',
			// 				controller: 'reviewsContentContainerController',
			// 			},
			// 			'toolbar@main.reviews': {
			// 				templateUrl: '/app/shared/templates/toolbar.template.html',
			// 				controller: 'reviewsToolbarController',
			// 			},
			// 			'left-sidenav@main.reviews': {
			// 				templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
			// 			},
			// 			'content@main.reviews':{
			// 				templateUrl: '/app/components/reviews/templates/content/reviews-content.template.html',
			// 			}
			// 		}
			// 	})
			.state('main.appraisal-forms', {
				url: 'appraisal-forms',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/appraisal-form/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'appraisalFormsContentContainerController',
					},
					'toolbar@main.appraisal-forms': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'appraisalFormsToolbarController',
					},
					'left-sidenav@main.appraisal-forms': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.appraisal-forms':{
						templateUrl: '/app/components/appraisal-forms/templates/content/appraisal-forms-content.template.html',
					}
				}
			})
			.state('main.manage-appraisal-forms', {
				url: 'appraisal-forms/{appraisalFormID}',
				params: {'appraisalFormID': null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/appraisal-form/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'manageAppraisalFormsContentContainerController',
					},
					'toolbar@main.manage-appraisal-forms': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.manage-appraisal-forms': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.manage-appraisal-forms':{
						templateUrl: '/app/components/appraisal-forms/templates/content/manage-appraisal-forms-content.template.html',
					}
				}
			})
			.state('main.manage-appraisal-form-employees', {
				url: 'appraisal-forms/{appraisalFormID}/employees',
				params: {'appraisalFormID': null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/appraisal-form/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'manageAppraisalFormEmployeesContentContainerController',
					},
					'toolbar@main.manage-appraisal-form-employees': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.manage-appraisal-form-employees': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.manage-appraisal-form-employees':{
						templateUrl: '/app/components/appraisal-forms/templates/content/manage-appraisal-form-employees-content.template.html',
					}
				}
			})
			.state('main.appraisal-periods', {
				url: 'settings/appraisal-periods',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/appraisal-period/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'appraisalPeriodsContentContainerController',
					},
					'toolbar@main.appraisal-periods': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'appraisalPeriodsToolbarController',
					},
					'left-sidenav@main.appraisal-periods': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.appraisal-periods':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.departments', {
				url: 'settings/departments',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/department/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'departmentsContentContainerController',
					},
					'toolbar@main.departments': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'departmentsToolbarController',
					},
					'left-sidenav@main.departments': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.departments':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.users', {
				url: 'settings/users',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/user/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'usersContentContainerController',
					},
					'toolbar@main.users': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'usersToolbarController',
					},
					'left-sidenav@main.users': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.users':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
	}]);
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
				'relation':'behavioral_competencies.behavioral_competency',
				'withTrashed': false,
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

									$scope.toolbar.childState = data.user.last_name + ', ' + data.user.first_name + ' ' + data.user.middle_name.charAt(0).toUpperCase() +'.';
									
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
app
	.controller('reviewsContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		$scope.selfAssessment = function(id){
			$state.go('main.self-assessment', {'reviewID':id});
		}

		$scope.supervisorAssessment = function(review_id, supervisor_id){
			$state.go('main.supervisor-assessment', {'reviewID':review_id, 'supervisorID':supervisor_id});
		}

		var setInit = function(){
			Helper.post('/user/check')
				.success(function(data){
					$scope.request = {};

					$scope.request.withTrashed = false;
					$scope.request.paginate = 20;	
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
							],
							'orderBy': {
								'label':'updated_at',
								'sort': 'desc',
							},
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
							],
							'orderBy': {
								'label':'updated_at',
								'sort': 'desc',
							},
						},
					];
					$scope.request.where = [
						{
							'label': 'user_id',
							'condition': '=',
							'value': data.id,
						},
					];

					$scope.isLoading = true;
					$scope.$broadcast('close');

					$scope.init($scope.request);
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							setInit();
						})
				})
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

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start);
			data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end);

			var item = {};

			item.display = data.appraisal_form.appraisal_period.appraisal_year;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.review = {};
			$scope.review.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.review.page = 2;

			var reviews = function(query){				
				Helper.post(route + '/enlist', query)
					.success(function(data){
						$scope.review.details = data;
						$scope.review.items = data.data;
						$scope.review.show = true;

						if(data.data.length){
							// iterate over each record and set the format
							angular.forEach(data.data, function(item){
								pushItem(item);
							});
						}

						$scope.review.paginateLoad = function(){
							// kills the function if ajax is busy or pagination reaches last page
							if($scope.review.busy || ($scope.review.page > $scope.review.details.last_page)){
								$scope.isLoading = false;
								return;
							}
							/**
							 * Executes pagination call
							 *
							*/
							// sets to true to disable pagination call if still busy.
							$scope.review.busy = true;
							$scope.isLoading = true;
							// Calls the next page of pagination.
							Helper.post(route + '/enlist' + '?page=' + $scope.review.page, query)
								.success(function(data){
									// increment the page to set up next page for next AJAX Call
									$scope.review.page++;

									// iterate over each data then splice it to the data array
									angular.forEach(data.data, function(item, key){
										pushItem(item);
										$scope.review.items.push(item);
									});

									// Enables again the pagination call for next call.
									$scope.review.busy = false;
									$scope.isLoading = false;
								})
								.error(function(){
									Helper.failed()
										.then(function(){
											$scope.review.paginateLoad();
										});
								});
						}
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								reviews(query);
							});
					});
			}

			reviews(query);
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.review.show = false;

  			$scope.init($scope.request);
		};

		setInit();
	}]);
app
	.controller('selfAssessmentContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		$scope.form = {};

		var reviewID = $stateParams.reviewID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Self Assessment';

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

									$scope.goals_supervisor_rating_average = rating(supervisor.goals);
									$scope.goals_self_assessment_rating_average = Math.round(self_assessment.goals);

									$scope.behavioral_competencies_supervisor_rating_average = supervisor.behavioral_competencies / $scope.review.behavioral_competencies.length;
									$scope.behavioral_competencies_self_assessment_rating_average = self_assessment.behavioral_competencies / $scope.review.behavioral_competencies.length;
									
									$scope.confirmed = $filter('filter')($scope.review.goals[0].supervisor_goal_responses, {'confirmed': 1}, true) ? true : false;

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
app
	.controller('mainViewController', ['$scope', '$filter', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', 'FileUploader', function($scope, $filter, $state, $mdDialog, $mdSidenav, $mdToast, Helper, FileUploader){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};
		$scope.menu.pages = [];

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-home',
				'label': 'Home',
				'show': true,
			},
			{
				'state': 'main.appraisal-forms',
				'icon': 'mdi-playlist-check',
				'label': 'Appraisal Forms',
			},
			{
				'state': 'main.dashboard',
				'icon': 'mdi-view-dashboard',
				'label': 'Dashboard',
			},
			{
				'state': 'main.team-reviews',
				'icon': 'mdi-account-multiple',
				'label': 'Team Reviews',
			},
		];

		$scope.menu.section = [];

		$scope.menu.section[0] = {
			'name':'Settings',
			'icon':'mdi-settings',
		}

		$scope.menu.pages[0] = [
			{
				'label': 'Appraisal Periods',
				action: function(){
					$state.go('main.appraisal-periods');
				},
			},
			{
				'label': 'Departments',
				action: function(){
					$state.go('main.departments');
				},
			},
			{
				'label': 'Users',
				action: function(){
					$state.go('main.users');
				},
			},
		]

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
		
		$scope.logout = function(){
			Helper.post('/user/logout')
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	Helper.notify('Password changed.')
		    });
		}

		var uploader = {};

		uploader.filter = {
            name: 'photoFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        uploader.sizeFilter = {
		    'name': 'enforceMaxFileSize',
		    'fn': function (item) {
		        return item.size <= 2000000;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.photoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.clickUpload = function(){
		    angular.element('#upload').trigger('click');
		};

		$scope.markAllAsRead = function(){
			Helper.post('/user/mark-all-as-read')
				.success(function(){
					$scope.user.unread_notifications = [];
				})
		}

		var fetchUnreadNotifications = function(){
			Helper.post('/user/check')
	    		.success(function(data){
	    			$scope.user = data;
	    		});
		}

		Helper.post('/user/check')
			.success(function(data){
				var settings = false;
				var settings_menu = [];

				$scope.menu.static[1].show = $filter('filter')(data.roles, {'name':'parameters'}, true) ? true : false;
				$scope.menu.static[2].show = $filter('filter')(data.roles, {'name':'dashboard'}, true) ? true : false;

				if($filter('filter')(data.roles, {'name':'supervisor'}, true) || $filter('filter')(data.roles, {'name':'director'}, true) || data.head_of)
				{
					$scope.menu.static[3].show = true					
				}

				$scope.menu.pages[0][0].show = $filter('filter')(data.roles, {'name':'appraisal-periods'}, true) ? true : false;
				$scope.menu.pages[0][1].show = $filter('filter')(data.roles, {'name':'manage-departments'}, true) ? true : false;
				$scope.menu.pages[0][2].show = $filter('filter')(data.roles, {'name':'manage-users'}, true) ? true : false;

				var notifications = {
					'state': 'main.notifications',
					'icon': 'mdi-bell',
					'label': 'Notifications',
					'show': true,
				}

				$scope.menu.static.push(notifications);

				$scope.user = data;

				$scope.currentTime = Date.now();

				Helper.setAuthUser(data);

				/* Photo Uploader */
				$scope.photoUploader = new FileUploader({
					url: '/user/upload-avatar/' + $scope.user.id,
					headers: uploader.headers,
					queueLimit : 1
				})

				// FILTERS
		        $scope.photoUploader.filters.push(uploader.filter);
		        $scope.photoUploader.filters.push(uploader.sizeFilter);
		        
				$scope.photoUploader.onWhenAddingFileFailed = uploader.error;
				$scope.photoUploader.onAfterAddingFile  = function(){
					$scope.fileError = false;
					if($scope.photoUploader.queue.length)
					{	
						$scope.photoUploader.uploadAll()
					}
				};

				$scope.photoUploader.onCompleteItem  = function(data, response){
					if($scope.user.avatar_path)
					{
						$scope.currentTime = Date.now();
						$scope.photoUploader.queue = [];
					}
					else{
						$state.go($state.current, {}, {reload:true});
					}
				}

				var pusher = new Pusher('ade8d83d4ed5455e3e18', {
			      	encrypted: true,
			      	auth: {
					    headers: {
					      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
					    }
				  	}
			    });

				var channel = {};

				channel.user = pusher.subscribe('private-App.User.' + $scope.user.id);

				channel.user.bindings = [
				 	channel.user.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', function(data) {
				 		// formating the notification
				 		data.created_at = data.attachment.created_at;

				 		data.data = {};
				 		data.data.attachment = data.attachment;
				 		data.data.url = data.url;
				 		data.data.withParams = data.withParams;
				 		data.data.sender = data.sender;
				 		data.data.message = data.message;

				 		// pushes the new notification in the unread_notifications array
				 		$scope.$apply(function(){
					    	$scope.user.unread_notifications.unshift(data);
				 		});

				 		// notify the user with a toast message
				 		Helper.notify(data.sender.name + ' ' + data.message);

				 		if($state.current.name == data.data.url)
						{
							$state.go($state.current, {}, {reload:true});
						}
				    }),
				];
			})

		$scope.markAsRead = function(notification){
			Helper.post('/user/mark-as-read', notification)
				.success(function(){
					var index = $scope.user.unread_notifications.indexOf(notification);

					$scope.user.unread_notifications.splice(index, 1);
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.read = function(notification){			
			$state.go(notification.data.url);

			$scope.markAsRead(notification);
		}

		$scope.$on('closeSidenav', function(){
			$mdSidenav('left').close();
		});
	}]);
app
	.controller('appraisalPeriodsContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		$scope.state = $state.current.name;

		var route = '/appraisal-period';
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Users';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/appraisal-period-dialog.template.html',
				'controller': 'appraisalPeriodDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Appraisal Period created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/appraisal-period-dialog.template.html',
				'controller': 'appraisalPeriodDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Appraisal Period updated.');
				}, function(){
					return;
				});
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.appraisal_year + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete(route + '/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Appraisal Period deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;
			data.start = new Date(data.start);
			data.end = new Date(data.end);
			data.hideDelete = data.appraisal_forms_count ? true : false;

			var item = {};

			item.display = data.appraisal_year;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post(route + '/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post(route + '/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;	
		$scope.request.withCount = [
			{
				'relation':'appraisal_forms',
				'withTrashed': false,
			},
		];

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('departmentsContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		$scope.state = $state.current.name;
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Users';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/department-dialog.template.html',
				'controller': 'departmentDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Department created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/department-dialog.template.html',
				'controller': 'departmentDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Department updated.');
				}, function(){
					return;
				});
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.name + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/department/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Department deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;
			data.hideDelete = data.users_count ? true : false;

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/department/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/department/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;	
		$scope.request.with = [
			{
				'relation':'accounts',
				'withTrashed':false,
			},
			{
				'relation':'heads',
				'withTrashed':false,
			},
		];
		$scope.request.withCount = [
			{
				'relation':'users',
				'withTrashed': false,
			},
		];

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('usersContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		$scope.state = $state.current.name;
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Users';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/user-dialog.template.html',
				'controller': 'userDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('User created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/user-dialog.template.html',
				'controller': 'userDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('User updated.');
				}, function(){
					return;
				});
		}

		$scope.resetPassword = function(data){
			var dialog = {};
			dialog.title = 'Reset Password';
			dialog.message = 'Password will be reset to "!welcome10"';
			dialog.ok = 'Reset Password';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.post('/user/reset-password', data)
						.success(function(){
							$scope.refresh();
							Helper.notify('Reset password succesful.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.name + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/user/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('User deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/user/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/user/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;	
		$scope.request.with = [
			{
				'relation':'department',
				'withTrashed':false,
			},
			{
				'relation':'head_of',
				'withTrashed':false,
			},
			{
				'relation':'account',
				'withTrashed':false,
			},
			{
				'relation':'roles',
				'withTrashed':false,
			},
		]
		$scope.request.where = [
			{
				'label':'super_admin',
				'condition':'!=',
				'value':true,
			},
		]
		$scope.request.do_not_include_current_user = true;


		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
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

									$scope.toolbar.childState = data.user.last_name + ', ' + data.user.first_name;
									
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
app
	.controller('teamReviewsContentContainerController', ['$scope', '$state', '$filter', 'Helper', function($scope, $state, $filter, Helper){
		$scope.$emit('closeSidenav');

		var route = '/appraisal-form';

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		var setInit = function(){
			Helper.post('/user/check')
				.success(function(data){
					$scope.request = {};

					$scope.request.withTrashed = false;
					$scope.request.paginate = 20;	
					$scope.request.with = [
						{
							'relation': 'department',
							'withTrashed': false,
						},
						{
							'relation': 'appraisal_period',
							'withTrashed': false,
						},
					];

					var supervisor = $filter('filter')(data.roles, {'name': 'supervisor'}, true);

					if(supervisor.length)
					{
						$scope.request.with.push({
							'relation': 'reviews',
							'withTrashed': false,
							'has': ['behavioral_competencies', 'goals'],
							'whereHas': [
								{
									'relation': 'user',
									'where': [
										{
											'label': 'immediate_supervisor_id',
											'condition': '=',
											'value': data.id
										},
									]
								}
							]
						});
					}
					
					$scope.request.where = [
						{
							'label': 'department_id',
							'condition': '=',
							'value': data.department_id,
						},
					];

					// if(!data.)

					$scope.isLoading = true;
					$scope.$broadcast('close');

					$scope.init($scope.request);
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							setInit();
						})
				})
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.appraisal_period.start = new Date(data.appraisal_period.start);
			data.appraisal_period.end = new Date(data.appraisal_period.end);

			data.pending_reviews = [];
			data.done_reviews = [];

			angular.forEach(data.reviews, function(review){
				if(review.overall_rating)
				{
					data.done_reviews.push(review)
				}
				else{
					data.pending_reviews.push(review)
				}
			});

			var item = {};

			item.display = data.appraisal_period.appraisal_year;

			$scope.toolbar.items.push(item);
		}

		$scope.view = function(id){
			$state.go('main.review', {'reviewID':id});
		}

		$scope.init = function(query){
			$scope.appraisal_form = {};
			$scope.appraisal_form.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.appraisal_form.page = 2;

			var fetch = function(query){				
				Helper.post(route + '/enlist', query)
					.success(function(data){
						$scope.appraisal_form.details = data;
						$scope.appraisal_form.items = data.data;
						$scope.appraisal_form.show = true;

						if(data.data.length){
							// iterate over each record and set the format
							angular.forEach(data.data, function(item){
								pushItem(item);
							});
						}

						$scope.appraisal_form.paginateLoad = function(){
							// kills the function if ajax is busy or pagination reaches last page
							if($scope.appraisal_form.busy || ($scope.appraisal_form.page > $scope.appraisal_form.details.last_page)){
								$scope.isLoading = false;
								return;
							}
							/**
							 * Executes pagination call
							 *
							*/
							// sets to true to disable pagination call if still busy.
							$scope.appraisal_form.busy = true;
							$scope.isLoading = true;
							// Calls the next page of pagination.
							Helper.post(route + '/enlist' + '?page=' + $scope.appraisal_form.page, query)
								.success(function(data){
									// increment the page to set up next page for next AJAX Call
									$scope.appraisal_form.page++;

									// iterate over each data then splice it to the data array
									angular.forEach(data.data, function(item, key){
										pushItem(item);
										$scope.appraisal_form.items.push(item);
									});

									// Enables again the pagination call for next call.
									$scope.appraisal_form.busy = false;
									$scope.isLoading = false;
								})
								.error(function(){
									Helper.failed()
										.then(function(){
											$scope.appraisal_form.paginateLoad();
										});
								});
						}
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								fetch(query);
							});
					});
			}

			fetch(query);
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.appraisal_form.show = false;

  			$scope.init($scope.request);
		};

		setInit();
	}]);
app
	.controller('confirmResultsDialogController', ['$scope', '$stateParams', 'Helper', function($scope, $stateParams, Helper) {
		var supervisorID = $stateParams.supervisorID;

		$scope.review = {}

		$scope.review.id = $stateParams.reviewID;
		$scope.review.supervisor_id = $stateParams.supervisorID;

		$scope.busy = false;

		$scope.submit = function(){
			if($scope.confirmationForm.$invalid){
				angular.forEach($scope.confirmationForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			$scope.busy = true;

			Helper.post('/review/confirm', $scope.review)
				.success(function(data){
					$scope.busy = false;

					if(data)
					{
						$scope.incorrect = true;
					}
					else{
						Helper.stop();
					}
				})
				.error(function(){
					$scope.busy = false;
					$scope.error = true;
				})
		}
	}]);
app
	.controller('appraisalFormsContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		$scope.state = $state.current.name;
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Users';

		$scope.fab.action = function(){
			$state.go('main.manage-appraisal-forms');
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.view = function(id){
			Helper.set(id);

			var dialog = {
				'controller': 'appraisalFormDialogController',
				'template': '/app/components/appraisal-forms/templates/dialogs/appraisal-form-dialog.template.html',
				'fullscreen': true,
			}

			Helper.customDialog(dialog)
				.then(function(data){
					if(data){
						$scope.delete(data);
					}
				}, function(){
					return;
				})
		}

		$scope.update = function(data){
			$state.go('main.manage-appraisal-forms', {'appraisalFormID':data.id});
		}

		$scope.delete = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.department.name + ' appraisal form?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/appraisal-form/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Appraisal form deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;
			data.hideDelete = data.reviews_count ? true : false;

			data.appraisal_period.start = new Date(data.appraisal_period.start);
			data.appraisal_period.end = new Date(data.appraisal_period.end);

			angular.forEach(data.reviews, function(review){
				if(review.behavioral_competencies.length || review.goals.length)
				{
					data.hideMenu = true;
				}
			})

			console.log(data.hideMenu)

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.appraisal_form = {};
			$scope.appraisal_form.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.appraisal_form.page = 2;

			Helper.post('/appraisal-form/enlist', query)
				.success(function(data){
					$scope.appraisal_form.details = data;
					$scope.appraisal_form.items = data.data;
					$scope.appraisal_form.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.appraisal_form.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.appraisal_form.busy || ($scope.appraisal_form.page > $scope.appraisal_form.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.appraisal_form.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/appraisal-form/enlist' + '?page=' + $scope.appraisal_form.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.appraisal_form.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.appraisal_form.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.appraisal_form.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.appraisal_form.show = false;

  			$scope.init($scope.request);
		};

		Helper.post('/user/check')
    		.success(function(data){
    			var user = data;
				
				$scope.request = {};

				$scope.request.withTrashed = true;
				$scope.request.paginate = 20;	
				$scope.request.with = [
					{
						'relation':'appraisal_period',
						'withTrashed':false,
					},
					{
						'relation':'account',
						'withTrashed':false,
					},
					{
						'relation':'department',
						'withTrashed':false,
					},
					{
						'relation':'reviews.behavioral_competencies',
						'withTrashed': false,
					},
					{
						'relation':'reviews.goals',
						'withTrashed': false,
					},
				];
				$scope.request.withCount = [
					{
						'relation':'reviews',
						'withTrashed': false,
					},
				];
				$scope.request.where = [];

				if(!user.super_admin)
				{
					$scope.request.where.push(
						{
							'label': 'department_id',
							'condition': '=',
							'value': user.department_id,
						}
					);
				}

				$scope.isLoading = true;
				$scope.$broadcast('close');

				$scope.init($scope.request);
    		});

	}]);
app
	.controller('manageAppraisalFormEmployeesContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		$scope.form = {};
		$scope.form.include_all = false;

		var appraisalFormID = $stateParams.appraisalFormID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		$scope.toolbar.parentState = 'Appraisal Form';
		$scope.toolbar.childState =  'Employees';

		var error_dialog = {
			'title': 'Aw Snap!',
			'message': 'An error occured loading the resource.',
			'ok': 'Try Again'
		}

		$scope.items = [];

		$scope.querySearch = function(query){
			var results = query ? $filter('filter')($scope.items, query) : $scope.items;
			return results;
		}

		$scope.checkAll = function(){
			if($scope.form.include_all)
			{
				$scope.appraisal_form.reviews = $scope.items;
			}
			else{
				$scope.appraisal_form.reviews = [];
			}
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.busy = true;

			Helper.preload();

			if(!appraisalFormID)
			{
				Helper.post('/review', $scope.appraisal_form.reviews)
					.success(function(data){
						Helper.stop();
						$state.go('main.appraisal-forms');
					})
					.error(function(){
						$scope.busy = false;
						Helper.error();
					})
			}
			else
			{
				Helper.put('/review/' + appraisalFormID, $scope.appraisal_form.reviews)
					.success(function(data){
						Helper.stop();
						$state.go('main.appraisal-forms');
					})
					.error(function(){
						$scope.busy = false;
						Helper.error();
					})	
			}
		}

		$scope.init = function(){		
			var appraisal_form_query = {}

			appraisal_form_query.with = [
				{
					'relation': 'appraisal_period',
					'withTrashed': false,
				},
				{
					'relation': 'department',
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

			appraisal_form_query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': appraisalFormID,
				},
			];

			appraisal_form_query.first = true;

			var appraisalForm = function(){
				Helper.post('/appraisal-form/enlist', appraisal_form_query)
					.success(function(data){
						$scope.locked_reviews = [];

						var exclude_users = [];

						angular.forEach(data.reviews, function(item, idx){
							var name = item.user.first_name + ' ' + item.user.last_name;

							if(item.goals.length || item.behavioral_competencies.length)
							{
								$scope.locked_reviews.push(name);
								exclude_users.push(item.user_id);
							}

							item.user_id = item.user.id;
							item.name = name;
							item.image = item.user.avatar_path ? '/user/avatar/' + item.user_id : '/img/2Color-Favicon_512x512-1.png';
						});
						
						data.appraisal_period.start = new Date(data.appraisal_period.start);
						data.appraisal_period.end = new Date(data.appraisal_period.end);

						$scope.appraisal_form = data;
						// $scope.appraisal_form.reviews = [];

						var users_query = {}

						users_query.where = [
							{
								'label': 'department_id',
								'condition': '=',
								'value': $scope.appraisal_form.department_id,
							},
						];

						users_query.whereNotIn = [
							{
								'label': 'id',
								'values': exclude_users,
							},
						];

						var users = function(){
							Helper.post('/user/enlist', users_query)
								.success(function(data){
									angular.forEach(data, function(user){
										var item = {};

										item.user_id = user.id;
										item.appraisal_form_id = appraisalFormID;
										item.name = user.last_name + ', ' + user.first_name;
										item.email = user.email;
										item.image = user.avatar_path ? '/user/avatar/' + user.id : '/img/2Color-Favicon_512x512-1.png';
										
										$scope.items.push(item);
									});

									$scope.users = data;
								})
								.error(function(){
									Helper.confirm(error_dialog)
										.then(function(){
											users();
										});
								});
						}

						users();
					})
					.error(function(){
						Helper.confirm(error_dialog)
							.then(function(){
								appraisalForm();
							});
					});
			}

			appraisalForm();
		}();
	}]);
app
	.controller('manageAppraisalFormsContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		$scope.form = {};

		var appraisalFormID = $stateParams.appraisalFormID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		$scope.toolbar.parentState = 'Appraisal Forms';
		$scope.toolbar.childState =  appraisalFormID ? 'Edit' : 'New';

		var error_dialog = {
			'title': 'Aw Snap!',
			'message': 'An error occured loading the resource.',
			'ok': 'Try Again'
		}

		var appraisalPeriods = function(){		
			Helper.get('/appraisal-period')
				.success(function(data){
					angular.forEach(data, function(item){
						item.start = new Date(item.start);
						item.end = new Date(item.end);
					});

					$scope.appraisal_periods = data;
				})
				.error(function(){
					Helper.confirm(error_dialog)
						.then(function(){
							appraisalPeriods();
						});
				});
		}

		var departments = function(department_id){
			var request = {
				'with': [
					{
						'relation': 'accounts',
						'withTrashed': false,
					},
				]
			}

			if(department_id){
				request.where = [
					{
						'label':'id',
						'condition': '=',
						'value': department_id,
					},
				]

				request.first = true;
			}

			var fetch = function(){
				Helper.post('/department/enlist', request)
					.success(function(data){
						if(department_id){
							$scope.appraisal_form.department = data;
						}
						else{
							$scope.departments = data;
						}
					})
					.error(function(){
						Helper.confirm(error_dialog)
							.then(function(){
								fetch();
							});
					});
			}

			fetch();
		}

		$scope.setAccounts = function(department_id, reset){
			if(reset)
			{	
				$scope.appraisal_form.account_id = null;
			}
			
			var request = {
				'where': [
					{
						'label': 'department_id',
						'condition': '=',
						'value': department_id,
					},
				],
			}

			var accounts = function(){
				Helper.post('/account/enlist', request)
					.success(function(data){
						$scope.accounts = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								accounts();
							})
					})
			}

			accounts();
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.appraisalForm.$invalid){
				angular.forEach($scope.form.appraisalForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if($scope.total_weight == 100)
			{
				$scope.busy = true;

				Helper.preload();

				if(!appraisalFormID)
				{
					Helper.post('/appraisal-form', $scope.appraisal_form)
						.success(function(data){
							Helper.stop();
							$state.go('main.appraisal-forms');
						})
						.error(function(){
							$scope.busy = false;
							Helper.error();
						})
				}
				else{
					Helper.put('/appraisal-form/' + appraisalFormID, $scope.appraisal_form)
						.success(function(data){
							Helper.stop();
							$state.go('main.appraisal-forms');
						})
						.error(function(){
							$scope.busy = false;
							Helper.error();
						})
				}
			}
			else{
				$scope.incomplete_goals = true;
			}
		}

		$scope.addGoal = function(){
			$scope.appraisal_form.goals.push({});
		}
		
		$scope.setGoal = function(){
			$scope.total_weight = 0;

			angular.forEach($scope.appraisal_form.goals, function(item){
				if(item.weight)
				{
					$scope.total_weight += item.weight;		
				}
			});

			if($scope.total_weight == 100)
			{
				$scope.incomplete_goals = false;
			}
		}

		$scope.removeGoal = function(idx){
			if(appraisalFormID)
			{
				var dialog = {
					'title': 'Remove Goal',
					'message': 'This goal will be removed permanently.',
					'ok': 'Delete',
					'cancel': 'cancel',
				}

				Helper.confirm(dialog)
					.then(function(){
						Helper.delete('/goal/' + $scope.appraisal_form.goals[idx].id)
							.success(function(){
								$scope.appraisal_form.goals.splice(idx, 1);
								$scope.setGoal();
							})
							.error(function(){
								Helper.error();
							});
					}, function(){
						return;
					});
			}
			else{				
				$scope.appraisal_form.goals.splice(idx, 1);
				$scope.setGoal();
			}
		}

		$scope.addBehavioralCompetency = function(){
			$scope.appraisal_form.behavioral_competencies.push({});
		}

		$scope.removeBehavioralCompetency = function(idx){
			if(appraisalFormID)
			{
				var dialog = {
					'title': 'Remove Behavioral Competency',
					'message': 'This item will be removed permanently.',
					'ok': 'Delete',
					'cancel': 'Cancel',
				}

				Helper.confirm(dialog)
					.then(function(){
						Helper.delete('/behavioral-competency/' + $scope.appraisal_form.behavioral_competencies[idx].id)
							.success(function(){
								$scope.appraisal_form.behavioral_competencies.splice(idx, 1);
							})
							.error(function(){
								Helper.error();
							});
					}, function(){
						return;
					});
			}
			else{				
				$scope.appraisal_form.behavioral_competencies.splice(idx, 1);
			}
		}

		$scope.init = function(){
			Helper.post('/user/check')
				.success(function(data){
					$scope.super_admin = data.super_admin;
					
					appraisalPeriods();

					if($scope.super_admin){
						departments();
					}
					else{
						departments(data.department_id);
					}

					
					if(!appraisalFormID)
					{
						$scope.appraisal_form = {};
						
						$scope.appraisal_form.goals = [{}];
						$scope.appraisal_form.behavioral_competencies = [{}];
					}
					else{
						var query = {}

						query.with = [
							{
								'relation': 'appraisal_period',
								'withTrashed': false,
							},
							{
								'relation': 'department.accounts',
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
								'relation': 'reviews.behavioral_competencies',
								'withTrashed': false,		
							},
							{
								'relation': 'reviews.goals',
								'withTrashed': false,		
							}
						];

						query.where = [
							{
								'label': 'id',
								'condition': '=',
								'value': appraisalFormID,
							},
						];

						query.first = true;

						var appraisalForm = function(){
							Helper.post('/appraisal-form/enlist', query)
								.success(function(data){
									angular.forEach(data.reviews, function(review){
										if(review.behavioral_competencies.length || review.goals.length)
										{
											$state.go('page-not-found');
										}
									})

									angular.forEach(data.goals, function(item){
										item.weight = item.weight * 100;
									});

									$scope.appraisal_form = data;

									$scope.setGoal();
									$scope.setAccounts(data.department_id);
								})
								.error(function(){
									Helper.confirm(error_dialog)
										.then(function(){
											appraisalForm();
										});
								});
						}

						appraisalForm();
					}
				})
		}();
	}]);
app
	.controller('appraisalPeriodsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Appraisal Periods';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Start',
				'type': 'start',
				'sortReverse': false,
			},
			{
				'label': 'End',
				'type': 'end',
				'sortReverse': false,
			},
			{
				'label': 'Appraisal Year',
				'type': 'appraisal_year',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('departmentsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Departments';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Name',
				'type': 'employee_number',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('usersToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Users';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Employee Number',
				'type': 'employee_number',
				'sortReverse': false,
			},
			{
				'label': 'Last Name',
				'type': 'last_name',
				'sortReverse': false,
			},
			{
				'label': 'First Name',
				'type': 'first_name',
				'sortReverse': false,
			},
			{
				'label': 'Email',
				'type': 'email',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('teamReviewsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Team Reviews';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Start',
				'type': 'start',
				'sortReverse': false,
			},
			{
				'label': 'End',
				'type': 'end',
				'sortReverse': false,
			},
			{
				'label': 'Appraisal Year',
				'type': 'appraisal_year',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('reviewsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Home';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Start',
				'type': 'start',
				'sortReverse': false,
			},
			{
				'label': 'End',
				'type': 'end',
				'sortReverse': false,
			},
			{
				'label': 'Appraisal Year',
				'type': 'appraisal_year',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
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
					data.start = new Date(data.start);
					data.end = new Date(data.end);
					$scope.appraisal_period = data;

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
			Helper.post(route + '/check-duplicate', $scope.appraisal_period)
				.success(function(data){
					$scope.duplicate = data;
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
app
	.controller('departmentDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		var route = '/department';

		if($scope.config.action == 'create')
		{
			$scope.department = {};
			$scope.department.accounts = [];
		}
		else if($scope.config.action == 'edit')
		{
			var query = {}

			query.with = [
				{
					'relation': 'accounts.users',
					'withTrashed': false,
				},
			];

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
					$scope.department = data;
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.add = function(){
			$scope.department.accounts.push({});
		}

		$scope.remove = function(idx){
			if($scope.config.action == 'edit' && $scope.department.accounts[idx].id)
			{
				Helper.delete('/account/' + $scope.department.accounts[idx].id)
					.success(function(){
						$scope.department.accounts.splice(idx, 1);
					})
					.error(function(){
						$scope.error = true;
					})
			}
			else{
				$scope.department.accounts.splice(idx, 1);
			}
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post(route + '/check-duplicate', $scope.department)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		var checkEveryItem = function(item, idx){
			angular.forEach($scope.department.accounts, function(account, key){
				if(item.name == account.name && idx != key)
				{
					$scope.duplicate_accounts = true;
				}
			});
		}

		$scope.checkDuplicateAccount = function(item, idx){
			item.duplicate = false; 
			$scope.duplicate_accounts = false; 

			if($scope.config.action == 'edit')
			{
				item.department_id = $scope.department.id;

				Helper.post('/account' + '/check-duplicate', item)
					.success(function(data){
						// item.duplicate = data;
						$scope.duplicate_accounts = data;
						
						checkEveryItem(item, idx);
					})
			}
			else{
				checkEveryItem(item, idx);
			}
		}

		$scope.submit = function(){
			if($scope.departmentForm.$invalid){
				angular.forEach($scope.departmentForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.department.accounts, function(item, idx){
				checkEveryItem(item, idx);
			});


			if(!$scope.duplicate && !$scope.duplicate_accounts)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post(route, $scope.department)
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
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put(route + '/' + $scope.config.id, $scope.department)
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
						});
				}
			}
		}
	}]);
app
	.controller('userDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
			$scope.model.roles = [];
		}
		else if($scope.config.action == 'edit')
		{
			Helper.post('/role/enlist')
				.success(function(data){
					$scope.roles = data;
					$scope.count = $scope.roles.length;
					
					var user_query = {
						'with': [
							{
								'relation': 'head_of.department',
								'withTrashed': false,
							},
						],
						'where': [
							{
								'label': 'id',
								'condition': '=',
								'value': $scope.config.id,
							},
						],
						'first': true,
					}

					Helper.post('/user/enlist' , user_query)
						.success(function(data){
							$scope.model = data;
							$scope.model.roles = [];

							$scope.setAccounts(data.department_id);

							if(data.head_of)
							{
								$scope.model.department_head = true;
							}

							angular.forEach($scope.roles, function(item, key){
								$scope.model.roles.push(null);

								var query = {};
								query.with = [
									{
										'relation':'role',
										'withTrashed': false,
									},
								];
								query.where = [
									{
										'label': 'user_id',
										'condition': '=',
										'value': $scope.model.id,
									},
									{
										'label': 'role_id',
										'condition': '=',
										'value': item.id,
									},
								];
								query.first = true;

								Helper.post('/user-role/enlist', query)
									.success(function(data){
										$scope.count--;
										if(data)
										{
											$scope.model.roles.splice(key, 1, data.role);
										}
									})
									.error(function(){
										$scope.error();
									})
							});
						})
						.error(function(){
							Helper.error();
						});
				})
				.error(function(){
					Helper.error();
				})
		}

		var departments = function(){
			var request = {
				'with': [
					{
						'relation': 'accounts',
						'withTrashed': false,
					},
				]
			}

			var fetch = function(){
				Helper.post('/department/enlist', request)
					.success(function(data){
						$scope.departments = data;
					})
					.error(function(){
						Helper.confirm(error_dialog)
							.then(function(){
								fetch();
							});
					});
			}

			fetch();
		}

		$scope.setAccounts = function(department_id, reset){
			$scope.getSupervisors();

			if(reset)
			{	
				$scope.model.account_id = null;
			}
			
			var request = {
				'where': [
					{
						'label': 'department_id',
						'condition': '=',
						'value': department_id,
					},
				],
			}

			var accounts = function(){
				Helper.post('/account/enlist', request)
					.success(function(data){
						$scope.accounts = data;
					})
					.error(function(){
						accounts();
					})
			}

			accounts();
		}

		var roles = function(){
			Helper.post('/role/enlist')
				.success(function(data){
					$scope.roles = data;
				})
				.error(function(){
					roles();	
				})
		}

		$scope.getSupervisors = function(){
			var request = {
				'where': [
					{
						'label': 'department_id',
						'condition': '=',
						'value': $scope.model.department_id ? $scope.model.department_id : null,
					},
					{
						'label': 'account_id',
						'condition': '=',
						'value': $scope.model.account_id ? $scope.model.account_id : null,
					},
				],
				'whereHas': [
					{
						'relation': 'roles',
						'where': [
							{
								'relation': 'name',
								'condition': '=',
								'value': 'supervisor',
							},
						]
					}
				],
			}

			Helper.post('/user/enlist', request)
				.success(function(data){
					$scope.supervisors = data;
				})
				.error(function(){
					$scope.supervisors();
				})
		}

		departments();
		roles();

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user' + '/check-email', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.checkDuplicateEmployeeNumber = function(){
			Helper.post('/user' + '/check-employee-number', $scope.model)
				.success(function(data){
					$scope.duplicateEmployeeNumber = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/user', $scope.model)
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
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/user' + '/' + $scope.config.id, $scope.model)
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
						});
				}
			}
		}
	}]);
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
app
	.controller('appraisalFormsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Appraisal Forms';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Appraisal Year',
				'type': 'appraisal_year',
				'sortReverse': false,
			},
			{
				'label': 'Department',
				'type': 'department',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('notificationsContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		var pushItem = function(item){
			var item = {
				'display': item.data.sender.name,
				'message': item.data.message,
			}

			$scope.toolbar.items.push(item);
		}

		$scope.readNotification = function(notification){
			if(notification.data.withParams)
			{
				$state.go(notification.data.url, {'id':notification.data.attachment.id});
			}
			else{
				$state.go(notification.data.url);
			}
		}

		$scope.init = function(query){
			$scope.notification = {};
			$scope.notification.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.notification.page = 2;

			Helper.post('/user/notifications', query)
				.success(function(data){
					$scope.notification.details = data;
					$scope.notification.items = data.data;
					$scope.notification.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.notification.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.notification.busy || ($scope.notification.page > $scope.notification.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.notification.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/user/notifications' + '?page=' + $scope.notification.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.notification.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.notification.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.notification.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.notification.show = false;
			$scope.request.where = null;

  			$scope.init($scope.request);
		};

		$scope.request = {
			'paginate':20,
		}

		$scope.init($scope.request);
	}]);
app
	.controller('notificationsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Notifications';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.$on('open', function(){
			$scope.showSearchBar();
			$scope.searchUserInput();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.notification.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		
		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
//# sourceMappingURL=app.js.map
