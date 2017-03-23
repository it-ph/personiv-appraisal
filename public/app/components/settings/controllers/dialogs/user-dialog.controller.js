app
	.controller('userDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
			$scope.model.roles = [];
		}
		else if($scope.config.action == 'edit')
		{
			Helper.post('/role/enlist')
				.success(function(data){
					$scope.roles = data;
					$scope.count = $scope.roles.length;
					
					var user_query = {
						'with': [
							{
								'relation': 'head_of.department',
								'withTrashed': false,
							},
						],
						'where': [
							{
								'label': 'id',
								'condition': '=',
								'value': $scope.config.id,
							},
						],
						'first': true,
					}

					Helper.post('/user/enlist' , user_query)
						.success(function(data){
							$scope.model = data;
							$scope.model.roles = [];

							$scope.setAccounts(data.department_id);

							if(data.head_of)
							{
								$scope.model.department_head = true;
							}

							angular.forEach($scope.roles, function(item, key){
								$scope.model.roles.push(null);

								var query = {};
								query.with = [
									{
										'relation':'role',
										'withTrashed': false,
									},
								];
								query.where = [
									{
										'label': 'user_id',
										'condition': '=',
										'value': $scope.model.id,
									},
									{
										'label': 'role_id',
										'condition': '=',
										'value': item.id,
									},
								];
								query.first = true;

								Helper.post('/user-role/enlist', query)
									.success(function(data){
										$scope.count--;
										if(data)
										{
											$scope.model.roles.splice(key, 1, data.role);
										}
									})
									.error(function(){
										Helper.error();
									})
							});
						})
						.error(function(){
							Helper.error();
						});
				})
				.error(function(){
					Helper.error();
				})
		}

		var departments = function(){
			var request = {
				'with': [
					{
						'relation': 'accounts',
						'withTrashed': false,
					},
				]
			}

			var fetch = function(){
				Helper.post('/department/enlist', request)
					.success(function(data){
						$scope.departments = data;
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
			$scope.getSupervisors();

			if(reset)
			{	
				$scope.model.account_id = null;
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
						accounts();
					})
			}

			accounts();
		}

		var roles = function(){
			Helper.post('/role/enlist')
				.success(function(data){
					$scope.roles = data;
				})
				.error(function(){
					roles();	
				})
		}

		$scope.getSupervisors = function(reset){
			if(reset)
			{
				$scope.model.immediate_supervisor_id = null
			}

			var request = {
				'where': [
					{
						'label': 'department_id',
						'condition': '=',
						'value': $scope.model.department_id ? $scope.model.department_id : null,
					},
					{
						'label': 'account_id',
						'condition': '=',
						'value': $scope.model.account_id ? $scope.model.account_id : null,
					},
				],
				'whereHas': [
					{
						'relation': 'roles',
						'where': [
							{
								'relation': 'name',
								'condition': '=',
								'value': 'supervisor',
							},
						]
					}
				],
			}

			Helper.post('/user/enlist', request)
				.success(function(data){
					$scope.supervisors = data;
				})
				.error(function(){
					$scope.supervisors();
				})
		}

		departments();
		roles();

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user' + '/check-email', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.checkDuplicateEmployeeNumber = function(){
			Helper.post('/user' + '/check-employee-number', $scope.model)
				.success(function(data){
					$scope.duplicateEmployeeNumber = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/user', $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/user' + '/' + $scope.config.id, $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);