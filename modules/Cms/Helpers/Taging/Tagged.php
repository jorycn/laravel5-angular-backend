<?php namespace Modules\Cms\Helpers\Taging;

use Illuminate\Database\Eloquent\Model;

class Tagged extends Model {

	protected $table = 'cms_tagged';
	public $timestamps = false;
	protected $fillable = ['tag_name', 'tag_slug'];

	public function taggable() {
		return $this->morphTo();
	}

}