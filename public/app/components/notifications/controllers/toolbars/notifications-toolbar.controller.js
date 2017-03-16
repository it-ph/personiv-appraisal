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