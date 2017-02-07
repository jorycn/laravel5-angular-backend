<?php namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use App\Model\User;

class Admin {

	/**
	 * The Guard implementation.
	 *
	 * @var Guard
	 */
	protected $auth;

	/**
	 * Create a new filter instance.
	 *
	 * @param  Guard  $auth
	 * @return void
	 */
	public function __construct(Guard $auth)
	{
		$this->auth = $auth;
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$user = $this->auth->user();
		//判断是否是管理员
		if(!$user || !$user->is('admin')){
			$this->auth->logout();
			if ($request->ajax())
			{
				return response('Unauthorized.', 401);
			}else{
				return redirect()->guest('/backend');
			}
		}
		return $next($request);
	}

}
