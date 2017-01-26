@extends('main')

@section('content')
	<md-card>
		<md-card-content>
			<form method="POST" action="/login" class="form">
				<div layout="column" flex>
					{!! csrf_field() !!}
					<!-- Employee Number -->
					<md-input-container>
						<label>Employee Number</label>
						<input type="text" name="employee_number" value="{{ old('employee_number') }}">
					</md-input-container>
					<!-- Password -->
					<md-input-container>
						<label>Password</label>
						<input type="password" name="password">
					</md-input-container>
					<div class="md-actions" layout="row" layout-align="space-between center">
						<!-- Remember Me -->
						<md-checkbox aria-label="remember me" name="remember" class="md-primary">Keep me logged in</md-checkbox>
						<!-- Submit Button -->
						<md-button type="submit" class="md-primary md-raised">Login</md-button>
					</div>
				</div>
			</form>
		</md-card-content>
	</md-card>
@stop