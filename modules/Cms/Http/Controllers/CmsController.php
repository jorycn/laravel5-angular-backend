<?php namespace Modules\Cms\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\View;

class CmsController extends Controller {

	public function index()
	{
		return View::make('cms::index');
	}
	
}