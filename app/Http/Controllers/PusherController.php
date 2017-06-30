<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Pusher;

class PusherController extends Controller
{
    public function auth(Request $request)
    {
    	$pusher = new Pusher(env('PUSHER_KEY'), env('PUSHER_SECRET'), env('PUSHER_APP_ID'), array('cluster' => 'PUSHER_APP_CLUSTER'));
    	
    	echo $pusher->socket_auth($request->channel_name, $request->socket_id);
    }

    public function config(Request $request)
    {
        $config = [
            'key' => env('PUSHER_KEY'),
            'cluster' => env('PUSHER_APP_CLUSTER'),
        ];

        return response()->json($config);        
    }
}
