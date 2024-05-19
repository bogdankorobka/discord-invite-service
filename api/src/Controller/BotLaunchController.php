<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Bot;
use App\Service\ShellExecuteService;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
final readonly class BotLaunchController
{
    public function __construct(
        private ShellExecuteService $executeService,
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(Bot $bot): void
    {
        $pid = $this->executeService->async('bot:launch', ['token' => $bot->token]);

        $this->logger->info('bot_is_running', [
            'bot_id' => $bot->getId(),
            'pid' => $pid,
        ]);
    }
}
