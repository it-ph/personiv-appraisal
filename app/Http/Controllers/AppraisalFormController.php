<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\AppraisalForm;
use App\BehavioralCompetency;
use App\Goal;

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

        if($request->has('withCount'))
        {
            for ($i=0; $i < count($request->withCount); $i++) { 
                if(!$request->input('withCount')[$i]['withTrashed'])
                {
                    $appraisal_forms->withCount($request->input('withCount')[$i]['relation']);
                }
                else{
                    $appraisal_forms->withCount([$request->input('withCount')[$i]['relation'] => function($query){
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
        return AppraisalForm::all();
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
        if(Gate::forUser($request->user())->denies('parameters'))
        {
            abort(403, 'Unauthorized action');
        }

        $this->validate($request, [
            'appraisal_period_id' => 'required',
            'goals' => 'required',
            'behavioral_competencies' => 'required',
        ]);

        $appraisal_form = new AppraisalForm;

        DB::transaction(function() use($request, $appraisal_form){
            $appraisal_form->appraisal_period_id = $request->input('appraisal_period_id');
            $appraisal_form->department_id = $request->department_id;
            $appraisal_form->description = $request->description;

            $appraisal_form->save();

            for ($i=0; $i < count($request->input('behavioral_competencies')); $i++) { 
                $behavorial_competency = new BehavioralCompetency;

                $behavorial_competency->appraisal_form_id = $appraisal_form->id;
                $behavorial_competency->parameter = $request->input('behavioral_competencies')[$i]['parameter'];
                $behavorial_competency->description = $request->input('behavioral_competencies')[$i]['description'];

                $behavorial_competency->save();
            }

            for ($i=0; $i < count($request->input('goals')); $i++) { 
                $goal = new Goal;

                $goal->appraisal_form_id = $appraisal_form->id;
                $goal->parameter = $request->input('goals')[$i]['parameter'];
                $goal->weight = $request->input('goals')[$i]['weight'] / 100;

                $goal->save();
            }
        });

        return $appraisal_form;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return AppraisalForm::findOrFail($id);
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
        if(Gate::forUser($request->user())->denies('parameters'))
        {
            abort(403, 'Unauthorized action');
        }

        $this->validate($request, [
            'appraisal_period' => 'required',
            'goals' => 'required',
            'behavioral_competencies' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $appraisal_form = AppraisalForm::find($id);

            $appraisal_form->appraisal_period_id = $request->input('appraisal_period_id');
            $appraisal_form->department_id = $request->department_id;
            $appraisal_form->description = $request->description;

            $appraisal_form->save();

            for ($i=0; $i < count($request->input('behavioral_competencies')); $i++) { 
                if(isset($request->input('behavioral_competencies')[$i]['id']))
                {
                    $behavorial_competency = BehavioralCompetency::find($request->input('behavioral_competencies')[$i]['id']);
                }
                else
                {

                    $behavorial_competency = new BehavioralCompetency;
                }

                $behavorial_competency->appraisal_form_id = $appraisal_form->id;
                $behavorial_competency->parameter = $request->input('behavioral_competencies')[$i]['parameter'];
                $behavorial_competency->description = $request->input('behavioral_competencies')[$i]['description'];

                $behavorial_competency->save();
            }

            for ($i=0; $i < count($request->input('goals')); $i++) { 
                if(isset($request->input('goals')[$i]['id']))
                {
                    $goal = Goal::find($request->input('goals')[$i]['id']);
                }
                else
                {
                    $goal = new Goal;
                }

                $goal->appraisal_form_id = $appraisal_form->id;
                $goal->parameter = $request->input('goals')[$i]['parameter'];
                $goal->weight = $request->input('goals')[$i]['weight'] / 100;

                $goal->save();
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
        if(Gate::forUser(Auth::user())->denies('parameters'))
        {
            abort(403, 'Unauthorized action');
        }

        $appraisal_form = AppraisalForm::withCount('reviews')->where('id', $id)->first();

        if($appraisal_form->reviews_count)
        {
            abort(403, 'Cannot delete appraisal form with associated reviews already.');
        }

        $appraisal_form->delete();
    }
}
