<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SupervisorBehavioralCompetencyResponse extends Model
{
    protected $guarded = [];

    public function review_behavioral_competency_response()
    {
    	return $this->belongsTo('App\ReviewBehavioralCompetencyResponse');
    }

    public function user()
    {
    	return $this->belongsTo('App\User');
    }
}
