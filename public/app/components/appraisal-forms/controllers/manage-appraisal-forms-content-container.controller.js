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
			
		}

		$scope.init = function(){
			Helper.post('/user/check')
				.success(function(data){
					$scope.super_admin = data.super_admin;
					appraisalPeriods();

					if($scope.super_admin){
						departments();
					}
				})
		}();
	}]);