<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\DiscordFactory;
use Discord\DiscordCommandClient;
use Discord\Parts\Channel\Message;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Throwable;

use function React\Async\await;

#[AsCommand(
    name: 'bot:launch',
    description: 'Launch bot',
)]
final class BotLaunchCommand extends Command
{
    public function __construct(
        private readonly LoggerInterface $logger,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('token', InputArgument::REQUIRED, 'Token for bot initialization')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $token = (string)$input->getArgument('token');

        $io->note(sprintf('The token for the bot has been transferred: `%s`', $token));

        try {
            $discord = DiscordFactory::bot($token, $this->logger);
        } catch (Throwable $exception) {
            $io->error($exception->getMessage());

            return self::FAILURE;
        }

        $discord->on('ready', function (DiscordCommandClient $discord) use ($io) {
            $io->info(sprintf('Bot `%s` is running!', $discord->username));

            // Ping
            $discord->registerCommand('ping', 'pong!', [
                'description' => 'Check available bot',
            ]);

            // Users role ADD
            $discord->registerCommand('userrole_add', function (Message $message, array $args) {
                [$userId, $roleId] = $args;

                $guild = $message->channel?->guild;
                if (!$guild) {
                    return 'Server not found. Send a message to the guild channel!';
                }

                $member = $guild->members->get('id', $userId);
                if (!$member) {
                    return 'User not found on server.';
                }

                $role = $guild->roles->get('id', $roleId);
                if (!$role) {
                    return 'Role not found on server.';
                }

                $msg = '';

                await($member->addRole($role)->then(
                    function () use (&$msg, $role, $member) {
                        $msg = sprintf(
                            'A role `%s` has been added to user `%s`',
                            $role->name,
                            $member->username
                        );
                    },
                    function (Throwable $e) use (&$msg, $role, $member) {
                        $msg = sprintf(
                            'An error has occurred: `%s` A role `%s` has not been added to user `%s`',
                            $e->getMessage(),
                            $role->name,
                            $member->username
                        );
                    },
                ));

                return $msg;
            }, [
                'description' => 'Add role to user',
                'usage' => '$userrole_add <user_id> <role_id>',
            ]);

            // Users role REMOVE
            $discord->registerCommand('userrole_rm', function (Message $message, array $args) {
                [$userId, $roleId] = $args;

                $guild = $message->channel?->guild;
                if (!$guild) {
                    return 'Server not found. Send a message to the guild channel!';
                }

                $member = $guild->members->get('id', $userId);
                if (!$member) {
                    return 'User not found on server.';
                }

                $role = $guild->roles->get('id', $roleId);
                if (!$role) {
                    return 'Role not found on server.';
                }

                $msg = '';

                await($member->removeRole($role)->then(
                    function () use (&$msg, $role, $member) {
                        $msg = sprintf(
                            'A role `%s` has been removed to user `%s`',
                            $role->name,
                            $member->username
                        );
                    },
                    function (Throwable $e) use (&$msg, $role, $member) {
                        $msg = sprintf(
                            'An error has occurred: `%s` A role `%s` has not removed added to user `%s`',
                            $e->getMessage(),
                            $role->name,
                            $member->username
                        );
                    },
                ));

                return $msg;
            }, [
                'description' => 'Remove role from user',
                'usage' => '$userrole_rm <user_id> <role_id>',
            ]);
        });

        $discord->run();

        $io->success('Done');

        return self::SUCCESS;
    }
}
