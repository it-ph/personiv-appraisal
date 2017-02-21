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
		.state('main.review', {
				url: 'review/{reviewID}',
				params: {'reviewID':null},
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