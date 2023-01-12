<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use FilesystemIterator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class RemoveTempFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:remove-temp
                            {--o|older-than=10 : How many hour older file should be removed.}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove temporary files';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tmpFiles = new FilesystemIterator(
            Storage::disk('tmp')->path(''),
            FilesystemIterator::SKIP_DOTS
        );
        foreach ($tmpFiles as $file) {
            if (now()->diffInMinutes(new Carbon($file->getMTime())) > ($this->option('older-than') * 60)) {
                if ($file->isDir()) {
                    rmdir($file->getRealPath());
                } else {
                    unlink($file->getRealPath());
                }
            }
        }
        return Command::SUCCESS;
    }
}
