<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReviewGoalResponse extends Model
{
    public function review()
    {
    	return $this->belongsTo('App\Review');
    }

    public function goal()
    {
    	return $this->belongsTo('App\Goal');
    }
}
