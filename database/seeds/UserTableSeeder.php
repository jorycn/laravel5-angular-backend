<?php
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert(array(
            'username'      => 'admin',
            'email'     => 'admin@admin.com',
            'password'  => bcrypt('123456'),
            'created_at'  => new Datetime,
            'updated_at'  => new Datetime
        ));

        DB::table('roles')->insert([
            ['name'=>'Admin', 'slug'=>'admin','level'=>1,'created_at'=>new Datetime, 'updated_at'=>new Datetime],
            ['name'=>'Guest', 'slug'=>'guest','level'=>1,'created_at'=>new Datetime, 'updated_at'=>new Datetime]
        ]);

        $user = User::find(1)->attachRole(1);
    }

}
