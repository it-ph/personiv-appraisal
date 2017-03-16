<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Department;
use App\Notification;

use Auth;
use Carbon\Carbon;
use DB;
use Hash;
use Gate;
use Storage;

class UserController extends Controller
{
    /**
     * Fetch all notifications of authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(Request $request)
    {
        if(Gate::forUser($request->user())->denies('manage-users'))
        {
            abort(403, 'Unauthorized action.');
        }

        $user = User::find($request->id);

        $user->password = Hash::make('!welcome10');

        $user->save();
    }

    /**
     * Fetch all notifications of authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function notifications(Request $request)
    {
        return Notification::where('notifiable_id', $request->user()->id)->where('notifiable_type', 'App\\User')->orderBy('created_at', 'desc')->paginate($request->paginate);
    }

    /**
     * Mark notifications as read.
     *
     * @return \Illuminate\Http\Response
     */
    public function markAsRead(Request $request)
    {
        if(Gate::forUser($request->user())->denies('read-notification', Notification::find($request->id)->notifiable_id))
        {
            abort(403, 'Unauthorized action.');
        }

        Notification::where('id', $request->id)->update(['read_at' => Carbon::now()]);
    }

    /**
     * Mark all notifications as read.
     *
     * @return \Illuminate\Http\Response
     */
    public function markAllAsRead(Request $request)
    {
        $user = User::find($request->user()->id);

        $user->unreadNotifications()->update(['read_at' => Carbon::now()]);
    }

    /**
     * View user avatar and upload new avatar.
     *
     * @return \Illuminate\Http\Response
     */
    public function avatar($id)
    {
        $user = User::withTrashed()->where('id', $id)->first();

        return response()->file(storage_path() .'/app/'. $user->avatar_path);
    }

    /**
     * Upload post photo.
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadAvatar(Request $request, $id)
    {
        if(Gate::forUser($request->user())->denies('upload-avatar', $id))
        {
            abort(403, 'Unauthorized action');
        }

        $user = User::where('id', $request->user()->id)->first();

        if($user->avatar_path)
        {
            Storage::delete($user->avatar_path);
        }

        $path = Storage::putFileAs('avatars', $request->file('file'), $request->user()->id);

        $user->avatar_path = $path;

        $user->save();

        return $user->avatar_path;
    }

    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $users = User::query();

        if($request->has('withTrashed'))
        {
            $users->withTrashed();
        }

        if($request->has('with'))
        {
            for ($i=0; $i < count($request->with); $i++) { 
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $users->with($request->input('with')[$i]['relation']);
                }
            }
        }

        if(!$request->user()->super_admin)
        {
            $users->where('department_id', $request->user()->department_id);
        }

        if($request->has('where'))
        {
            for ($i=0; $i < count($request->where); $i++) { 
                $users->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->has('whereNotIn'))
        {
            for ($i=0; $i < count($request->whereNotIn); $i++) { 
                $users->whereNotIn($request->input('whereNotIn')[$i]['label'], $request->input('whereNotIn')[$i]['values']);
            }
        }        

        if($request->has('do_not_include_current_user'))
        {
            $users->whereNotIn('id', [$request->user()->id]);
        }

        if($request->has('search'))
        {
            $users->where('first_name', 'like', '%'.$request->search.'%')->orWhere('middle_name', 'like', '%'.$request->search.'%')->orWhere('last_name', 'like', '%'.$request->search.'%')->orWhere('suffix', 'like', '%'.$request->search.'%')->orWhere('employee_number', $request->search)->orWhere('email', $request->search);
        }

        if($request->has('paginate'))
        {
            return $users->paginate($request->paginate);
        }

        if($request->has('first'))
        {
            return $users->first();
        }

        return $users->get();
    }

    /**
     * Checks authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function check(Request $request)
    {
        $user = Auth::user();

        $user->unread_notifications = $user->unreadNotifications;

        $user->load('department', 'account', 'immediate_supervisor', 'head_of.department', 'roles');

        return $user;
    }

    /**
     * Checks if the employee number is already taken.
     *
     * @return bool
     */
    public function checkEmployeeNumber(Request $request)
    {
        $user = $request->id ? User::withTrashed()->whereNotIn('id', [$request->id])->where('employee_number', $request->employee_number)->first() : User::withTrashed()->where('employee_number', $request->employee_number)->first();

        return response()->json($user ? true : false);
    }

    /**
     * Checks if the email is already taken.
     *
     * @return bool
     */
    public function checkEmail(Request $request)
    {
        $user = $request->id ? User::withTrashed()->whereNotIn('id', [$request->id])->where('email', $request->email)->first() : User::withTrashed()->where('email', $request->email)->first();

        return response()->json($user ? true : false);
    }
    
    /**
     * Changes the password of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if($request->new == $request->confirm && $request->old != $request->new)
        {
            $user->password = Hash::make($request->new);
        }

        $user->save();
    }

    /**
     * Check if the password of the authenticated user is the same with his new password.
     *
     * @return bool
     */
    public function checkPassword(Request $request)
    {
        return response()->json(Hash::check($request->old, $request->user()->password));
    }

    /**
     * Logout the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        Auth::logout();
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
        if(Gate::forUser(Auth::user())->denies('manage-users'))
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
        if(Gate::forUser($request->user())->denies('manage-users'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = User::where('employee_number', $request->employee_number)->orWhere('email', $request->email)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'first_name' => 'required',
            'last_name' => 'required',
            'employee_number' => 'required',
            'email' => 'required',
            'password' => 'required',
            'department_id' => 'required',
        ]);

        DB::transaction(function() use($request){
            $user = new User;

            $user->first_name = $request->first_name;
            $user->middle_name = $request->middle_name;
            $user->last_name = $request->last_name;
            $user->suffix = $request->suffix;
            $user->employee_number = $request->employee_number;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->department_id = $request->department_id;
            $user->account_id = $request->account_id;
            $user->super_admin = false;

            $user->save();

            $roles = array();

            for ($i=0; $i < count($request->roles); $i++) { 
                if(isset($request->input('roles')[$i]['id']))
                {
                    array_push($roles, $request->input('roles')[$i]['id']);
                }
            }
            
            $user->roles()->attach($roles);

            if($request->department_head)
            {
                $department = Department::find($user->department_id);

                $department->heads()->attach($user->id);
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
        return User::withTrashed()->where('id', $id)->first();
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
        if(Gate::forUser($request->user())->denies('manage-users'))
        {
            abort(403, 'Unauthorized action.');
        }

        $duplicate = User::where(function($query) use($request){
            $query->whereNotIn('id', [$request->id])->where('employee_number', $request->employee_number);
        })
        ->orWhere(function($query) use($request){
            $query->whereNotIn('id', [$request->id])->where('email', $request->email);
        })->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $this->validate($request, [
            'first_name' => 'required',
            'last_name' => 'required',
            'employee_number' => 'required',
            'email' => 'required',
            'department_id' => 'required',
        ]);

        DB::transaction(function() use($request, $id){
            $user = User::find($id);

            $user->first_name = $request->first_name;
            $user->middle_name = $request->middle_name;
            $user->last_name = $request->last_name;
            $user->suffix = $request->suffix;
            $user->employee_number = $request->employee_number;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->department_id = $request->department_id;
            $user->account_id = $request->account_id;
            $user->super_admin = false;

            $user->save();

            $roles = array();

            for ($i=0; $i < count($request->roles); $i++) { 
                if(isset($request->input('roles')[$i]['id']))
                {
                    array_push($roles, $request->input('roles')[$i]['id']);
                }
            }
            
            $user->roles()->sync($roles);
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
        if(!Gate::forUser(Auth::user())->allows('manage-users') && !Auth::user()->super_admin)
        {
            abort(403, 'Unauthorized action.');
        }

        User::where('id', $id)->delete();
    }
}
