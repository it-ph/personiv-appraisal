<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppraisalPeriod extends Model
{
    public function departments()
    {
    	return $this->belongsToMany('App\Department', 'appraisal_forms');
    }
}
