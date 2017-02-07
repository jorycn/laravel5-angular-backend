<?php namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;

class BannerController extends Controller {

    public $banner;
    public function __construct(\Banner $banner){
        $this->banner = $banner;
    }
    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getList()
    {
        $slide_id = Request::get('slide_id');

        if($slide_id > 0){
            $data = $this->banner->where('slide_id', $slide_id)->paginate(10)->toArray();
        }else{
            $data = $this->banner->paginate(10)->toArray();
        }

        foreach($data['data'] as $k => $v){
            if($v['banner'] > 0){
                $data['data'][$k]['banner'] = \Uploader::select(['id','path'])->find($v['banner']);
            }
        }
        return response()->json($data);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEdit($id)
    {
        $data = ['data' =>$this->banner->find($id)];
        return response()->json($data);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStore()
    {
        $banner = $this->banner->create(Input::all());

        if($banner){
            return response()->json(['status'=>1]);
        }else{
            return response()->json(['status'=>0]);
        }
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function putUpdate($id)
    {
        $banner = $this->banner->find($id);
        $banner->fill(Input::all());
        if($banner->save()){
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
        $banner = $this->banner->find($id);
        return response()->json(['status'=>$banner->delete()?1:0]);
    }

    public function getAttr()
    {
        return response()->json(['data'=>(new \Banner)->getAttr()]);
    }


}