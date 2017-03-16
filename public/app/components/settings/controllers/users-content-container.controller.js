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