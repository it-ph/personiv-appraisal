<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use App\Review;
use App\User;
use Carbon\Carbon;

class SupervisorReviewCreated extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Review $review, User $user)
    {
        $this->review = $review;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('New Evaluation')
                    ->greeting('Hello,')
                    ->line($this->user->first_name. ' ' .$this->user->last_name. ' evaluated your performance the appraisal year of ' .$this->review->appraisal_form->appraisal_period->appraisal_year. '.')
                    ->action('View Results', env('APP_URL'). '/home#/' );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'attachment' => $this->review,
            'sender' => $this->user,
            'message' => 'evaluated your appraisal form.',
            'url' => 'main.approvals',
            'withParams' => false,
        ];
    }
}
