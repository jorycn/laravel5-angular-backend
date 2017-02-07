<?php namespace App\Models;


class Post extends Selfvalidator {

    use \Modules\Cms\Helpers\Taging\TaggableTrait;
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'cms_posts';
    protected $fillable = ['title','uid','cid','description','content'];

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
        return [
            'cid'=>[
                'type'  =>'tree',
                'label' =>'栏目',
                'model' =>'cid',
                'empty' =>'--请选择--',
                'str' => (new Category_cms)->getTreeCategories()
            ],
            'title' =>[
                'type'  =>'text',
                'label' =>'标题',
                'minLength'=>5
            ],
            'tag'   =>[
                'type'  =>'tag',
                'label' =>'Tag',
                'model' =>'tag'
            ],
            'description'=>[
                'type'      =>'textarea',
                'label'     =>'描述',
                'nullable'  =>true
            ],
            'content'=>[
                'type'  =>'editor',
                'model' =>'content',
                'label' =>'内容'
            ]
            
        ];
    }

    public function category()
    {
        return $this->belongsTo('Category_cms','cid');
    }


}
