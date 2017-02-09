<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('appraisal_form_id')->unsigned();
            $table->float('average_goals_score')->nullable();
            $table->float('average_behavioral_competency_score')->nullable();
            $table->float('overall_rating')->nullable();
            $table->text('commitment_remarks')->nullable();
            $table->text('trainings_needed_self_assessment')->nullable();
            $table->text('trainings_needed_supervisor_assessment')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
