app
	.controller('manageAppraisalFormsContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		$scope.form = {};

		var appraisalFormID = $stateParams.appraisalFormID;

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		$scope.toolbar.parentState = 'Appraisal Forms';
		$scope.toolbar.childState =  appraisalFormID ? 'Edit' : 'New';

		var error_dialog = {
			'title': 'Aw Snap!',
			'message': 'An error occured loading the resource.',
			'ok': 'Try Again'
		}

		var appraisalPeriods = function(){		
			Helper.get('/appraisal-period')
				.success(function(data){
					angular.forEach(data, function(item){
						item.start = new Date(item.start);
						item.end = new Date(item.end);
					});

					$scope.appraisal_periods = data;
				})
				.error(function(){
					Helper.confirm(error_dialog)
						.then(function(){
							appraisalPeriods();
						});
				});
		}

		var departments = function(department_id){
			var request = {
				'with': [
					{
						'relation': 'accounts',
						'withTrashed': false,
					},
				]
			}

			if(department_id){
				request.where = [
					{
						'label':'id',
						'condition': '=',
						'value': department_id,
					},
				]

				request.first = true;
			}

			var fetch = function(){
				Helper.post('/department/enlist', request)
					.success(function(data){
						if(department_id){
							$scope.appraisal_form.department = data;
						}
						else{
							$scope.departments = data;
						}
					})
					.error(function(){
						Helper.confirm(error_dialog)
							.then(function(){
								fetch();
							});
					});
			}

			fetch();
		}

		$scope.setAccounts = function(department_id, reset){
			if(reset)
			{	
				$scope.appraisal_form.account_id = null;
			}
			
			var request = {
				'where': [
					{
						'label': 'department_id',
						'condition': '=',
						'value': department_id,
					},
				],
			}

			var accounts = function(){
				Helper.post('/account/enlist', request)
					.success(function(data){
						$scope.accounts = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								accounts();
							})
					})
			}

			accounts();
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

			if($scope.total_weight == 100)
			{
				$scope.busy = true;

				Helper.preload();

				if(!appraisalFormID)
				{
					Helper.post('/appraisal-form', $scope.appraisal_form)
						.success(function(data){
							Helper.stop();
							$state.go('main.appraisal-forms');
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
			else{
				$scope.incomplete_goals = true;
			}
		}

		$scope.addGoal = function(){
			$scope.appraisal_form.goals.push({});
		}
		
		$scope.setGoal = function(){
			$scope.total_weight = 0;

			angular.forEach($scope.appraisal_form.goals, function(item){
				if(item.weight)
				{
					$scope.total_weight += item.weight;		
				}
			});

			if($scope.total_weight == 100)
			{
				$scope.incomplete_goals = false;
			}
		}

		$scope.removeGoal = function(idx){
			if(appraisalFormID)
			{
				var dialog = {
					'title': 'Remove Goal',
					'message': 'This goal will be removed permanently.',
					'ok': 'Delete',
					'cancel': 'cancel',
				}

				Helper.confirm(dialog)
					.then(function(){
						Helper.delete('/goal/' + $scope.appraisal_form.goals[idx].id)
							.success(function(){
								$scope.appraisal_form.goals.splice(idx, 1);
								$scope.setGoal();
							})
							.error(function(){
								Helper.error();
							});
					}, function(){
						return;
					});
			}
			else{				
				$scope.appraisal_form.goals.splice(idx, 1);
				$scope.setGoal();
			}
		}

		$scope.addBehavioralCompetency = function(){
			$scope.appraisal_form.behavioral_competencies.push({});
		}

		$scope.removeBehavioralCompetency = function(idx){
			if(appraisalFormID)
			{
				var dialog = {
					'title': 'Remove Behavioral Competency',
					'message': 'This item will be removed permanently.',
					'ok': 'Delete',
					'cancel': 'Cancel',
				}

				Helper.confirm(dialog)
					.then(function(){
						Helper.delete('/behavioral-competency/' + $scope.appraisal_form.behavioral_competencies[idx].id)
							.success(function(){
								$scope.appraisal_form.behavioral_competencies.splice(idx, 1);
							})
							.error(function(){
								Helper.error();
							});
					}, function(){
						return;
					});
			}
			else{				
				$scope.appraisal_form.behavioral_competencies.splice(idx, 1);
			}
		}

		$scope.init = function(){
			Helper.post('/user/check')
				.success(function(data){
					$scope.super_admin = data.super_admin;
					
					appraisalPeriods();

					if($scope.super_admin){
						departments();
					}
					else{
						departments(data.department_id);
					}

					
					if(!appraisalFormID)
					{
						$scope.appraisal_form = {};
						
						$scope.appraisal_form.goals = [{}];
						$scope.appraisal_form.behavioral_competencies = [{}];
					}
					else{
						var query = {}

						query.with = [
							{
								'relation': 'appraisal_period',
								'withTrashed': false,
							},
							{
								'relation': 'department.accounts',
								'withTrashed': false,
							},
							{
								'relation': 'goals',
								'withTrashed': false,
							},
							{
								'relation': 'behavioral_competencies',
								'withTrashed': false,
							},
							{
								'relation': 'reviews.behavioral_competencies',
								'withTrashed': false,		
							},
							{
								'relation': 'reviews.goals',
								'withTrashed': false,		
							}
						];

						query.where = [
							{
								'label': 'id',
								'condition': '=',
								'value': appraisalFormID,
							},
						];

						query.first = true;

						var appraisalForm = function(){
							Helper.post('/appraisal-form/enlist', query)
								.success(function(data){
									angular.forEach(data.reviews, function(review){
										if(review.behavioral_competencies.length || review.goals.length)
										{
											$state.go('page-not-found');
										}
									})

									angular.forEach(data.goals, function(item){
										item.weight = item.weight * 100;
									});

									$scope.appraisal_form = data;

									$scope.setGoal();
									$scope.setAccounts(data.department_id);
								})
								.error(function(){
									Helper.confirm(error_dialog)
										.then(function(){
											appraisalForm();
										});
								});
						}

						appraisalForm();
					}
				})
		}();
	}]);