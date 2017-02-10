<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
	use SoftDeletes;

    protected $dates = ['deleted_at'];

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
    	return $this->belongsToMany('App\BehavioralCompetency', 'review_behavioral_competency_responses');
    }

    public function goals()
    {
    	return $this->belongsToMany('App\Goal', 'review_goal_responses');
    }
}
