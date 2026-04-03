<?php

use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\RegisterAccountController;
use App\Http\Controllers\ResendTokenController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterAccountController::class, 'register']);
// Api   http://localhost:8000/api/register   (Para registrar nuevos usuarios)  JSON(name,email,password)
Route::post('/verify-email', [EmailVerificationController::class, 'verifyEmail']);
// Api  http://localhost:8000/api/verify-email   (Para  Verificar el correo de un usuario nuevo registrandose) JSON(email,token)
Route::post('/resend-token', [ResendTokenController::class, 'resend']);
// Api: http://localhost:8000/api/resend-token   (Para reenviar el token de verificación)  JSON(email)
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\AuthController;



Route::group([
    'middleware' => 'api',
    'prefix' => 'auth',
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);

    // Protected JWT routes
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

/*Route::get(
    'users/{userId}/portfolio',
    [PortfolioController::class, 'getByUserId']
);

Route::apiResource('portfolios', PortfolioController::class);
*/

Route::middleware('auth:api')->group(function () {
    Route::get('/me/portfolio', [PortfolioController::class, 'getMyPortfolio']);
    Route::put('/me/portfolio', [PortfolioController::class, 'updateMyPortfolio']);
});

Route::apiResource('/portfolios', PortfolioController::class);
