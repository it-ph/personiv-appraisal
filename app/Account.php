<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function user()
    {
    	return $this->hasMany('App\User');
    }
}
