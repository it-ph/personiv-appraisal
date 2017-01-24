<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
        	[
        		'employee_number' => '10071128',
        		'last_name' => 'Paco',
        		'first_name' => 'Marco Christian',
        		'middle_name' => 'Santillan',
        		'suffix' => null,
        		'email' => 'marco.paco@personiv.com',
        		'password' => bcrypt('admin222526'),
        		'account_id' => null,
        		'department_id' => 1,
        		'immediate_supervisor_id' => 2,
        		'super_admin' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()
        	],
        	[
        		'employee_number' => '05100077',
        		'last_name' => 'Cabatotan',
        		'first_name' => 'Romel',
        		'middle_name' => null,
        		'suffix' => null,
        		'email' => 'romel.cabatotan@personiv.com',
        		'password' => bcrypt('!welcome10'),
        		'account_id' => null,
        		'department_id' => 1,
        		'immediate_supervisor_id' => 3,
        		'super_admin' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()	
        	],
        	[
        		'employee_number' => '05090030',
        		'last_name' => 'Talingdan',
        		'first_name' => 'Jaime',
        		'middle_name' => null,
        		'suffix' => 'Jr.',
        		'email' => 'jhai.talingdan@personiv.com',
        		'password' => bcrypt('!welcome10'),
        		'account_id' => null,
        		'department_id' => 1,
        		'immediate_supervisor_id' => null,
        		'super_admin' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now()	
        	],
            [
                'employee_number' => '10071421',
                'last_name' => 'Limgenco',
                'first_name' => 'Ainsley Sears',
                'middle_name' => null,
                'suffix' => null,
                'email' => 'ainsley.limgenco@personiv.com',
                'password' => bcrypt('!welcome10'),
                'account_id' => null,
                'department_id' => 1,
                'immediate_supervisor_id' => null,
                'super_admin' => 1,
                'created_at' => Carbon\Carbon::now(),
                'updated_at' => Carbon\Carbon::now()    
            ],
        ]);
    }
}