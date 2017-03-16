<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppraisalForm extends Model
{
    public function appraisal_period()
    {
    	return $this->belongsTo('App\AppraisalPeriod');
    }

	public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function account()
    {
        return $this->belongsTo('App\Account');
    }

    public function reviews()
    {
    	return $this->hasMany('App\Review');
    }

    public function goals()
    {
        return $this->hasMany('App\Goal');
    }

    public function behavioral_competencies()
    {
        return $this->hasMany('App\BehavioralCompetency');
    }    
}
