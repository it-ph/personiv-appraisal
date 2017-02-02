<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Account;
use App\Department;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class DepartmentController extends Controller
{
    /**
     * Check if resource already exists.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? Department::whereNotIn('id', [$request->id])->where('name', $request->name)->first() : Department::where('name', $request->name)->first();
    
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $departments = Department::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $departments->with($request->input('with')[$i]['relation']);
                }
                else{
                    $departments->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $departments->withCount($request->input('withCount')[$i]['relation']);
                }
                else{
                    $departments->withCount([$request->input('withCount')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $departments->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('first'))
        {
            return $departments->first();
        }

        if($request->has('paginate'))
        {
            return $departments->paginate($request->paginate);
        }

        return $departments->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Department::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(Gate::forUser(Auth::user())->denies('manage-departments'))
        {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(Gate::forUser(Auth::user())->denies('manage-departments'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Department::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
        ]);

        DB::transaction(function() use($request){
            $department = new Department;

            $department->name = $request->name;

            $department->save();

            for ($i=0; $i < count($request->accounts); $i++) { 
                $account = new Account;

                $account->name = $request->input('accounts')[$i]['name'];
                $account->department_id = $department->id;

                $account->save();
            } 
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Department::find($id);
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
        if(Gate::forUser(Auth::user())->denies('manage-departments'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = Department::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'name' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $department = Department::find($id);

            $department->name = $request->name;

            $department->save();

            if(!count($request->accounts))
            {
                Account::where('department_id', $id)->delete();
            }
            else
            {            
                for ($i=0; $i < count($request->accounts); $i++) { 
                    $account = isset($request->input('accounts')[$i]['id']) ? Account::find($request->input('accounts')[$i]['id']) : new Account;

                    $account->name = $request->input('accounts')[$i]['name'];
                    $account->department_id = $department->id;

                    $account->save();
                } 
            }
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
