<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller {
    public function index() {
        return Inertia::render('Home', [
            'canLogin'    => route('login'),
            'canRegister' => route('register'),
            'phpVersion'  => PHP_VERSION,
        ]);
    }

}
