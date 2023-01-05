<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WebhookLogEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;
    public $channel;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($channelName, $data)
    {
        $this->data = $data;
        $this->channel = $channelName;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // return new PrivateChannel('channel-name');
        return new Channel($this->channel.'-webhook-log-event');
    }

    public function broadcastAs()
    {
        return 'webhookLogEvent';
    }

    public function broadcastWith()
    {
        return $this->data;
    }
}
