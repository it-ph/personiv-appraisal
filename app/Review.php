<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['user_id', 'appraisal_form_id'];

    public function user()
    {
    	return $this->belongsTo('App\User');
    }

    public function appraisal_form()
    {
    	return $this->belongsTo('App\AppraisalForm');
    }

    public function behavioral_competencies()
    {
    	return $this->hasMany('App\ReviewBehavioralCompetencyResponse');
    }

    public function goals()
    {
    	return $this->hasMany('App\ReviewGoalResponse');
    }
}
