<?php

namespace App\Providers;

use App\User;
use App\Review;
use App\Policies\ReviewPolicy;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Review::class => ReviewPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('appraisal-periods', function($user){
            $user_access = User::where('id', $user->id)->whereHas('roles', function($query){
                $query->where('name', 'appraisal-periods');
            })->first();

            return $user_access || $user->super_admin ? true : false;
        });

        Gate::define('parameters', function($user){
            $user_access = User::where('id', $user->id)->whereHas('roles', function($query){
                $query->where('name', 'parameters');
            })->first();

            return $user_access || $user->super_admin ? true : false;
        });

        Gate::define('supervisor', function($user){
            $user_access = User::where('id', $user->id)->whereHas('roles', function($query){
                $query->where('name', 'supervisor');
            })->first();

            return $user_access || $user->super_admin ? true : false;
        });

        Gate::define('director', function($user){
            $user_access = User::where('id', $user->id)->whereHas('roles', function($query){
                $query->where('name', 'director');
            })->first();

            return $user_access || $user->super_admin ? true : false;
        });

        Gate::define('manage-users', function($user){
            $user_access = User::where('id', $user->id)->whereHas('roles', function($query){
                $query->where('name', 'users');
            })->first();

            return $user_access || $user->super_admin ? true : false;
        });

        Gate::define('manage-departments', function($user){
            $user_access = User::where('id', $user->id)->whereHas('roles', function($query){
                $query->where('name', 'departments');
            })->first();

            return $user_access || $user->super_admin ? true : false;
        });

        Gate::define('upload-avatar', function($user, $id){
            return $user->id == $id;
        });

        Gate::define('read-notification', function($user, $notifiable_id){
            return $user->id == $notifiable_id;
        });   
    }
}
