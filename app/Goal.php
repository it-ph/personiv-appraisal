<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    public function appraisal_form()
    {
    	return $this->belongsTo('App\AppraisalForm');
    }

    public function reviews()
    {
    	return $this->belongsToMany('App\Review', 'review_goals_responses');
    }
}
