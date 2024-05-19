<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Bot;
use App\Service\DiscordFactory;
use Discord\Http\Endpoint;
use Psr\Log\LoggerInterface;
use React\EventLoop\Loop;
use stdClass;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Throwable;

use function React\Async\await;

#[AsController]
final class SubscriptionDeleteController extends AbstractController
{
    public function __construct(
        private readonly DiscordFactory $discordFactory,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * @throws Throwable
     */
    public function __invoke(Bot $bot): void
    {
        $http = $this->discordFactory->http($bot->token, $this->logger);
        $endpoint = Endpoint::bind(Endpoint::CHANNEL_MESSAGES, '1241270475972415551');
        $message = ['content' => '$userrole_rm 508334030266302469 1241270765710610472'];

        $response = new stdClass();
        await(
            $http->post($endpoint, $message)
                ->then(
                    fn($r) => $response->content = $r,
                    fn(Throwable $e) => $response->content = $e,
                )
        );

        Loop::run();

        $this->logger->info('discord_send_http_request', [
            'endpoint' => $endpoint->toAbsoluteEndpoint(),
            'message' => $message,
            'response' => $response,
        ]);

        if ($response instanceof Throwable) {
            throw $response;
        }
    }
}
