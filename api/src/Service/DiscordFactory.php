<?php

declare(strict_types=1);

namespace App\Service;

use Discord\DiscordCommandClient;
use Discord\Http\Drivers\React;
use Discord\Http\Http;
use Discord\WebSockets\Intents;
use Exception;
use Psr\Log\LoggerInterface;
use React\EventLoop\Loop;
use React\EventLoop\LoopInterface;

final class DiscordFactory
{
    /** @var DiscordCommandClient[] */
    private static array $botInstances = [];

    /** @var Http[] */
    private static array $httpInstances = [];

    /** @throws Exception */
    public static function bot(string $token, LoggerInterface $logger): DiscordCommandClient
    {
        if ($instance = self::$botInstances[$token] ?? null) {
            return $instance;
        }

        $discord = new DiscordCommandClient([
            'token' => $token,
            'prefix' => '$',
            'name' => 'Subscription manager',
            'description' => 'Manage channels and role',
            'defaultHelpCommand' => true,
            'discordOptions' => [
                'intents' => Intents::getAllIntents(),
                'loadAllMembers' => true,
                'logger' => $logger,
            ]
        ]);

        self::$botInstances[$token] = $discord;

        return self::$botInstances[$token];
    }

    public function http(string $token, LoggerInterface $logger): Http
    {
        if ($instance = self::$httpInstances[$token] ?? null) {
            return $instance;
        }

        /** @var LoopInterface $loop */
        $loop = Loop::get();
        $driver = new React($loop);

        $http = new Http("Bot $token", $loop, $logger, $driver);

        self::$httpInstances[$token] = $http;

        return self::$httpInstances[$token];
    }
}
