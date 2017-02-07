<?php namespace App\Handlers\Events;

use App\Events\CacheEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

class CacheRouteHandler {

	/**
	 * Create the event handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param  CacheEvent  $event
	 * @return void
	 */
	public function handle(CacheEvent $event)
	{
		if(!Cache::get('routes') || !Cache::get('routes_simple')){
            $route_collection = Route::getRoutes();
            $routes = [];
            foreach ($route_collection as $route) {
                if($route->getName() && $route->getPrefix()){
                    $group = explode('@', $route->getActionName());
                    $routes[$route->getPrefix()][$group[0]][$route->getName()] = $route->getName();
                    $routes_simple[] = $route->getName();
                }
            }
            Cache::forever('routes', $routes);
            Cache::forever('routes_simple', $routes_simple);
        }
        $this->initRoutesFormat();
	}

}
