app
	.controller('departmentDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		var route = '/department';

		if($scope.config.action == 'create')
		{
			$scope.department = {};
			$scope.department.accounts = [];
		}
		else if($scope.config.action == 'edit')
		{
			var query = {}

			query.with = [
				{
					'relation': 'accounts.users',
					'withTrashed': false,
				},
			];

			query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': $scope.config.id,
				}
			];

			query.first = true;

			Helper.post(route + '/enlist', query)
				.success(function(data){
					$scope.department = data;
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.add = function(){
			$scope.department.accounts.push({});
		}

		$scope.remove = function(idx){
			if($scope.config.action == 'edit' && $scope.department.accounts[idx].id)
			{
				Helper.delete('/account/' + $scope.department.accounts[idx].id)
					.success(function(){
						$scope.department.accounts.splice(idx, 1);
					})
					.error(function(){
						$scope.error = true;
					})
			}
			else{
				$scope.department.accounts.splice(idx, 1);
			}
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post(route + '/check-duplicate', $scope.department)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		var checkEveryItem = function(item, idx){
			angular.forEach($scope.department.accounts, function(account, key){
				if(item.name == account.name && idx != key)
				{
					$scope.duplicate_accounts = true;
				}
			});
		}

		$scope.checkDuplicateAccount = function(item, idx){
			item.duplicate = false; 
			$scope.duplicate_accounts = false; 

			if($scope.config.action == 'edit')
			{
				item.department_id = $scope.department.id;

				Helper.post('/account' + '/check-duplicate', item)
					.success(function(data){
						// item.duplicate = data;
						$scope.duplicate_accounts = data;
						
						checkEveryItem(item, idx);
					})
			}
			else{
				checkEveryItem(item, idx);
			}
		}

		$scope.submit = function(){
			if($scope.departmentForm.$invalid){
				angular.forEach($scope.departmentForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.department.accounts, function(item, idx){
				checkEveryItem(item, idx);
			});


			if(!$scope.duplicate && !$scope.duplicate_accounts)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post(route, $scope.department)
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
					Helper.put(route + '/' + $scope.config.id, $scope.department)
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