<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TempFileController;
use App\Http\Controllers\UrlSlugGenerateController;
use App\Http\Controllers\WebHookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::get('/difference-between-webhook-and-api', [HomeController::class, 'aboutWebhook'])->name('about.webhook');

Route::get('/create/url', [UrlSlugGenerateController::class, 'createNewRandomURl'])->name('create-url');

Route::get('/outgoing', [WebHookController::class, 'outgoingView'])->name('outgoing.view');

Route::get('/url/refresh', [UrlSlugGenerateController::class, 'refreshUrl'])->name('refresh-url');

Route::get('/tmp/{path}', [TempFileController::class, 'handleDownload'])->name('tmp');
