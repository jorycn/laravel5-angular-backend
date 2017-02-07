<?php namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller {

	protected $auth;

	public function __construct(Guard $auth)
	{
		$this->auth = $auth;

		$this->middleware('guest', ['except' => 'getLogout']);
	}

	public function postLogin(Request $request)
	{
		$this->validate($request, [
			'email' => 'required', 'password' => 'required',
		]);
		$user = User::where('email', $request->input('email'))->first();
		if($user){
			if(!$user->is('admin')){
				return response()->json(['status'=>false, 'message'=>'未授权']);
			}

			$credentials = $request->only('email', 'password');
			if ($this->auth->attempt($credentials, false))
			{
				return response()->json(['status'=>true]);
			}
		}
		return response()->json(['status'=>false, 'message'=>'用户名或者密码不正确']);
	}

	/**
	 * Log the user out of the application.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function getLogout()
	{
		$this->auth->logout();

		return redirect('/backend');
	}
	
}