<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

// use App\ReviewGoalResponse;
// use App\ReviewBehavioralCompetencyResponse;
// use App\SupervisorGoalResponse;
// use App\SupervisorBehavioralCompetencyResponse;

class Review extends Model
{
    protected $fillable = ['user_id', 'appraisal_form_id'];

    protected function raw_score_rating($raw_score)
    {
        if($raw_score < 70)
        {
            return 1;
        }
        else if($raw_score >= 70 && $raw_score < 80)
        {
            return 2;             
        }
        else if($raw_score >= 80 && $raw_score < 90)
        {
            return 3;             
        }
        else if($raw_score >= 90 && $raw_score < 96)
        {
            return 4;             
        }
        else if($raw_score >= 96 && $raw_score <= 100)
        {
            return 5;             
        }
    }

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

    public function createSupervisorGoalResponses($goals, User $user)
    {
        foreach ($goals as $goal) {

            $review_goal_response = ReviewGoalResponse::find($goal['id']);

            $supervisor_goal_response = new SupervisorGoalResponse([
                'user_id' => $user->id, 
                'raw_score' => $goal['raw_score'],
                'supervisor_rating' => $this->raw_score_rating($goal['raw_score']),
                'supervisor_remarks' => isset($goal['supervisor_remarks']) ? $goal['supervisor_remarks'] : null,
                'rank' => $goal['rank'],
            ]);

            $review_goal_response->supervisor_goal_responses()->save($supervisor_goal_response);
        }
    }

    public function createSupervisorBehavioralCompetencyResponses($behavioral_competencies, User $user)
    {
        foreach ($behavioral_competencies as $behavioral_competency) {
            $review_behavioral_competency_response = ReviewBehavioralCompetencyResponse::find($behavioral_competency['id']);

            $supervisor_behavioral_competency_response = new SupervisorBehavioralCompetencyResponse([
                'user_id' => $user->id, 
                'supervisor_rating' => $behavioral_competency['supervisor_rating'],
                'supervisor_remarks' => isset($behavioral_competency['supervisor_remarks']) ? $behavioral_competency['supervisor_remarks'] : null,
                'rank' => $behavioral_competency['rank'],
            ]);

            $review_behavioral_competency_response->supervisor_behavioral_competency_responses()->save($supervisor_behavioral_competency_response);            
        }   
    }

    public function updateSupervisorGoalResponses($goals)
    {
        foreach ($goals as $goal) {
            $supervisor_goal_response = SupervisorGoalResponse::find($goal['supervisor_goal_response_id']);

            $supervisor_goal_response->raw_score = $goal['raw_score'];            
            $supervisor_goal_response->supervisor_rating = $this->raw_score_rating($goal['raw_score']);
            $supervisor_goal_response->supervisor_remarks = isset($goal['supervisor_remarks']) ? $goal['supervisor_remarks'] : null;            
            $supervisor_goal_response->rank = $goal['rank'];            

            $supervisor_goal_response->save();                        
        }
    }

    public function updateSupervisorBehavioralCompetencyResponses($behavioral_competencies)
    {
        foreach ($behavioral_competencies as $behavioral_competency) {
            $supervisor_behavioral_competency_response = SupervisorBehavioralCompetencyResponse::find($behavioral_competency['supervisor_behavioral_competency_response_id']);

            $supervisor_behavioral_competency_response->supervisor_rating = $behavioral_competency['supervisor_rating'];
            $supervisor_behavioral_competency_response->supervisor_remarks = isset($behavioral_competency['supervisor_remarks']) ? $behavioral_competency['supervisor_remarks'] : null;            

            $supervisor_behavioral_competency_response->save();                        
        }
    }

    public function confirmSupervisorResponse()
    {
        $self_assessment_goals = 0;
        $self_assessment_behavioral_competencies = 0;

        $supervisor_goals = 0;
        $supervisor_behavioral_competencies = 0;

        foreach ($this->goals as $goal) {
            $supervisor_goal_response = SupervisorGoalResponse::find($goal['supervisor_goal_responses'][0]['id']);

            $supervisor_goal_response->confirmed = true;

            $supervisor_goal_response->save();

            $self_assessment_goals += $goal['self_assessment'] * $goal['goal']['weight'];
            $supervisor_goals += $supervisor_goal_response->raw_score * $goal['goal']['weight'];
        }

        foreach ($this->behavioral_competencies as $behavioral_competency) {
            $supervisor_behavioral_competency_response = SupervisorBehavioralCompetencyResponse::find($behavioral_competency['supervisor_behavioral_competency_responses'][0]['id']);

            $supervisor_behavioral_competency_response->confirmed = true;

            $supervisor_behavioral_competency_response->save();

            $self_assessment_behavioral_competencies += $behavioral_competency['self_appraisal_rating'];
            $supervisor_behavioral_competencies += $supervisor_behavioral_competency_response->supervisor_rating;
        }

        $goals_supervisor_rating_average = $this->raw_score_rating($supervisor_goals);
        $goals_self_assessment_rating_average = round($self_assessment_goals);

        $behavioral_competencies_supervisor_rating_average = $supervisor_behavioral_competencies / count($this->behavioral_competencies);
        $behavioral_competencies_self_assessment_rating_average = $self_assessment_behavioral_competencies / count($this->behavioral_competencies);

        $this->average_goals_score = round(($goals_self_assessment_rating_average  + $goals_supervisor_rating_average) / 2);
        $this->average_behavioral_competency_score = round(($behavioral_competencies_self_assessment_rating_average  + $behavioral_competencies_supervisor_rating_average) / 2);
        $this->overall_rating = round($this->average_goals_score * $this->appraisal_form->appraisal_period->goals_percentage + $this->average_behavioral_competency_score * $this->appraisal_form->appraisal_period->behavioral_competency_percentage);

        $this->save();                         
    }
}
