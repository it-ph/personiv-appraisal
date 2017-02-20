<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Review;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;

class ReviewController extends Controller
{
    /**
     * Update self assessment.
     *
     * @return \Illuminate\Http\Response
     */
    public function updateSelfAssessment(Request $request)
    {
        $this->validate($request, [
            'id' => 'required',
            'goals' => 'required',
            'behavioral_competencies' => 'required',
        ]);

        for ($i=0; $i < count($request->goals); $i++) { 
            $this->validate($request, [
                'goals.'.$i.'.id' => 'required',
                'goals.'.$i.'.self_assessment' => 'required',
            ]);
        }

        for ($i=0; $i < count($request->behavioral_competencies); $i++) { 
            $this->validate($request, [
                'behavioral_competencies.'.$i.'.id' => 'required',
                'behavioral_competencies.'.$i.'.self_appraisal_rating' => 'required',
            ]);
        }

        DB::transaction(function() use($request){
            $review = Review::find($request->id);

            $review->updateGoalResponses($request->goals);

            $review->updateBehavioralCompetencyResponses($request->behavioral_competencies);
        });
    }

    /**
     * Self assessment.
     *
     * @return \Illuminate\Http\Response
     */
    public function selfAssessment(Request $request)
    {
        $this->validate($request, [
            'id' => 'required',
            'goals' => 'required',
            'behavioral_competencies' => 'required',
        ]);

        for ($i=0; $i < count($request->goals); $i++) { 
            $this->validate($request, [
                'goals.'.$i.'.self_assessment' => 'required',
            ]);
        }

        for ($i=0; $i < count($request->behavioral_competencies); $i++) { 
            $this->validate($request, [
                'behavioral_competencies.'.$i.'.self_appraisal_rating' => 'required',
            ]);
        }

        DB::transaction(function() use($request){
            $review = Review::find($request->id);

            $review->createGoalResponses($request->goals);

            $review->createBehavioralCompetencyResponses($request->behavioral_competencies);
        });
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
     public function enlist(Request $request)
     {
        $reviews = Review::query();

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $reviews->with($request->input('with')[$i]['relation']);
                }
                else{
                    $reviews->with([$request->input('with')[$i]['relation'] => function($query){
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
                    $reviews->withCount($request->input('withCount')[$i]['relation']);
                }
                else{
                    $reviews->withCount([$request->input('withCount')[$i]['relation'] => function($query){
                        $query->withTrashed();
                    }]);
                }
            }
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $reviews->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('search'))
        {
            $reviews->whereHas('appraisal_period', function($query){
                $query->where('start', 'like', '%'.$request->search.'%')->orWhere('end', 'like', '%'.$request->search.'%')->orWhere('appraisal_year', $request->search);
            });
        }

        if($request->has('first'))
        {
            return $reviews->first();
        }

        if($request->has('paginate'))
        {
            return $reviews->paginate($request->paginate);
        }

        return $reviews->get();
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
        if(Gate::forUser($request->user())->denies('parameters'))
        {
            abort(403, 'Unauthorized action.');
        }

        DB::transaction(function() use($request){
            for ($i=0; $i < count($request->all()); $i++) { 
                $this->validate($request, [
                    $i.'.user_id' => 'required',
                    $i.'.appraisal_form_id' => 'required',
                ]);

                $review = Review::firstOrCreate(['user_id' => $request->input($i.'.user_id'), 'appraisal_form_id' => $request->input($i.'.appraisal_form_id')]);
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
        $review = Review::find($id);

        if(Auth::user()->id != $review->user_id)
        {
            abort(403, 'Unauthorized access.');
        }

        return $review;
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
            abort(403, 'Unauthorized action.');
        }

        DB::transaction(function() use($request, $id){
            $reviews = Review::where('appraisal_form_id', $id)->withCount('goals', 'behavioral_competencies')->get();

            foreach ($reviews as $review) {
                if(!$review->behavioral_competencies_count && !$review->goals_count)
                {
                    $review->delete();
                }
            }

            for ($i=0; $i < count($request->all()); $i++) { 
                $this->validate($request, [
                    $i.'.user_id' => 'required',
                    $i.'.appraisal_form_id' => 'required',
                ]);

                $review = Review::firstOrCreate(['user_id' => $request->input($i.'.user_id'), 'appraisal_form_id' => $request->input($i.'.appraisal_form_id')]);
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
