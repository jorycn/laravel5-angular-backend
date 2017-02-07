<?php namespace App\Models;


class Slide extends Selfvalidator {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'slides';
    protected $fillable = ['title','type','activated','width','height','description'];

    /**
     * Validation rules
     *
     * @var Array
     */
    protected static $rules = array();

    /**
     * Custom messages
     *
     * @var Array
     */
    protected static $messages = array();

    public function getAttr()
    {
        $slide_type = Config::get('ad.type');
        $type = [];
        foreach($slide_type as $k => $v){
            $type[$k] = ['label'=>$v];
        }
        return [
            'title' =>[
                'type'  =>'text',
                'label' =>'标题'
            ],
            'type'   =>[
                'type'  =>'select',
                'label' =>'广告类型',
                'empty' =>'--请选择--',
                'options' => $type
            ],
            'width' =>[
                'type' =>'text',
                'label'=>'宽'
            ],
            'height' =>[
                'type' =>'text',
                'label'=>'高'
            ],
            'activated' =>[
                'type'  =>'switch',
                'label' =>'状态',
                'values'=>["1" => "正常","0"=>"禁用"]
            ],
            'description'=>[
                'type'      =>'textarea',
                'label'     =>'备注',
                'nullable'  =>true
            ]
        ];
    }

    public function banners()
    {
        return $this->hasMany('Banner');
    }


}
