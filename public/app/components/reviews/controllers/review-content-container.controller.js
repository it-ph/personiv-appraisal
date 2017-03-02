app
	.controller('reviewContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var route = '/review';

		var reviewID = $stateParams.reviewID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Team Reviews';

		$scope.toolbar.hideSearchIcon = true;
		
		/*
		 * Object for request
		 *
		*/
		$scope.request = {};

		$scope.request.withTrashed = false;
		$scope.request.first = true;	
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
				'relation':'behavioral_competencies.behavioral_competency',
				'withTrashed': false,
			},
			{
				'relation':'user',
				'withTrashed': false,	
			},
		];
		$scope.request.where = [
			{
				'label': 'id',
				'condition': '=',
				'value': reviewID,
			},
		];

		$scope.init = function(query){		
			Helper.post(route + '/enlist', query)
				.success(function(data){
					if(!data || (!data.goals.length && !data.behavioral_competencies.length))
					{
						$state.go('page-not-found');
					}

					data.appraisal_form.appraisal_period.start = new Date(data.appraisal_form.appraisal_period.start);
					data.appraisal_form.appraisal_period.end = new Date(data.appraisal_form.appraisal_period.end);

					$scope.toolbar.childState = data.user.last_name + ', ' + data.user.first_name + ' ' + data.user.middle_name.charAt(0).toUpperCase() +'.';
					
					$scope.review = data;

					$scope.isLoading = false;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.init(query);
						});
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;

  			$scope.init($scope.request);
		};

		$scope.evaluate = function(id){
			$state.go('main.supervisor-review', {'reviewID':id});
		}

		$scope.isLoading = true;
		$scope.init($scope.request);
	}]);