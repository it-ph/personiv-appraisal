<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewGoalResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('review_goal_responses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('review_id')->unsigned();
            $table->integer('goal_id')->unsigned();
            $table->float('self_assessment')->nullable();
            $table->text('employee_remarks')->nullable();
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
        Schema::dropIfExists('review_goal_responses');
    }
}
