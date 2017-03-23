app
	.controller('manageAppraisalFormEmployeesContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		$scope.form = {};
		$scope.form.include_all = false;

		var appraisalFormID = $stateParams.appraisalFormID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		$scope.toolbar.parentState = 'Appraisal Form';
		$scope.toolbar.childState =  'Employees';

		var error_dialog = {
			'title': 'Aw Snap!',
			'message': 'An error occured loading the resource.',
			'ok': 'Try Again'
		}

		$scope.items = [];

		$scope.querySearch = function(query){
			var results = query ? $filter('filter')($scope.items, query) : $scope.items;
			return results;
		}

		$scope.checkAll = function(){
			if($scope.form.include_all)
			{
				$scope.appraisal_form.reviews = $scope.items;
			}
			else{
				$scope.appraisal_form.reviews = [];
			}
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.busy = true;

			Helper.preload();

			if(!appraisalFormID)
			{
				Helper.post('/review', $scope.appraisal_form.reviews)
					.success(function(data){
						Helper.stop();
						$state.go('main.appraisal-forms');
					})
					.error(function(){
						$scope.busy = false;
						Helper.error();
					})
			}
			else
			{
				Helper.put('/review/' + appraisalFormID, $scope.appraisal_form.reviews)
					.success(function(data){
						Helper.stop();
						$state.go('main.appraisal-forms');
					})
					.error(function(){
						$scope.busy = false;
						Helper.error();
					})	
			}
		}

		$scope.init = function(){		
			var appraisal_form_query = {}

			appraisal_form_query.with = [
				{
					'relation': 'appraisal_period',
					'withTrashed': false,
				},
				{
					'relation': 'department',
					'withTrashed': false,
				},
				{
					'relation': 'reviews.user',
					'withTrashed': false,
				},
				{
					'relation': 'reviews.goals',
					'withTrashed': false,
				},
				{
					'relation': 'reviews.behavioral_competencies',
					'withTrashed': false,
				},
			];

			appraisal_form_query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': appraisalFormID,
				},
			];

			appraisal_form_query.first = true;

			var appraisalForm = function(){
				Helper.post('/appraisal-form/enlist', appraisal_form_query)
					.success(function(data){
						$scope.locked_reviews = [];

						var exclude_users = [];

						angular.forEach(data.reviews, function(item, idx){
							var name = item.user.first_name + ' ' + item.user.last_name;

							if(item.goals.length || item.behavioral_competencies.length)
							{
								$scope.locked_reviews.push(name);
								exclude_users.push(item.user_id);
							}

							item.user_id = item.user.id;
							item.name = name;
							item.image = item.user.avatar_path ? '/user/avatar/' + item.user_id : '/img/2Color-Favicon_512x512-1.png';
						});
						
						data.appraisal_period.start = new Date(data.appraisal_period.start);
						data.appraisal_period.end = new Date(data.appraisal_period.end);

						$scope.appraisal_form = data;
						// $scope.appraisal_form.reviews = [];

						var users_query = {}

						users_query.where = [
							{
								'label': 'department_id',
								'condition': '=',
								'value': $scope.appraisal_form.department_id,
							},
							{
								'label': 'account_id',
								'condition': '=',
								'value': $scope.appraisal_form.account_id,
							},
						];

						users_query.whereNotIn = [
							{
								'label': 'id',
								'values': exclude_users,
							},
						];

						var users = function(){
							Helper.post('/user/enlist', users_query)
								.success(function(data){
									angular.forEach(data, function(user){
										var item = {};

										item.user_id = user.id;
										item.appraisal_form_id = appraisalFormID;
										item.name = user.last_name + ', ' + user.first_name;
										item.email = user.email;
										item.image = user.avatar_path ? '/user/avatar/' + user.id : '/img/2Color-Favicon_512x512-1.png';
										
										$scope.items.push(item);
									});

									$scope.users = data;
								})
								.error(function(){
									Helper.confirm(error_dialog)
										.then(function(){
											users();
										});
								});
						}

						users();
					})
					.error(function(){
						Helper.confirm(error_dialog)
							.then(function(){
								appraisalForm();
							});
					});
			}

			appraisalForm();
		}();
	}]);