<?php

use Illuminate\Database\Seeder;

class AppraisalFormsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('appraisal_forms')->insert([
        	'appraisal_period_id' => 1,
        	'department_id' => 1,
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now(),
        ]);
    }
}
