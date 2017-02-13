<?php

use Illuminate\Database\Seeder;

class GoalsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('goals')->insert([
        	[
	        	'parameter' => 'Performance/Target',
                'weight' => 0.7,
                'appraisal_form_id' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now(),
            ],
            [
                'parameter' => 'Attendance',
                'weight' => 0.3,
	        	'appraisal_form_id' => 1,
	        	'created_at' => Carbon\Carbon::now(),
	        	'updated_at' => Carbon\Carbon::now(),
        	],
        ]);
    }
}
