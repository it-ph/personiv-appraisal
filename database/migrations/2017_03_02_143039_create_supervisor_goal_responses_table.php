<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSupervisorGoalResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supervisor_goal_responses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('review_goal_response_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->string('rank');
            $table->float('raw_score');
            $table->text('supervisor_rating');
            $table->text('supervisor_remarks')->nullable();
            $table->boolean('confirmed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supervisor_goal_responses');
    }
}
