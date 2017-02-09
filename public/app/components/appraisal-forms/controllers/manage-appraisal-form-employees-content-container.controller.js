app
	.controller('manageAppraisalFormEmployeesContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		$scope.form = {};

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

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.appraisalForm.$invalid){
				angular.forEach($scope.form.appraisalForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			console.log($scope.appraisal_form);

			return;

			$scope.busy = true;

			Helper.preload();

			if(!appraisalFormID)
			{
				Helper.post('/appraisal-form', $scope.appraisal_form)
					.success(function(data){
						Helper.stop();
						$state.go('main.manage-appraisal-form-employees', {'appraisalFormID':data.id});
					})
					.error(function(){
						$scope.busy = false;
						Helper.error();
					})
			}
			else{
				Helper.put('/appraisal-form/' + appraisalFormID, $scope.appraisal_form)
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
						data.appraisal_period.start = new Date(data.appraisal_period.start);
						data.appraisal_period.end = new Date(data.appraisal_period.end);

						$scope.appraisal_form = data;
						$scope.appraisal_form.reviews = [];

						var users_query = {}

						users_query.where = [
							{
								'label': 'department_id',
								'condition': '=',
								'value': $scope.appraisal_form.department_id,
							},
						];

						var users = function(){
							Helper.post('/user/enlist', users_query)
								.success(function(data){
									angular.forEach(data, function(user){
										var item = {};

										item.id = user.id;
										item.name = user.last_name + ', ' + user.first_name;
										item.email = user.email;
										
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