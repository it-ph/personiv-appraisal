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