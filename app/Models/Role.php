<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Bican\Roles\Traits\SlugableTrait;
use Config;

class Role extends Model {

    use SlugableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'slug', 'description', 'level'];

    /**
     * Role belongs to many permissions.
     *
     * @return mixed
     */
    public function permissions()
    {
        return $this->belongsToMany('Bican\Roles\Models\Permission')->withTimestamps();
    }

    /**
     * Role belongs to many users.
     *
     * @return mixed
     */
    public function users()
    {
        return $this->belongsToMany(Config::get('auth.model'))->withTimestamps();
    }

    /**
     * Attach permission.
     *
     * @param int|Permission $permission
     * @return mixed
     */
    public function attachPermission($permission)
    {
        if ( ! $this->permissions()->get()->contains($permission))
        {
            return $this->permissions()->attach($permission);
        }

        return true;
    }

    /**
     * Detach permission.
     *
     * @param int|Permission $permission
     * @return mixed
     */
    public function detachPermission($permission)
    {
        return $this->permissions()->detach($permission);
    }

    /**
     * Detach all permissions.
     *
     * @return int
     */
    public function detachAllPermissions()
    {
        return $this->permissions()->detach();
    }

    public function getAttr()
    {
        return [
            'name' =>[
                'type'  =>'text',
                'label' =>'标题'
            ],
            'slug'   =>[
                'type'  =>'text',
                'label' =>'Slug'
            ],
            'description'=>[
                'type'      =>'textarea',
                'label'     =>'描述',
                'nullable'  =>true
            ],
            'level'=>[
                'type'  =>'text',
                'label' =>'级别'
            ]
            
        ];
    }

}