<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(DepartmentsTableSeeder::class);
        $this->call(DepartmentHeadsTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(UserRolesTableSeeder::class);
        $this->call(AppraisalPeriodsTableSeeder::class);
        $this->call(AppraisalFormsTableSeeder::class);
        $this->call(GoalsTableSeeder::class);
        $this->call(BehavioralCompetenciesTableSeeder::class);
    }
}
