<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Account;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class AccountController extends Controller
{
    /**
     * Check if resource already exists.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? Account::whereNotIn('id', [$request->id])->where('name', $request->name)->where('department_id', $request->department_id)->first() : Account::where('name', $request->name)->where('department_id', $request->department_id)->first();
    
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $accounts = Account::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $accounts->with($request->input('with')[$i]['relation']);
                }
                else{
                    $accounts->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $accounts->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $accounts->where('name', 'like', '%'.$request->search.'%');
        }

        if($request->has('first'))
        {
            return $accounts->first();
        }

        if($request->has('paginate'))
        {
            return $accounts->paginate($request->paginate);
        }

        return $accounts->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Gate::forUser(Auth::user())->denies('manage-departments'))
        {
            abort(403, 'Unauthorized action.');
        }

        $account = Account::withCount('users')->where('id', $id)->first();

        if($account->users_count)
        {
            abort(403, 'Unable to delete account with users associated with it.');
        }

        $account->delete();
    }
}
