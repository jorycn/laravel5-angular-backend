<?php namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Category_cms;
use App\User;

class CmsController extends Controller {

    protected $post;
    protected $category;

    public function __construct(Post $post, Category_cms $category)
    {
        $this->post = $post;
        $this->category = $category;
    }
    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIndex()
	{
        $posts = $this->post->all();
        foreach ($posts as $k=>$v) {
            $posts[$k]['author'] = User::find($v->uid)->username;
        }
        return response()->json($posts);
	}

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEdit($id)
    {
        $post = $this->post->find($id);
        $post->tag = $post->tagNames();

        $data = ['data' =>$post];
        return response()->json($data);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStore()
    {
        $data = array_add(Input::all(),'uid',Auth::user()->id);
        $post = $this->post->create($data);

        //tag处理
        $tags = Input::get('tag');
        if(count($tags) > 0){
            $post->tag($tags);
        }
        return response()->json(['status'=>$post?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putUpdate($id)
    {
        $post = $this->post->find($id);
        //tag处理
        $tags = Input::get('tag');
        if(count($tags) > 0){
            $post->retag($tags);
        }
        $post->fill(Input::all());
        return response()->json(['status'=>$post->save()?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDestroy($id)
    {
        $post = $this->post->find($id);
        return response()->json(['status'=>$post->delete()?1:0]);
    }

    public function getAttr()
    {
        return response()->json(['data'=>$this->post->getAttr()]);
    }

    /**
    * 栏目管理
    *===================================================================
    */
    public function getAllCate()
    {
        $categories = $this->category->all();
        return response()->json(['data'=>$categories]);
    }

    public function getListCate($pid)
    {
        $sub_cate = $this->category->select(['id','pid','name'])->where('pid', $pid)->get();
        return response()->json(['data'=>$sub_cate]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEditCate($id)
    {
        $data = $this->category->find($id);

        if($data->thumb > 0){
            $thumb = Uploader::where('id',$data->thumb)->select(['id','name','path'])->first();
            $data->thumb = $thumb?$thumb:'';
        }
        return response()->json(['data'=>$data]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStoreCate()
    {
        $exist = $this->category->where('slug', Request::input('slug'))->first();
        if($exist){
            return response()->json(['status'=>0, 'message'=>'Slug已存在']);
        }
        $category = $this->category->create(Input::all());
        return response()->json(['status'=>$category?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putUpdateCate($id)
    {
        $category = $this->category->find($id);
        $category->fill(Input::all());
        return response()->json(['status'=>$category->save()?1:0]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDestroyCate($id)
    {
        $category = $this->category->find($id);
        return response()->json(['status'=>$category->delete()?1:0]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAttrCate()
    {
        return response()->json(['data'=>$this->category->getAttr()]);
    }	
}