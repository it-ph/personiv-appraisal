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