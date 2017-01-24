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

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index');

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
Route::resource('user-role', 'UserRoleController');

Route::post('/pusher/auth', 'PusherController@auth');
