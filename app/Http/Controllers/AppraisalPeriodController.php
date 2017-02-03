<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\AppraisalPeriod;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class AppraisalPeriodController extends Controller
{
    /**
     * Check if resource already exists.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicate(Request $request)
    {
        $duplicate = $request->id ? AppraisalPeriod::whereNotIn('id', [$request->id])->where('start', Carbon::parse($request->start))->where('end', Carbon::parse($request->end))->where('appraisal_year', $request->appraisal_year)->where('goals_percentage', $request->goals_percentage)->where('behavioral_competency_percentage', $request->behavioral_competency_percentage)->first() : AppraisalPeriod::where('start', Carbon::parse($request->start))->where('end', Carbon::parse($request->end))->where('appraisal_year', $request->appraisal_year)->where('goals_percentage', $request->goals_percentage)->where('behavioral_competency_percentage', $request->behavioral_competency_percentage)->first();
    
        return response()->json($duplicate ? true : false);
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $appraisal_periods = AppraisalPeriod::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $appraisal_periods->with($request->input('with')[$i]['relation']);
                }
                else{
                    $appraisal_periods->with([$request->input('with')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $appraisal_periods->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $appraisal_periods->where('start', 'like', '%'.$request->search.'%')->orWhere('end', 'like', '%'.$request->search.'%')->orWhere('appraisal_year', $request->search);
        }

        if($request->has('first'))
        {
            return $appraisal_periods->first();
        }

        if($request->has('paginate'))
        {
            return $appraisal_periods->paginate($request->paginate);
        }

        return $appraisal_periods->get();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return AppraisalPeriod::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(Gate::forUser(Auth::user())->denies('appraisal-periods'))
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
        if(Gate::forUser($request->user())->denies('appraisal-periods'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = AppraisalPeriod::where('start', Carbon::parse($request->start))->where('end', Carbon::parse($request->end))->where('appraisal_year', $request->appraisal_year)->where('goals_percentage', $request->goals_percentage)->where('behavioral_competency_percentage', $request->behavioral_competency_percentage)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'start' => 'required',
            'end' => 'required',
            'appraisal_year' => 'required',
            'goals_percentage' => 'required',
            'behavioral_competency_percentage' => 'required',
        ]);

        $appraisal_period = new AppraisalPeriod;

        $appraisal_period->start = Carbon::parse($request->start);
        $appraisal_period->end = Carbon::parse($request->end);
        $appraisal_period->appraisal_year = $request->appraisal_year;
        $appraisal_period->goals_percentage = $request->goals_percentage;
        $appraisal_period->behavioral_competency_percentage = $request->behavioral_competency_percentage;

        $appraisal_period->save();
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
        if(Gate::forUser($request->user())->denies('appraisal-periods'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = AppraisalPeriod::whereNotIn('id', [$id])->where('start', Carbon::parse($request->start))->where('end', Carbon::parse($request->end))->where('appraisal_year', $request->appraisal_year)->where('goals_percentage', $request->goals_percentage)->where('behavioral_competency_percentage', $request->behavioral_competency_percentage)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'start' => 'required',
            'end' => 'required',
            'appraisal_year' => 'required',
            'goals_percentage' => 'required',
            'behavioral_competency_percentage' => 'required',
        ]);

        $appraisal_period = AppraisalPeriod::find($id);

        $appraisal_period->start = Carbon::parse($request->start);
        $appraisal_period->end = Carbon::parse($request->end);
        $appraisal_period->appraisal_year = $request->appraisal_year;
        $appraisal_period->goals_percentage = $request->goals_percentage;
        $appraisal_period->behavioral_competency_percentage = $request->behavioral_competency_percentage;

        $appraisal_period->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Gate::forUser(Auth::user())->denies('appraisal-periods'))
        {
            abort(403, 'Unauthorized action');
        }

        $appraisal_period = AppraisalPeriod::withCount('appraisal_forms')->where('id', $id)->first();

        if($appraisal_period->appraisal_forms_count)
        {
            abort(403, 'Unable to delete appraisal period with associated appraisal forms.'); 
        }

        $appraisal_period->delete();
    }
}
