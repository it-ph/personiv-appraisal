<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSupervisorBehavioralCompetencyResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supervisor_behavioral_competency_responses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('review_behavioral_competency_response_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->text('supervisor_rating');
            $table->text('supervisor_remarks')->nullable();
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
        Schema::dropIfExists('supervisor_behavioral_competency_responses');
    }
}
