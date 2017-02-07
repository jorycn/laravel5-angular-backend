<?php namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Input;
use App\Models\Setting;

class SettingController extends Controller {

    public $setting;

    /**
     * @param Setting $setting
     */
    public function __construct(Setting $setting){
        $this->setting = $setting;
    }

    public function getInit(){
        $setting = $this->setting->all();
        $set = [];
        foreach($setting as $k => $v){
            $set[$v['key']] = $v['value'];
        }
        return response()->json(['data'=>$set]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function postStore()
	{
		$data = Input::all();
        foreach($data as $k => $v){
            $sxist = $this->setting->where('key', $k)->first();
            if($sxist){
                $sxist->fill(['key'=>$k, 'value'=>$v]);
                $sxist->save();
            }else{
                $this->setting->create(['key'=>$k, 'value'=>$v]);
            }
        }
        //更新缓存
        (new Setting)->cacheSetting();
        return response()->json(['status'=>1]);
	}
	
}