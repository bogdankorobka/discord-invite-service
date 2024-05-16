<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Customer;
use App\Service\InviteToChanelService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final readonly class CustomerPostProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: PersistProcessor::class)]
        private ProcessorInterface $persistProcessor,
        private InviteToChanelService $inviteToChanelService,
    ) {
    }

    /**
     * @param Customer $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Customer
    {
        $customer = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        $this->inviteToChanelService->invite($customer);

        return $customer;
    }
}
