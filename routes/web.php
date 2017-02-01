<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', 'HomeController@index');

Auth::routes();

Route::get('/home', 'HomeController@index');

Route::resource('account', 'AccountController');
Route::resource('appraisal-form', 'AppraisalFormController');
Route::resource('appraisal-period', 'AppraisalPeriodController');
Route::resource('behavioral-competency', 'BehavioralCompetencyController');
Route::resource('department', 'DepartmentController');
Route::resource('department-head', 'DepartmentHeadController');
Route::resource('goal', 'GoalController');
Route::resource('review', 'ReviewController');
Route::resource('review-behavioral', 'ReviewBehavioralCompetencyController');
Route::resource('review-goal', 'ReviewGoalController');
Route::resource('role', 'RolesController');
Route::resource('user', 'UserController');
Route::resource('user-role', 'UserRoleController');

Route::post('/pusher/auth', 'PusherController@auth');

/* User Routes */
Route::group(['prefix' => 'user'], function(){
	Route::post('check', 'UserController@check');
	Route::post('check-email', 'UserController@checkEmail');
	Route::post('check-employee-number', 'UserController@checkEmployeeNumber');
	Route::post('change-password', 'UserController@changePassword');
	Route::post('check-password', 'UserController@checkPassword');
	Route::post('enlist', 'UserController@enlist');
	Route::post('logout', 'UserController@logout');
	Route::post('mark-all-as-read', 'UserController@markAllAsRead');
	Route::post('mark-as-read', 'UserController@markAsRead');
	Route::post('notifications', 'UserController@notifications');
	Route::post('reset-password', 'UserController@resetPassword');
	Route::post('upload-avatar/{userID}', 'UserController@uploadAvatar');
	Route::get('avatar/{userID}', 'UserController@avatar');
});

/* Role Routes */
Route::group(['prefix' => 'role'], function(){
	Route::post('enlist', 'RoleController@enlist');
});

/* User Role Routes */
Route::group(['prefix' => 'user-role'], function(){
	Route::post('enlist', 'UserRoleController@enlist');
});

/* Department Routes*/
Route::group(['prefix' => 'department'], function(){
	Route::post('check-duplicate', 'DepartmentController@checkDuplicate');
	Route::post('enlist', 'DepartmentController@enlist');
});

/* Account Routes*/
Route::group(['prefix' => 'account'], function(){
	Route::post('check-duplicate', 'AccountController@checkDuplicate');
	Route::post('enlist', 'AccountController@enlist');
});

