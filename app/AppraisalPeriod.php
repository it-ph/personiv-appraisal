<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppraisalPeriod extends Model
{
    public function appraisal_forms()
    {
    	return $this->hasMany('App\AppraisalForm');
    }
}
