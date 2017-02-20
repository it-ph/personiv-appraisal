<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\ReviewGoalResponse;

class Review extends Model
{
    protected $fillable = ['user_id', 'appraisal_form_id'];

    public function user()
    {
    	return $this->belongsTo('App\User');
    }

    public function appraisal_form()
    {
    	return $this->belongsTo('App\AppraisalForm');
    }

    public function behavioral_competencies()
    {
    	return $this->hasMany('App\ReviewBehavioralCompetencyResponse');
    }

    public function goals()
    {
    	return $this->hasMany('App\ReviewGoalResponse');
    }

    public function createGoalResponses($goals)
    {
        $review_goal_responses = array();

        foreach ($goals as $goal) {
            $review_goal_response = new ReviewGoalResponse([
                'goal_id' => $goal['id'],
                'self_assessment' => $goal['self_assessment'],
                'employee_remarks' => isset($goal['employee_remarks']) ? $goal['employee_remarks'] : null,
            ]);

            array_push($review_goal_responses, $review_goal_response);
        }

        $this->goals()->saveMany($review_goal_responses);
    }

    public function createBehavioralCompetencyResponses($behavioral_competencies)
    {
        $review_behavioral_competency_responses = array();

        foreach ($behavioral_competencies as $behavioral_competency) {
            $review_behavioral_competency_response = new ReviewBehavioralCompetencyResponse([
                'behavioral_competency_id' => $behavioral_competency['id'],
                'self_appraisal_rating' => $behavioral_competency['self_appraisal_rating'], 
                'employee_remarks' => isset($behavioral_competency['employee_remarks']) ? $behavioral_competency['employee_remarks'] : null,
            ]);

            array_push($review_behavioral_competency_responses, $review_behavioral_competency_response);
        }

        $this->behavioral_competencies()->saveMany($review_behavioral_competency_responses);
    }

    public function updateGoalResponses($goals)
    {
        foreach ($goals as $goal) {
            $review_goal_response = ReviewGoalResponse::find($goal['id']);

            $review_goal_response->self_assessment = $goal['self_assessment'];
            $review_goal_response->employee_remarks = $goal['employee_remarks'];

            $review_goal_response->save();
        }
    }

    public function updateBehavioralCompetencyResponses($behavioral_competencies)
    {
        foreach ($behavioral_competencies as $behavioral_competency) {
            $review_behavioral_competency_response = ReviewBehavioralCompetencyResponse::find($behavioral_competency['id']);

            $review_behavioral_competency_response->self_appraisal_rating = $behavioral_competency['self_appraisal_rating'];
            $review_behavioral_competency_response->employee_remarks = $behavioral_competency['employee_remarks'];

            $review_behavioral_competency_response->save();
        }
    }
}
