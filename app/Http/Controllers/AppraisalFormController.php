<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\AppraisalForm;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class AppraisalFormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
     public function enlist(Request $request)
     {
        $appraisal_forms = AppraisalForm::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $appraisal_forms->with($request->input('with')[$i]['relation']);
                }
                else{
                    $appraisal_forms->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $appraisal_forms->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $appraisal_forms->whereHas('appraisal_period', function($query){
                $query->where('start', 'like', '%'.$request->search.'%')->orWhere('end', 'like', '%'.$request->search.'%')->orWhere('appraisal_year', $request->search);
            });
        }

        if($request->has('first'))
        {
            return $appraisal_forms->first();
        }

        if($request->has('paginate'))
        {
            return $appraisal_forms->paginate($request->paginate);
        }

        return $appraisal_forms->get();
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
        if(Gate::forUser(Auth::user())->denies('parameters'))
        {
            abort(403, 'Unauthorized action');
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
        //
    }
}
