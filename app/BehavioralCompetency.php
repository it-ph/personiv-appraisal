<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BehavioralCompetency extends Model
{
    public function appraisal_form()
    {
    	return $this->belongsTo('App\AppraisalForm');
    }

    public function reviews()
    {
    	return $this->belongsToMany('App\Review', 'review_behavioral_competency_responses');
    }
}
