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
