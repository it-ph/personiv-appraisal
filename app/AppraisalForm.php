<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppraisalForm extends Model
{
    public function appraisal_period()
    {
    	return $this->belongsTo('App\AppraisalForm');
    }

	public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function reviews()
    {
    	return $this->hasMany('App\Review');
    }    
}
