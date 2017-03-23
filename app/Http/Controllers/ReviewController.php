<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Review;
use App\User;

use App\Notifications\SupervisorReviewCreated;

use Auth;
use Carbon\Carbon;
use DB;
use Gate;
use Hash;

class ReviewController extends Controller
{
    /**
     * Confirm review results.
     *
     * @return \Illuminate\Http\Response
     */
    public function confirm(Request $request)
    {
        $this->validate($request, [
            'id' => 'required',
            'supervisor_id' => 'required',
            'password' => 'required',
        ]);

        if(!Hash::check($request->password, $request->user()->password))
        {
            return response()->json(true);
        }

        $review = Review::with('goals.goal')
            ->with('appraisal_form.appraisal_period')
            ->with('behavioral_competencies.behavioral_competency')
            ->with(['behavioral_competencies.supervisor_behavioral_competency_responses' => function($query) use($request){
                $query->where('user_id', $request->supervisor_id);
            }])
            ->with(['goals.supervisor_goal_responses' => function($query) use($request){
                $query->where('user_id', $request->supervisor_id);
            }])
            ->where('id', $request->id)->first();

        if($review->user_id != $request->user()->id || !count($review->behavioral_competencies[0]->supervisor_behavioral_competency_responses) || !count($review->goals[0]->supervisor_goal_responses))
        {
            abort(403, 'Unauthorized access.');
        }

        $review->commitment_remarks = $request->commitment_remarks;
        $review->trainings_needed_self_assessment = $request->trainings_needed_self_assessment;

        DB::transaction(function() use($review){
            $review->confirmSupervisorResponse();
        });
    }

    /**
     * Update supervisor assessment.
     *
     * @return \Illuminate\Http\Response
     */
    public function updateSupervisorResponse(Request $request)
    {
        if((Gate::forUser($request->user())->denies('supervisor') && $request->user()->department_id == $request->user->department_id) && Gate::forUser($request->user())->denies('director'))
        {
            abort(403, 'Unauthorized action.');
        }

        $this->validate($request, [
            'behavioral_competencies' => 'required',
            'goals' => 'required',
        ]);

        for ($i=0; $i < count($request->goals); $i++) { 
            $this->validate($request, [
                'goals.'.$i.'.id' => 'required',
                'goals.'.$i.'.supervisor_goal_response_id' => 'required',
                'goals.'.$i.'.supervisor_rating' => 'required',
                'goals.'.$i.'.rank' => 'required',
            ]);
        }

        for ($i=0; $i < count($request->behavioral_competencies); $i++) { 
            $this->validate($request, [
                'behavioral_competencies.'.$i.'.id' => 'required',
                'behavioral_competencies.'.$i.'.supervisor_behavioral_competency_response_id' => 'required',
                'behavioral_competencies.'.$i.'.supervisor_rating' => 'required',
                'behavioral_competencies.'.$i.'.rank' => 'required',
            ]);
        }

        $review = Review::find($request->id);

        DB::transaction(function() use($request, $review){
            $review->updateSupervisorGoalResponses($request->goals);

            $review->updateSupervisorBehavioralCompetencyResponses($request->behavioral_competencies);
        });
    }

    /**
     * Supervisor assessment.
     *
     * @return \Illuminate\Http\Response
     */
    public function supervisorResponse(Request $request)
    {
        if((Gate::forUser($request->user())->denies('supervisor') && $request->user()->department_id == $request->user->department_id) && Gate::forUser($request->user())->denies('director'))
        {
            abort(403, 'Unauthorized action.');
        }

        $this->validate($request, [
            'behavioral_competencies' => 'required',
            'goals' => 'required',
        ]);

        for ($i=0; $i < count($request->goals); $i++) { 
            $this->validate($request, [
                'goals.'.$i.'.id' => 'required',
                'goals.'.$i.'.supervisor_rating' => 'required',
                'goals.'.$i.'.rank' => 'required',
            ]);
        }

        for ($i=0; $i < count($request->behavioral_competencies); $i++) { 
            $this->validate($request, [
                'behavioral_competencies.'.$i.'.id' => 'required',
                'behavioral_competencies.'.$i.'.supervisor_rating' => 'required',
                'behavioral_competencies.'.$i.'.rank' => 'required',
            ]);
        }

        $review = Review::with('appraisal_form.appraisal_period')->where('id', $request->id)->first();

        DB::transaction(function() use($request, $review){
            $user = User::with('roles')->where('id', $request->user()->id)->first();

            $review->createSupervisorGoalResponses($request->goals, $user);

            $review->createSupervisorBehavioralCompetencyResponses($request->behavioral_competencies, $user);

            $review->user->notify(new SupervisorReviewCreated($review, $request->user()));
        });
    }

    /**
     * Update self assessment.
     *
     * @return \Illuminate\Http\Response
     */
    public function updateSelfAssessment(Request $request)
    {
        $review = Review::find($request->id);
        
        $this->authorize('update', $review);

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

        DB::transaction(function() use($request, $review){
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
        $review = Review::find($request->id);

        $this->authorize('update', $review);

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

        DB::transaction(function() use($request, $review){
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
                    if(isset($request->input('with')[$i]['with']))
                    {
                        $reviews->with([$request->input('with')[$i]['relation'] => function($query) use($request, $i){
                            foreach ($request->input('with')[$i]['with'] as $with) {
                                $query->with($with);
                            }

                            if(isset($request->input('with')[$i]['orderBy']))
                            {
                                foreach ($request->input('with')[$i]['orderBy'] as $orderBy) {
                                    $query->orderBy($orderBy['label'], $orderBy['sort']);
                                }
                            }
                        }]);


                        continue;
                    }

                    if(isset($request->input('with')[$i]['where']))
                    {
                        $reviews->with([$request->input('with')[$i]['relation'] => function($query) use($request, $i){
                            foreach ($request->input('with')[$i]['where'] as $where) {
                                $query->where($where['label'], $where['condition'], $where['value']);
                            }
                            
                            $query->with('user');
                        }]);
                        
                        continue;
                    }

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

        if($request->has('whereNotIn'))
        {
            for ($i=0; $i < count($request->whereNotIn); $i++) { 
                $reviews->whereNotIn($request->input('whereNotIn')[$i]['label'], $request->input('whereNotIn')[$i]['value']);
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
        $review = Review::findOrFail($id);

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
