<?php namespace App\Models;

class Uploader extends Selfvalidator {
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'files';
    protected $fillable = ['disk_name','file_name','path','size','type'];

    protected $width = '250';
    protected $height = '250';
    protected $imgDir = '/uploads/files/';

    /**
     * @param $file
     * @return array
     */
    public function upload($file)
    {
    	if(!$file->getClientOriginalName()) return ['status'=>false,'code'=>404];

    	$destinationPath = public_path().$this->imgDir;
        $fileName = $file->getClientOriginalName();
        $fileSize = $file->getClientSize();
        $ext      = $file->guessClientExtension();
        $type	  = $file->getMimeType();

        $upload_success = Input::file('file')->move($destinationPath, $fileName);

        if ($upload_success) {

        	$md5_name = md5($fileName.time()).'.'.$ext;
            $_uploadFile = date('Ymd') .'/'.$md5_name;
            if(!File::isDirectory($destinationPath.date('Ymd'))){
                File::makeDirectory($destinationPath.date('Ymd'));
            }
            // resizing an uploaded file
            Image::make($destinationPath . $fileName)->resize($this->width, $this->height)->save($destinationPath.$_uploadFile);
            File::delete($destinationPath . $fileName);

            $data = ['status'=>true, 'code'=>200, 'file' =>[
            	'disk_name' => $fileName,
            	'file_name' => $md5_name,
            	'type'		=> $type,
            	'size'		=> $fileSize,
            	'path'		=> $this->imgDir.$_uploadFile,
            ]];
            return $data;
        }else{
        	return ['status'=>false,'code'=>400];
        }

    }


    /**
     * @param $id
     * @return bool
     */
    public function deleteImage($id)
    {
        $image = $this->find($id)->delete();
        File::delete(public_path() . $image->path);
        $image->delete();
        return true;
    }
}
