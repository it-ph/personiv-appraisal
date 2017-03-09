<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SupervisorGoalResponse extends Model
{
    protected $guarded = [];

    public function review_goal_response()
    {
    	return $this->belongsTo('App\ReviewGoalResponse');
    }

    public function user()
    {
    	return $this->belongsTo('App\User');
    }
}
