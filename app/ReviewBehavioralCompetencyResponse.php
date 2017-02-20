<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReviewBehavioralCompetencyResponse extends Model
{
	protected $guarded = [];

    public function review()
    {
    	return $this->belongsTo('App\Review');
    }

    public function behavioral_competency()
    {
    	return $this->belongsTo('App\BehavioralCompetency');
    }
}
