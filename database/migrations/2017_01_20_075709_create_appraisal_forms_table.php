<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppraisalFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appraisal_forms', function (Blueprint $table) {
            $table->increments('id');
            $table->text('description')->nullable();
            $table->integer('appraisal_period_id')->unsigned();
            $table->integer('department_id')->unsigned();
            $table->integer('account_id')->nullable()->unsigned();
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
        Schema::dropIfExists('appraisal_forms');
    }
}
