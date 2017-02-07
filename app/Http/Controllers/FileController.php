<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class FileController extends BaseController {

    public function postUpload() {

        $file = Input::file('file');

        $data = (new Uploader)->upload($file);
        if($data['status']){
            $result = Uploader::create($data['file']);
            if($result){
                return Response::json(['success'=>200,'data'=>$result]);
            }
        }
        return Response::json('error', 400);

    }

    public function postDeleteImage()
    {
        $status = (new Uploader)->deleteImage(Input::get('id'));
        if($status){
            return Response::json('success', 200);
        }
        return Response::json('error', 400);
    }

    public function anyAvatar()
    {
        $user = Sentry::getUser();
        $savePath = '/uploads/avatar/';  //图片存储路径
        $savePicName = md5($user->email);  //图片存储名称

        $file['162'] = $savePath.$savePicName."_162.jpg";
        $file['48'] = $savePath.$savePicName."_48.jpg";
        $file['20'] = $savePath.$savePicName."_20.jpg";

        File::put(public_path().$file['162'], base64_decode($_POST['pic1']));
        File::put(public_path().$file['48'], base64_decode($_POST['pic2']));
        File::put(public_path().$file['20'], base64_decode($_POST['pic3']));

        $avatar = [];
        foreach($file as $k=>$v){
            $avatar['avatar'.$k] = Uploader::create([
                'disk_name'=>$savePicName.'_'.$k.'.jpg',
                'file_name'=>$savePicName.'_'.$k.'.jpg',
                'path' => $v,
                'size' => '100',
                'type' => 'image/jpg'
            ])->path;
        }

        return Response::json(['status'=>$user->fill($avatar)->save()?1:0]);
    }

}
