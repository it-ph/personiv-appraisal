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
						// controller: 'postsContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						// controller: 'postsToolbarController',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main':{
						// templateUrl: '/app/components/posts/templates/content/posts.template.html',
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
			},
			{
				'state': 'main.reviews',
				'icon': 'mdi-file-document-box',
				'label': 'Reviews',
			},
		];

		$scope.menu.section = [];

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

				angular.forEach(data.roles, function(role){
					if(role.name == 'supervisor')
					{
						var item = {
							'state': 'main.team-reviews',
							'icon': 'mdi-account-multiple',
							'label': 'Team Reviews',
						}

						$scope.menu.static.splice(2, 0, item);
					}
					else if(role.name == 'parameters')
					{
						var item = {
							'state': 'main.appraisal-forms',
							'icon': 'mdi-playlist-check',
							'label': 'Appraisal Forms',
						}

						$scope.menu.static.splice(2, 0, item);
					}
					else if(role.name == 'appraisal-periods')
					{
						settings = true;

						var item = {
							'label': 'Appraisal Periods',
							action: function(){
								$state.go('main.appraisal-periods');
							},
						}

						settings_menu.push(item);
					}
					else if(role.name == 'manage-departments')
					{
						settings = true;

						var item = {
							'label': 'Departments',
							action: function(){
								$state.go('main.departments');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-users')
					{
						settings = true;

						var item = {
							'label': 'Users',
							action: function(){
								$state.go('main.users');
							},
						}

						settings_menu.push(item); 
					}
				});

				if(settings)
				{
					$scope.menu.section[0] = {
						'name':'Settings',
						'icon':'mdi-settings',
					}

					$scope.menu.pages[0] = settings_menu;
				}

				var notifications = {
					'state': 'main.notifications',
					'icon': 'mdi-bell',
					'label': 'Notifications',
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

				var pusher = new Pusher('73a46f761ea4637481b5', {
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
				'relation':'departments',
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

		Helper.get('/department')
			.success(function(data){
				$scope.departments = data;
			});

		Helper.get('/account')
			.success(function(data){
				$scope.accounts = data;
			});		

		Helper.post('/role/enlist')
			.success(function(data){
				$scope.roles = data;
			})

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
								'relation': 'departments',
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
		}

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
//# sourceMappingURL=app.js.map
