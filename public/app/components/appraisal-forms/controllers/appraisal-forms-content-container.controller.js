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
				.then(function(){
					
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
			dialog.message = 'Delete ' + data.department.name + 'appraisal form?'
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
						'relation':'department',
						'withTrashed':false,
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