<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;

class Selfvalidator extends Model {
    /**
     * Error message bag
     *
     * @var Illuminate\Support\MessageBag
     */
    protected $errors;

    /**
     * Validation rules
     *
     * @var Array
     */
    protected static $rules = array();

    /**
     * Custom messages
     *
     * @var Array
     */
    protected static $messages = array();

    /**
     * Validator instance
     *
     * @var Illuminate\Validation\Validators
     */
    protected $validator;

    public function __construct(array $attributes = array(), Validator $validator = null)
    {
        parent::__construct($attributes);
        $this->validator = $validator ?: \App::make('validator');
    }

    /**
     * Listen for save event
     */
    protected static function boot()
    {
        parent::boot();
        static::saving(function($model)
        {
            return $model->validate();
        });
    }

    /**
     * Validates current attributes against rules
     */
    public function validate()
    {
        if(static::$rules){
            $v = $this->validator->make($this->attributes, static::$rules, static::$messages);
            if ($v->passes())
            {
                return true;
            }
            $this->setErrors($v->messages());
            return false;
        }else{
            return true;
        }
    }

    /**
     * Set error message bag
     *
     * @var Illuminate\Support\MessageBag
     */

    protected function setErrors($errors)
    {
        $this->errors = $errors;
    }

    /**
     * Retrieve error message bag
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Inverse of wasSaved
     */
    public function hasErrors()
    {
        return ! empty($this->errors);
    }

    public function getList($model, $filter=[],$fields=[], $order=[], $skip=0, $limit='', $with='', $with_filter=[],$ispage=0)
    { 
        $model = new $model;
        if($with){
            if(is_array($with_filter) && !empty($with_filter)){
                if($ispage){
                    $data = $model->select($fields)->where(function($query) use($filter){        
                        foreach ($filter as $v) {
                            $query->where($v[0], $v[1], $v[2]);        
                        }          
                    })->with(array($with => function($query) use($with_filter){
                        foreach ($with_filter as $key=>$val){
                            $query->$key($val);        
                        }
                    }))->orderByRaw($order)->paginate($ispage)->toArray();
                }else{
                    $data = $model->select($fields)->where(function($query) use($filter){        
                        foreach ($filter as $v) {
                            $query->where($v[0], $v[1], $v[2]);        
                        }          
                    })->skip($skip)->take($limit)->with(array($with => function($query) use($with_filter){
                        foreach ($with_filter as $key=>$val){
                            $query->$key($val);        
                        }
                    }))->orderByRaw($order)->get()->toArray();
                }
            }else{
                if($ispage){
                    $data = $model->select($fields)->where(function($query) use($filter){        
                        foreach ($filter as $v) {
                            $query->where($v[0], $v[1], $v[2]);        
                        }              
                    })->skip($skip)->with($with)->orderByRaw($order)->paginate($ispage)->toArray();
                }else{
                    $data = $model->select($fields)->where(function($query) use($filter){        
                        foreach ($filter as $v) {
                            $query->where($v[0], $v[1], $v[2]);        
                        }              
                    })->take($limit)->with($with)->orderByRaw($order)->get()->toArray(); 
                }
                
            }       
        }else{
            if($ispage){
                $data = $model->select($fields)->where(function($query) use($filter){        
                    foreach ($filter as $v) {
                        $query->where($v[0], $v[1], $v[2]);        
                    }             
                })->orderByRaw($order)->paginate($ispage)->toArray();
            }else{
                $data = $model->select($fields)->where(function($query) use($filter){        
                    foreach ($filter as $v) {
                        $query->where($v[0], $v[1], $v[2]);        
                    }             
                })->take($limit)->orderByRaw($order)->get()->toArray();
            } 
        }
        return $data;
    }
}