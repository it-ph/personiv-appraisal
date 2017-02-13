<?php

use Illuminate\Database\Seeder;

class BehavioralCompetenciesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('behavioral_competencies')->insert([
        	[
        		'parameter' => 'Quantity of Work',
        		'description' => 'Produce acceptable amount of work in relation to reasonable expectations, availability of resources etc.',
        		'appraisal_form_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'parameter' => 'Communications',
        		'description' => 'Communicates in a clear and concise manner both verbally and in writing; exhibits good listening and comprehension skills; uses appropriate communication methods',
        		'appraisal_form_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'parameter' => 'Proactivity and Initiative',
        		'description' => 'Develops new ideas and can handle new situations: anticipates and appropriately handles unforeseen difficulties successfully; seeks increase responsibilities; ask for help when needed. Uses resources effectively.',
        		'appraisal_form_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'parameter' => 'Flexibility',
        		'description' => 'Maintains a high level of performance under the varying conditions of managing multiple priorities or uncertainty; adapts to new situations in a positive manner.',
        		'appraisal_form_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        	[
        		'parameter' => 'Interpersonal Relations',
        		'description' => 'Treats other with respect and courtesy; works effectively and cooperatively with others; respects individual differences and perspective',
        		'appraisal_form_id' => 1,
        		'created_at' => Carbon\Carbon::now(),
        		'updated_at' => Carbon\Carbon::now(),
        	],
        ]);
    }
}
