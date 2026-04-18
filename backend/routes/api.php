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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PortfolioController;

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

use App\Http\Controllers\WorkExperienceController;

Route::middleware('auth:api')->group(function () {
    Route::get('/me/portfolio', [PortfolioController::class, 'getMyPortfolio']);
    Route::put('/me/portfolio', [PortfolioController::class, 'updateMyPortfolio']);
    Route::apiResource('/me/work-experiences', WorkExperienceController::class)->except(['create', 'edit', 'show']);
    Route::delete('/me/portfolio/{id}/photo', [PortfolioController::class, 'deletePhoto']);
    Route::get('/me/portfolio/check-slug/{slug}', [PortfolioController::class, 'checkSlug']);
    Route::post('/me/portfolio/publish', [PortfolioController::class, 'getSlug']);
    Route::post('/me/portfolio/save-url/{id}', [PortfolioController::class, 'saveUrlPortfolio']);
});

Route::apiResource('/portfolios', PortfolioController::class);

Route::get('/portfolios/slug/{slug}', [PortfolioController::class, 'publicPortfolio']);

// Apis para manejar las skills de un portafolio
use App\Http\Controllers\PortfolioTechnicalSkillController;
use App\Http\Controllers\TechnicalSkillController;

Route::get('/technical-skills', [TechnicalSkillController::class, 'index']);
// Api: http://localhost:8000/api/technical-skills  (Para obtener el listado de skills disponibles)
Route::post('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'store']);
// Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para agregar una skill a un portafolio) JSON(technical_skill_id, level)
Route::put('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'update']);
// Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para actualizar el nivel de una skill en un portafolio) JSON(technical_skill_id, level)
Route::delete('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'destroy']);
// Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para eliminar una skill de un portafolio) JSON(technical_skill_id)
Route::get('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'index']);
// Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para obtener las skills registradas en un portafolio)
