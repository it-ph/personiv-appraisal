<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReviewBehavioralCompetencyResponse extends Model
{
	protected $guarded = [];

	protected $touches = ['review'];

    public function review()
    {
    	return $this->belongsTo('App\Review');
    }

    public function behavioral_competency()
    {
    	return $this->belongsTo('App\BehavioralCompetency');
    }

     public function supervisor_behavioral_competency_responses()
    {
        return $this->hasMany('App\SupervisorBehavioralCompetencyResponse');
    }
}
