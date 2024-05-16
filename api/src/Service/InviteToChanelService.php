<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Customer;
use Psr\Log\LoggerInterface;

class InviteToChanelService
{
    public function __construct(private LoggerInterface $logger)
    {
    }

    public function invite(Customer $customer): void
    {
        $this->logger->info('invite_to_chanel', [
            'user_id' => $customer->getId(),
        ]);

        // logic for invite to chanel
    }
}
