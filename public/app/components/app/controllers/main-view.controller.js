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

				$scope.menu.static[1].show = $filter('filter')(data.roles, {'name':'parameters'}, true).length ? true : false;
				$scope.menu.static[2].show = $filter('filter')(data.roles, {'name':'dashboard'}, true).length ? true : false;

				if($filter('filter')(data.roles, {'name':'supervisor'}, true).length || $filter('filter')(data.roles, {'name':'director'}, true).length || data.head_of)
				{
					$scope.menu.static[3].show = true					
				}

				$scope.menu.pages[0][0].show = $filter('filter')(data.roles, {'name':'appraisal-periods'}, true).length ? true : false;
				$scope.menu.pages[0][1].show = $filter('filter')(data.roles, {'name':'manage-departments'}, true).length ? true : false;
				$scope.menu.pages[0][2].show = $filter('filter')(data.roles, {'name':'manage-users'}, true).length ? true : false;

				if($scope.menu.pages[0][0].show  || $scope.menu.pages[0][1].show || $scope.menu.pages[0][2].show)
				{
					$scope.menu.section[0].show = true;
				}

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