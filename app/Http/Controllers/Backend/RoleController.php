<?php namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use App\Models\Role;
use App\Models\User;
use App\Events\CacheEvent;
use App\Models\Permission;


class RoleController extends Controller {

    protected $role;
    protected $permission;

    public function __construct(Role $role, Permission $permission)
    {
        $this->role = $role;
        $this->permission = $permission;
    }
    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIndex()
    {
        $roles = $this->role->all();
        return response()->json($roles);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEdit($id)
    {
        $role = $this->role->find($id);
        return response()->json(['data'=>$role]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStore()
    {
        $role = $this->role->create(Request::all());
        return response()->json(['status'=>$role?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putUpdate($id)
    {
        $role = $this->role->find($id);
        //tag处理
        $role->fill(Request::all());
        return response()->json(['status'=>$role->save()?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDestroy($id)
    {
        $role = $this->role->find($id);
        return response()->json(['status'=>$role->delete()?1:0]);
    }

    public function getAttr()
    {
        return response()->json(['data'=>$this->role->getAttr()]);
    }

    public function getMembers($id)
    {
        $role = $this->role->find($id)->users;
        return response()->json(['data'=>$role]);
    }

    /**
     * 解除授权
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCancelAccess($id)
    {
        $role = $this->role->find(Request::input('role_id'));
        $detachRole = User::find($id)->detachRole($role);
        return response()->json(['status'=>$detachRole?1:0]);
    }

    /**
     * 用户组添加成员
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putAddMemberRole($id){
        $role = Role::find($id);
        foreach(Request::all() as $user){
            if($user['checked']){
                User::find($user['id'])->attachRole($role);
            }
        }
        return response()->json(['status'=>1]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAccessAttr()
    {
        $route_collection = Route::getRoutes();
        $routes = [];
        foreach ($route_collection as $route) {
            if(!$route->getName() || !$route->getPrefix()) continue;
            $this->permission->firstOrCreate(['name'=>$route->getName(),'slug'=>$route->getName(),'model'=>$route->getPrefix()]);
        }
        return response()->json(['data'=>$this->permission->all()]);
    }

    public function getAccess($id)
    {
        $permissions = $this->role->find($id)->permissions;
        $routes = Cache::get('routes_simple');
        foreach(array_flip($routes) as $k=>$v){
             $allaccess[$k] = isset($permissions[$k])?1:0;
        }

        foreach ($allaccess as $routename => $v) {
            $piece = explode('.', $routename);
            $bool = $v?true:false;
            if(count($piece) < 2){
                $access[$piece[0]][$piece[0]] = $bool;
            }else{
                $access[$piece[0]][$piece[1]][str_replace('.', '_', $routename)] = $bool;
            }
        }

        return response()->json(['data'=>$access]);
    }

    /**
     * 更新权限
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putAccess($id)
    {
        foreach (Input::all() as $k=>$model) {
            if(!is_array($model)) {continue;}
            foreach ($model as $k2 => $group) {
                if(!is_array($group)) {
                    $acclist[$k] = $group;
                }else{
                    foreach ($group as $k3 => $option) {
                        $acclist[str_replace('_', '.', $k3)] = $option;
                    }
                }
            }
        }

        $group = $this->role->find($id);
        $group->permissions = $acclist;
        return Response::json(['status'=>$group->save()?1:0]);
    }
}