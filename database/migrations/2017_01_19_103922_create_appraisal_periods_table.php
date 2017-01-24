<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppraisalPeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appraisal_periods', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('from');
            $table->dateTime('end');
            $table->integer('appraisal_year');
            $table->float('goals_percentage')->unsigned();
            $table->float('behavioral_competency_percentage')->unsigned();
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
        Schema::dropIfExists('appraisal_periods');
    }
}
