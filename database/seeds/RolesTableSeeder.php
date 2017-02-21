<?php

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
        	[
        		'name' => 'appraisal-periods',
        		'description' => 'User can add, edit or delete appraisal periods',
                'super_admin_action' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'parameters',
                'description' => 'User can set targets, goals, and/or parameters in the evaluation form',
                'super_admin_action' => 0,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'supervisor',
                'description' => 'User can evaluate his/her immediate subordinates',
                'super_admin_action' => 0,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'director',
                'description' => 'User can evaluate all employees',
                'super_admin_action' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'manage-users',
                'description' => 'User can manage employee accounts',
                'super_admin_action' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'manage-departments',
                'description' => 'User can manage departments',
                'super_admin_action' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'dashboard',
                'description' => 'User can view overall results of the appraisal year.',
                'super_admin_action' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            // [
            //     'name' => 'manage-accounts',
            //     'description' => 'user can manage department\'s accounts',
            //     'created_at' => Carbon\Carbon::now(),
            //     'updated_at' => Carbon\Carbon::now(),
            // ],
        ]);
    }
}
