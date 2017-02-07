<?php namespace App\Models;

use App\Helpers\Tree;

class Category_cms extends Selfvalidator {


    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'cms_categories';
    protected $fillable = ['name','pid','slug','thumb','description'];

    public function getAttr()
    {
        return [
            'pid'  =>[
                'type'  =>'tree',
                'label' =>'上级栏目',
                'model' =>'pid',
                'empty' => '--作为一级栏目--',
                'str' => (new Category_cms)->getTreeCategories()
            ],
            'name' =>[
                'type'  =>'text',
                'label' =>'标题'
            ],
            'slug' =>[
                'type'  =>'text',
                'label' =>'slug'
            ],
            'thumb' =>[
                'type'  =>'upload',
                'label' =>'缩略图',
                'model' =>'thumb',
                'nullable' =>true
            ],
            'description'=>[
            	'type' =>'textarea',
            	'label' =>'备注',
            	'nullable' =>true
            ]
        ];
    }

    public function posts()
    {
    	return $this->hasMany('Post');
    }

    public function getTreeCategories()
    {
        $categories = $this->select('id','name','pid')->get()->toArray();

        if(count($categories)>0){
            $tree = new Tree;
            $tree->icon = array('&nbsp;&nbsp;&nbsp;│ ', '&nbsp;&nbsp;&nbsp;├─ ', '&nbsp;&nbsp;&nbsp;└─ ');
            $array = [];
            $selected = '';
            foreach ($categories as $r) {
                $r['parentid']=$r['pid'];
                //$r['selected'] = (strcmp($r['id'], $cid) == 0)?"selected=selected":"";
                $array[] = $r;
            }
            $tree->init($array);
            $str = "<option value='\$id' \$selected>\$spacer\$name</option>";
            $tree = $tree->get_tree(0, $str);

            return $tree;
        }else{
            return null;
        }
    }

    public function getCategories($pid)
    {
        $sub_cate = $this->select(['id','pid','name'])->where('pid', $pid)->get();
        $data = [];
        foreach ($sub_cate as $v) {
            $data[$v['id']] = ['label'=>$v['name']];
        }
        return $data;
    }

    public function thumb()
    {
        return $this->hasOne('File');
    }

    public function subCategories()
    {
        return $this->hasMany('Category_cms','pid');
    }

}
