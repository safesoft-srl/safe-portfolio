<?php

use App\Http\Controllers\AcademicController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RegisterAccountController;
use App\Http\Controllers\ResendTokenController;
use App\Http\Controllers\SkillProjectController;
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
    Route::get('/me/portfolios', [PortfolioController::class, 'index']);
    Route::get('/me/portfolio/{id}', [PortfolioController::class, 'getPortfolio']);
    Route::get('/me/portfolio', [PortfolioController::class, 'getMyPortfolio']);
    Route::post('/me/portfolio', [PortfolioController::class, 'store']);
    Route::put('/me/portfolio', [PortfolioController::class, 'updateMyPortfolio']);
    // url: /portfolios/${portfolioId}/work-experiences
    Route::apiResource('/me/portfolios.work-experiences', WorkExperienceController::class)->except(['create', 'edit', 'show']);
    Route::delete('/me/portfolio/{id}/photo', [PortfolioController::class, 'deletePhoto']);
    Route::get('/me/portfolio/check-slug/{slug}', [PortfolioController::class, 'checkSlug']);
    Route::post('/me/portfolio/publish/{idPortfolio}', [PortfolioController::class, 'getSlug']);
    Route::post('/me/portfolio/save-url/{id}', [PortfolioController::class, 'saveUrlPortfolio']);
});

Route::get('/portfolios/work-experiences', [WorkExperienceController::class, 'showAll']);

Route::get('/portfolios/slug/{slug}', [PortfolioController::class, 'publicPortfolio']);
Route::get('/portfolios/slug/{slug}/work-experiences', [WorkExperienceController::class, 'publicBySlug']);

Route::get('/portfolios', [PortfolioController::class, 'showAll']);

// Apis para manejar las skills de un portafolio
use App\Http\Controllers\PortfolioTechnicalSkillController;
use App\Http\Controllers\TechnicalSkillController;

Route::apiResource('/technical-skills', TechnicalSkillController::class);

Route::middleware('auth:api')->group(function () {

    Route::post('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'store']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para agregar una skill a un portafolio) JSON(technical_skill_id, level)
    Route::put('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'update']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para actualizar el nivel de una skill en un portafolio) JSON(technical_skill_id, level)
    Route::delete('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'destroy']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para eliminar una skill de un portafolio) JSON(technical_skill_id)
    Route::get('/portfolios/{portfolioId}/technical-skills', [PortfolioTechnicalSkillController::class, 'index']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/technical-skills  (Para obtener las skills registradas en un portafolio)

});

// routes for projects
Route::get('portfolios/{portfolioId}/projects', [ProjectController::class, 'getByPortfolio']);
Route::apiResource('/projects', ProjectController::class);
Route::delete('/projects/{id}/image', [ProjectController::class, 'deleteImageProject']);

// routes for skills
Route::apiResource('/skills', SkillProjectController::class);

// Apis for soft skills
use App\Http\Controllers\SoftSkillController;

Route::middleware('auth:api')->group(function () {

    Route::get('/portfolios/{portfolioId}/soft-skills', [SoftSkillController::class, 'index']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills  (Para obtener las soft skills registradas en un portafolio)
    Route::post('/portfolios/{portfolioId}/soft-skills', [SoftSkillController::class, 'store']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills  (Para agregar una soft skill a un portafolio) JSON(name)
    Route::put('/portfolios/{portfolioId}/soft-skills/{id}', [SoftSkillController::class, 'update']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills/{id}  (Para actualizar el nombre de una soft skill en un portafolio) JSON(name)
    Route::delete('/portfolios/{portfolioId}/soft-skills/{id}', [SoftSkillController::class, 'destroy']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills/{id}  (Para eliminar una soft skill de un portafolio)

});

Route::middleware('auth:api')->group(function () {
    Route::get('/academics', [AcademicController::class, 'index']);
    Route::post('/portfolios/{portfolioId}/academics', [AcademicController::class, 'store']);
    Route::get('/academics/{id}', [AcademicController::class, 'show']);
    Route::put('/academics/{id}', [AcademicController::class, 'update']);
    Route::delete('/academics/{id}', [AcademicController::class, 'destroy']);
    Route::get('/academics/portfolio/{portfolioId}', [AcademicController::class, 'getByPortfolio']);
});
