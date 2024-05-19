<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\BotLaunchController;
use App\Controller\SubscriptionDeleteController;
use App\Controller\SubscriptionPostController;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Post(
            uriTemplate: '/bots/{guid}/subscription',
            status: 204,
            controller: SubscriptionPostController::class,
            description: 'Connects the client to paid content on the server',
            input: false,
            output: false,
            name: 'add_subscription',
        ),
        new Delete(
            uriTemplate: '/bots/{guid}/subscription',
            status: 204,
            controller: SubscriptionDeleteController::class,
            description: 'Disconnects the client from paid content on the server',
            input: false,
            output: false,
            name: 'remove_subscription',
        ),
        new Post(
            uriTemplate: '/bots/{guid}/launch',
            status: 204,
            controller: BotLaunchController::class,
            description: 'Launch the bot',
            input: false,
            output: false,
            name: 'launch',
        ),
    ]
)]
class Bot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(type: Types::GUID, unique: true)]
    #[ApiProperty(identifier: true)]
    private ?string $guid = null;

    #[ORM\Column(type: Types::GUID)]
    public string $merchant_guid;

    #[ORM\Column(length: 255)]
    public string $token;

    #[ORM\Column]
    private DateTimeImmutable $created_at;

    #[ORM\Column]
    private DateTimeImmutable $updated_at;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGuid(): ?string
    {
        return $this->guid;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->created_at;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updated_at;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->guid = Uuid::uuid4()->toString();
        $this->created_at = new DateTimeImmutable();
        $this->setUpdatedAtValue();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updated_at = new DateTimeImmutable();
    }
}
