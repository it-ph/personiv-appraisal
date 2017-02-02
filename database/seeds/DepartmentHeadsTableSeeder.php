<?php

use Illuminate\Database\Seeder;

class DepartmentHeadsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('department_heads')->insert([
        	[
        		'user_id' => 3,
        		'department_id' => 1,
        	],
        	[
        		'user_id' => 4,
        		'department_id' => 1,
        	]
        ]);
    }
}
