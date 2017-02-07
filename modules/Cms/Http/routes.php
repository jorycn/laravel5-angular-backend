<?php

Route::group(['prefix' => 'blog', 'namespace' => 'Modules\Cms\Http\Controllers'], function()
{
	Route::get('/', 'CmsController@index');
});