<?php

use Illuminate\Database\Seeder;

class AppraisalPeriodsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('appraisal_periods')->insert([
        	'start' => Carbon\Carbon::parse('December 1, 2015'),
        	'end' => Carbon\Carbon::parse('November 30, 2016'),
        	'appraisal_year' => 2016,
        	'goals_percentage' => 80,
        	'behavioral_competency_percentage' => 20,
        	'created_at' => Carbon\Carbon::now(),
        	'updated_at' => Carbon\Carbon::now(),
        ]);
    }
}
