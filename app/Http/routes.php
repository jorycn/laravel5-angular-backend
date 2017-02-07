<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'IndexController@index');

Route::get('home', ['as'=>'home', 'uses'=>'HomeController@index']);

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

/*
|--------------------------------------------------------------------------
| Backend
|--------------------------------------------------------------------------
|
| 后台基于AngularJs，无需单独模块
|
*/
Route::controller('backend/auth', 'Backend\AuthController');

Route::get('/backend',['as'=>'backend', function(){
    return view('backend');
}]);

Route::group(['prefix' => 'backend', 'namespace' => 'Backend', 'middleware'=>'admin'], function()
{
	Route::controllers([
		'setting'	=> 'SettingController',
	]);
	
	//会员管理
    Route::controller('user', 'UserController', [
        'getIndex'      => 'backend.user.index',
        'getEdit'       => 'backend.user.edit',
        'postStore'     => 'backend.user.create',
        'putUpdate'     => 'backend.user.update',
        'deleteDestroy' => 'backend.user.delete'
    ]);
    //用户组管理
    Route::controller('role', 'RoleController', [
        'getIndex'      => 'backend.role.index',
        'getEdit'       => 'backend.role.edit',
        'postStore'     => 'backend.role.create',
        'putUpdate'     => 'backend.role.update',
        'deleteDestroy' => 'backend.role.delete',
        'getAccess'     => 'backend.role.access'
    ]);

    //cms内管理
    Route::controller('cms', 'CmsController', [
        'getIndex'       => 'backend.cms.post.index',
        'getEdit'        => 'backend.cms.post.edit',
        'postStore'      => 'backend.cms.post.create',
        'putUpdate'      => 'backend.cms.post.update',
        'deleteDestroy'  => 'backend.cms.post.delete',
        //栏目
        'getAllCate'        =>'backend.cms.allcate',
        'getListCate'        =>'backend.cms.listcate',
        'getEditCate'       => 'backend.cms.category.edit',
        'postStoreCate'     => 'backend.cms.category.create',
        'putUpdateCate'     => 'backend.cms.category.update',
        'deleteDestroyCate' => 'backend.cms.category.delete',
    ]);
});