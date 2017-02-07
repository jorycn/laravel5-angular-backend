<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('setting', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('key')->unique();
            $table->string('value');
		});

		//初始化数据
		$this->initSetting();
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('setting');
	}

	public function initSetting()
	{
		DB::table('setting')->insert([
			['key'=>'global_title', 'value'=>'zAdmin'],
			['key'=>'global_keyword', 'value'=>'zAdmin'],
			['key'=>'global_description', 'value'=>'zAdmin']
		]);
	}

}
