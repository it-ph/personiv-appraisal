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
					else if(role.name == 'manage-groups')
					{
						settings = true;

						var item = {
							'label': 'Groups',
							action: function(){
								$state.go('main.groups');
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
					else if(role.name == 'manage-locations')
					{
						settings = true;

						var item = {
							'label': 'Rooms',
							action: function(){
								$state.go('main.locations');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-equipment')
					{
						settings = true;

						var item = {
							'label': 'Equipment',
							action: function(){
								$state.go('main.equipment');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-links')
					{
						settings = true;

						var item = {
							'label': 'Links',
							action: function(){
								$state.go('main.links');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-birthdays')
					{
						settings = true;

						var item = {
							'label': 'Birthdays',
							action: function(){
								$state.go('main.birthdays');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-forms')
					{
						settings = true;

						var item = {
							'label': 'Forms',
							action: function(){
								$state.go('main.forms');
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