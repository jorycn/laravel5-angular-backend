<?php namespace Modules\Cms\Helpers\Taging;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model {

    //不同模块下注意修改
    public $namespace =  'Modules\Cms\Helpers\Taging';
	protected $table = 'cms_tags';

	public $timestamps = false;
	protected $softDelete = false;
	public $fillable = ['name'];
    public $normalizer;
    public $displayer;
	
	public function __construct(array $attributes = array()) {
		parent::__construct($attributes);

        $this->normalizer = $this->namespace.'\TaggingUtil::slug';
        $this->displayer = 'Illuminate\Support\Str::title';
	}
	
	public function save(array $options = array()) {
		$validator = \Validator::make(
			array('name' => $this->name),
			array('name' => 'required|min:1')
		);
		
		if($validator->passes()) {
			
			$this->slug = call_user_func($this->normalizer, $this->name);
			parent::save($options);
		} else {
			throw new \Exception('Tag Name is required');
		}
	}
	
	/**
	 * Get suggested tags
	 */
	public function scopeSuggested($query) {
		return $query->where('suggest', true);
	}
	
	/**
	 * Name auto-mutator
	 */
	public function setNameAttribute($value) {
		$this->attributes['name'] = call_user_func($this->displayer, $value);
	}
	
}
