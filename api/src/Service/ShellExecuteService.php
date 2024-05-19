<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Process\Process;

final readonly class ShellExecuteService
{
    public function __construct(
        private KernelInterface $appKernel
    ) {
    }

    public function async(string $command, array $params = []): int|null
    {
        $process = Process::fromShellCommandline(
            sprintf('php bin/console %s "${:PARAMS}" &', $command),
        );

        $process->setWorkingDirectory($this->appKernel->getProjectDir());
        $process->disableOutput();
        $process->setTimeout(0);

        $process->start(env: ['PARAMS' => implode(' ', $params)]);

        return $process->getPid();
    }
}
