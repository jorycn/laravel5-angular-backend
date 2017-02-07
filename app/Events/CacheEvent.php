<?php namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;

class CacheEvent extends Event {

	use SerializesModels;
}
