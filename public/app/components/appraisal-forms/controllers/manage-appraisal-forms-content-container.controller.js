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

		var departments = function(){		
			Helper.get('/department')
				.success(function(data){
					$scope.departments = data;
				})
				.error(function(){
					Helper.confirm(error_dialog)
						.then(function(){
							departments();
						});
				});
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
								'relation': 'goals',
								'withTrashed': false,
							},
							{
								'relation': 'behavioral_competencies',
								'withTrashed': false,
							},
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
									angular.forEach(data.goals, function(item){
										item.weight = item.weight * 100;
									});

									$scope.appraisal_form = data;

									$scope.setGoal();
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