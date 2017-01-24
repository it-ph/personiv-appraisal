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
        		'name' => 'Manage Forms',
        		'description' => 'user can add, edit or delete evaluation forms',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'name' => 'Set Parameters',
        		'description' => 'user can set targets, goals, and/or parameters in the evaluation form',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'name' => 'Supervisor',
        		'description' => 'user can evaluate his/her immediate subordinates',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'name' => 'Director',
        		'description' => 'user can evaluate all employees',
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        ]);
    }
}
