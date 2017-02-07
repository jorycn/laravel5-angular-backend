<?php namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;

class SlideController extends Controller {
    
    public $slide;
    public function __construct(\Slide $slide){
        $this->slide = $slide;
    }
    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIndex()
    {
        $data = $this->slide->paginate(10)->toArray();
        return response()->json($data);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEdit($id)
    {
        $data = ['data' =>$this->slide->find($id)];
        return response()->json($data);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStore()
    {

        $slide = $this->slide->create(Input::all());

        if($slide){
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
        $slide = $this->slide->find($id);
        $slide->fill(Input::all());
        if($slide->save()){
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
        $slide = $this->slide->find($id);
        return response()->json(['status'=>$slide->delete()?1:0]);
    }

    public function getAttr()
    {
        return response()->json(['data'=>(new \Slide)->getAttr()]);
    }


}