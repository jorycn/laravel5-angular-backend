<?php namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Registrar;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller {

    protected $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }
    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIndex()
	{
        $data = $this->user->paginate(10);
        return response()->json($data);
	}

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEdit($id)
    {
        $data = ['data' =>$this->user->find($id)];
        return response()->json($data);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStore(Request $request,Registrar $registrar)
    {
        $is_exist = $this->user->where('email', $request->input('email'))->first();
        if($is_exist){
            return response()->json(['status'=>false, 'message'=>'邮箱已存在！']);
        }
        $user = $registrar->create($request->all());
        //添加默认用户组
        $user->attachRole(Role::find(2));
        return response()->json(['status'=>$user?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putUpdate($id)
    {
        $data = Input::all();
        $user = Sentry::findUserById($id);

        $user->email = $user->username = $data['email'];
        $user->activated = $data['activated'];
        if($user->save()){
            return response()->json(['status'=>1]);
        }else{
            return response()->json(['status'=>0]);
        }

    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDestroy($id)
    {
        $user = Sentry::findUserById($id);
        $status = $user->delete()?1:0;

        return response()->json(['status'=>$status]);
    }

    public function getAttr()
    {
        $user = new User;
        return response()->json(['data'=>$user->getAttr()]);
    }

	
}