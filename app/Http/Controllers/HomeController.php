<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render(
            'Home',
            [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
            ]
        );
    }

    public function aboutWebhook()
    {
        return Inertia::render('AboutWebhook', ['ssr' => true]);
    }
}
