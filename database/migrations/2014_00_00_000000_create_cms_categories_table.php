<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCmsCategoriesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cms_categories', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('pid');
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('thumb');
            $table->string('description');
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
        Schema::drop('cms_categories');
    }

}
