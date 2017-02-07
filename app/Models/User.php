<?php namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Bican\Roles\Contracts\HasRoleContract;
use Bican\Roles\Contracts\HasPermissionContract;
use Bican\Roles\Traits\HasRole;
use Bican\Roles\Traits\HasPermission;
use Auth;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract, HasRoleContract, HasPermissionContract {

	use Authenticatable, CanResetPassword, HasRole, HasPermission;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['name', 'email', 'password'];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['password', 'remember_token'];

    public function isAdminLogin()
    {
        if(!Auth::check() || !Auth::user()->is('admin')){
            return false;
        }
        return true;
    }

	public function getAttr()
    {
        return [
            'email' =>[
                'type'  =>'text',
                'label' =>'邮箱'
            ],
            'name' =>[
                'type'  =>'text',
                'label' =>'用户名'
            ],
            'password'=>[
                'type'  =>'password',
                'label' =>'密码'
            ],
            'activated' =>[
                'type'  =>'switch',
                'label' =>'状态',
                'values'=>["1" => "正常","0"=>"禁用"]
            ]
        ];
    }

}
