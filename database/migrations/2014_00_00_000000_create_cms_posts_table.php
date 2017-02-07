<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCmsPostsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('cms_posts', function(Blueprint $table)
		{
            $table->increments('id');
		    $table->string('title');
            $table->integer('uid')->index();
            $table->integer('cid')->index();
            $table->string('description');
            $table->text('content');
            //$table->timestamp('published_at');
            $table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('cms_posts');
	}

}
