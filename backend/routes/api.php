<?php

use App\Http\Controllers\AcademicController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RegisterAccountController;
use App\Http\Controllers\ResendTokenController;
use App\Http\Controllers\SkillProjectController;
use App\Http\Controllers\SoftSkillController;
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

Route::get('/technical-skills/actives', [TechnicalSkillController::class, 'activeSkills']);
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
Route::get('portfolios/projects/reports', [ProjectController::class, 'getReportProjects']);
Route::apiResource('/projects', ProjectController::class);
Route::delete('/projects/{id}/image', [ProjectController::class, 'deleteImageProject']);

// routes for skills
Route::apiResource('/skills', SkillProjectController::class);

Route::get('/portfolios/slug/{slug}/skills', [PortfolioTechnicalSkillController::class, 'publicBySlug']);
Route::get('/portfolios/slug/{slug}/soft-skills', [SoftSkillController::class, 'publicBySlug']);

Route::middleware('auth:api')->group(function () {
    Route::get('/academics', [AcademicController::class, 'index']);
    Route::post('/portfolios/{portfolioId}/academics', [AcademicController::class, 'store']);
    Route::get('/academics/{id}', [AcademicController::class, 'show']);
    Route::put('/academics/{id}', [AcademicController::class, 'update']);
    Route::delete('/academics/{id}', [AcademicController::class, 'destroy']);
    Route::get('/academics/portfolio/{portfolioId}', [AcademicController::class, 'getByPortfolio']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/portfolios/{portfolioId}/courses', [CourseController::class, 'store']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    Route::get('/courses/portfolio/{portfolioId}', [CourseController::class, 'getByPortfolioId']);
});

Route::get('/courses', [CourseController::class, 'index']);

use App\Http\Controllers\Admin\ModeratorController;

Route::middleware(['auth:api', 'admin'])->prefix('admin')->group(function () {
    Route::get('/moderators', [ModeratorController::class, 'index']);
    Route::post('/moderators', [ModeratorController::class, 'store']);
    Route::put('/moderators/{id}', [ModeratorController::class, 'update']);
    Route::delete('/moderators/{id}', [ModeratorController::class, 'destroy']);
});

// Apis for soft skills
use App\Http\Controllers\PortfolioSoftSkillController;

Route::get('/portfolios/slug/{slug}/soft-skills', [PortfolioSoftSkillController::class, 'publicBySlug']);

Route::get('/soft-skills', [SoftSkillController::class, 'index']);
Route::middleware('auth:api')->group(function () {

    Route::get('/portfolios/{portfolioId}/soft-skills', [PortfolioSoftSkillController::class, 'index']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills  (Para obtener las soft skills registradas en un portafolio)
    Route::post('/portfolios/{portfolioId}/soft-skills', [PortfolioSoftSkillController::class, 'store']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills  (Para agregar una soft skill a un portafolio) JSON(soft_skill_id, description)
    Route::put('/portfolios/{portfolioId}/soft-skills/{id}', [PortfolioSoftSkillController::class, 'update']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills/{id}  (Para actualizar el nombre de una soft skill en un portafolio) JSON(name)
    Route::delete('/portfolios/{portfolioId}/soft-skills/{id}', [PortfolioSoftSkillController::class, 'destroy']);
    // Api: http://localhost:8000/api/portfolios/{portfolioId}/soft-skills/{id}  (Para eliminar una soft skill de un portafolio)
});

use App\Http\Controllers\SoftSkillRequestController;

Route::middleware('auth:api')->group(function () {
    // USER APIS
    Route::get('/soft-skill-requests', [SoftSkillRequestController::class, 'index']);

    Route::post('/soft-skill-requests', [SoftSkillRequestController::class, 'store']);

    // MODERATOR APIS
    Route::get('/moderator/soft-skill-requests', [SoftSkillRequestController::class, 'moderatorIndex']);

    Route::post('/moderator/soft-skill-requests/approve', [SoftSkillRequestController::class, 'approveGroup']);

    Route::post('/moderator/soft-skill-requests/reject', [SoftSkillRequestController::class, 'rejectGroup']);

});

use App\Http\Controllers\SoftSkillCatalogController;

Route::middleware('auth:api')->group(function () {
    // MODERATOR SOFT SKILL CATALOG APIS

    Route::get('/moderator/soft-skills', [SoftSkillCatalogController::class, 'index']);
    // Api: http://localhost:8000/api/moderator/soft-skills  (Para obtener el catálogo de soft skills, con opción de filtrar por estado activo/inactivo) Query Param: is_active=true/false
    Route::post('/moderator/soft-skills', [SoftSkillCatalogController::class, 'store']);
    // Api: http://localhost:8000/api/moderator/soft-skills  (Para crear una nueva soft skill en el catálogo)
    Route::put('/moderator/soft-skills/{id}', [SoftSkillCatalogController::class, 'update']);
    // Api: http://localhost:8000/api/moderator/soft-skills/{id}  (Para actualizar el nombre o estado de una soft skill en el catálogo)
    Route::patch('/moderator/soft-skills/{id}/toggle-status', [SoftSkillCatalogController::class, 'toggleStatus']);
    // Api: http://localhost:8000/api/moderator/soft-skills/{id}/toggle-status  (Para activar o desactivar una soft skill en el catálogo)
});

use App\Http\Controllers\SoftSkillReportController;

Route::middleware('auth:api')->group(function () {

    // MODERATOR SOFT SKILL REPORT APIS
    Route::get('/moderator/reports/soft-skills', [SoftSkillReportController::class, 'index']);
    Route::get('/moderator/reports/soft-skill-requests', [SoftSkillReportController::class, 'requestReport']);
});

use App\Http\Controllers\Admin\WorkExperienceReportController;

Route::middleware(['auth:api', 'admin'])->group(function () {
    // MODERATOR WORK EXPERIENCE REPORT APIS
    Route::get('/moderator/reports/work-experiences', [WorkExperienceReportController::class, 'index']);
});

use App\Http\Controllers\TechnicalSkillReportController;

Route::middleware('auth:api')->group(function () {
    // MODERATOR TECHNICAL SKILL REPORT APIS
    Route::get('/moderator/reports/technical-skills', [TechnicalSkillReportController::class, 'index']);
});

use App\Http\Controllers\TechnicalSkillCatalogController;

Route::middleware('auth:api')->group(function () {

    // MODERATOR TECHNICAL SKILL CATALOG APIS
    // Api: http://localhost:8000/api/moderator/technical-skills/{id}/toggle-status
    Route::patch('/moderator/technical-skills/{id}/toggle-status', [TechnicalSkillCatalogController::class, 'toggleStatus']);

});
