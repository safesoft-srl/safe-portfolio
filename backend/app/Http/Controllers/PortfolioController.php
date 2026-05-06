<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Services\PortfolioService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PortfolioController extends Controller
{
    public function __construct(
        private PortfolioService $portfolioService
    ) {}

    public function showAll() {
        $portfolios = $this->portfolioService->showAll();

        return ApiResponse::success(
            $portfolios,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function store(StorePortfolioRequest $request)
    {
        $user = auth()->user();
        
        $portfolio = $this->portfolioService->create(
            $request->validated(),
            $user
        );

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::CREATED_SUCCESSFULLY,
            201
        );
    }

    public function index()
    {
        $userId = auth()->id();
        if ($userId === null) {
            return ApiResponse::error(
                ResponseMessages::UNAUTHORIZED,
                401
            );
        }

        $portfolios = $this->portfolioService->getAll($userId);

        return ApiResponse::success(
            $portfolios,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function getMyPortfolio()
    {
        $userId = auth()->id();
        if ($userId === null) {
            return ApiResponse::error(
                ResponseMessages::UNAUTHORIZED,
                401
            );
        }
        $portfolio = $this->portfolioService->getByUserId($userId);

        if ($portfolio === null) {
            return ApiResponse::success(
                null,
                ResponseMessages::FETCHED_SUCCESSFULLY
            );
        }

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function show(int $id)
    {
        $portfolio = $this->portfolioService->getById($id);

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function getPortfolio(int $id) 
    {
        $portfolio = $this->portfolioService->getPortfolio($id);

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function updateMyPortfolio(UpdatePortfolioRequest $request)
    {
        try {
            $portfolio = $this->portfolioService->update(
                $request->id_portfolio,
                $request->validated()
            );

            return ApiResponse::success(
                $portfolio,
                ResponseMessages::UPDATED_SUCCESSFULLY
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error(
                "No existe un portafolio con el ID: " . $request->id_portfolio,
                404
            );
        } catch (Throwable $e) {
            Log::error('Portfolio update failed', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                ResponseMessages::INTERNAL_SERVER_ERROR,
                500
            );
        }
    }

    public function destroy(int $id)
    {
        $this->portfolioService->delete($id);

        return ApiResponse::success(
            null,
            ResponseMessages::DELETED_SUCCESSFULLY
        );
    }

    public function deletePhoto(int $id)
    {
        $portfolio = $this->portfolioService->deletePhoto($id);

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::DELETED_SUCCESSFULLY
        );
    }

    public function checkSlug(string $slug)
    {
        $exists = $this->portfolioService->slugExists($slug);

        return ApiResponse::success(
            ['available' => ! $exists],
            'el nombre esta disponible'
        );
    }

    public function getSlug(Request $request)
    {
        $validateData = $request->validate([
            'slug' => 'required|string',
        ]);

        $userId = auth()->id();

        if (! $userId) {
            error_log('User ID: ' . $userId);
        }

        $portfolio = $this->portfolioService->getByUserId($userId);

        $portfolio->update([
            'is_public' => true,
            'portfolio_slug' => $validateData['slug'],
        ]);

        return ApiResponse::success([
            'slug' => $portfolio->portfolio_slug,
        ], 'Portafolio publicado exitosamente');
    }

    public function publicPortfolio(string $slug)
    {
        try {
            $portfolio = $this->portfolioService->getBySlug($slug);

            return ApiResponse::success(
                $portfolio,
                'Portafolio público recuperado exitosamente',
                200
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error(
                'No existe un portafolio publico con: ' . $slug,
                404
            );
        }
    }

    public function saveUrlPortfolio(Request $request, int $id)
    {
        $validateData = $request->validate([
            'url' => 'required|url',
        ]);

        $portfolio = $this->portfolioService->saveUrlPortfolio(
            $validateData['url'],
            $id
        );

        return ApiResponse::success(
            $portfolio,
            'URL del portafolio guardada exitosamente'
        );
    }
}
