<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Pusher;

class PusherController extends Controller
{
    public function auth(Request $request)
    {
    	// key, secret, app_id
    	$pusher = new Pusher('ade8d83d4ed5455e3e18', '2a557c5a3543eff6ccd7', '292399');
    	
    	echo $pusher->socket_auth($request->channel_name, $request->socket_id);
    }
}
