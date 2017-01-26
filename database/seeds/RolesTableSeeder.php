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
        		'description' => 'user can add, edit or delete appraisal periods',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'name' => 'parameters',
        		'description' => 'user can set targets, goals, and/or parameters in the evaluation form',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'name' => 'supervisor',
        		'description' => 'user can evaluate his/her immediate subordinates',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'name' => 'director',
        		'description' => 'user can evaluate all employees',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
            [
                'name' => 'manage-users',
                'description' => 'user can manage employee accounts',
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'manage-departments',
                'description' => 'user can manage departments',
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'name' => 'manage-accounts',
                'description' => 'user can manage department\'s accounts',
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
        ]);
    }
}
