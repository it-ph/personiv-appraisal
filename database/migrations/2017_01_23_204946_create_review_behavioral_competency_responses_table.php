<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewBehavioralCompetencyResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('review_behavioral_competency_responses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('review_id')->unsigned();
            $table->integer('behavioral_competency_id')->unsigned();
            $table->float('self_appraisal_rating')->nullable();
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
        Schema::dropIfExists('review_behavioral_competency_responses');
    }
}
