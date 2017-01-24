<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppraisalForm extends Model
{
    public function appraisal_period()
    {
    	return $this->belongsTo('App\AppraisalForm');
    }

	public function departments()
    {
    	return $this->belongsToMany('App\Department', 'department_appraisal_forms');
    }    
}
