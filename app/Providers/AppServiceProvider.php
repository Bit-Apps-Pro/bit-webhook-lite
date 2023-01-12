<?php

namespace App\Providers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Inertia::share(
            [
                'app' => [
                    'name' => config('app.name'),
                    'APP_URL' => config('app.url'),
                ],
            ]
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Storage::disk('tmp')
            ->buildTemporaryUrlsUsing(
                function ($path, $expiration, $options) {
                    return URL::temporarySignedRoute(
                        'tmp',
                        $expiration,
                        array_merge($options, ['path' => $path])
                    );
                }
            );
    }
}
