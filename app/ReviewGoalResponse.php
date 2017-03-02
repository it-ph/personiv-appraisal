<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReviewGoalResponse extends Model
{
	protected $guarded = [];

	protected $touches = ['review'];

    public function review()
    {
    	return $this->belongsTo('App\Review');
    }

    public function goal()
    {
    	return $this->belongsTo('App\Goal');
    }

    public function supervisor_goal_responses()
    {
        return $this->hasMany('App\SupervisorGoalResponse');
    }
}
