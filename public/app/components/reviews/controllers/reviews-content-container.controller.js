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