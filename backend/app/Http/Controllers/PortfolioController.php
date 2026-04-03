<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Services\PortfolioService;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Throwable;

class PortfolioController extends Controller
{
    public function __construct(
        private PortfolioService $portfolioService
    ) {}

    public function store(StorePortfolioRequest $request)
    {
        $portfolio = $this->portfolioService->create($request->validated());

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::CREATED_SUCCESSFULLY,
            201
        );
    }

    public function index()
    {
        $portfolios = $this->portfolioService->getAll();

        return ApiResponse::success(
            $portfolios,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function getMyPortfolio()
    {
        $userId = auth()->id();
        $portfolio = $this->portfolioService->getByUserId($userId);

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

    public function updateMyPortfolio(UpdatePortfolioRequest $request)
    {
        $userId = auth()->id();
        try {
            $portfolio = $this->portfolioService->update(
                $userId,
                $request->validated()
            );

            return ApiResponse::success(
                $portfolio,
                ResponseMessages::UPDATED_SUCCESSFULLY
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error(
                ResponseMessages::RESOURCE_NOT_FOUND,
                null,
                404
            );
        } catch (Throwable $e) {
            Log::error('Portfolio update failed', [
                'portfolio_id' => $id,
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                ResponseMessages::INTERNAL_SERVER_ERROR,
                null,
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
}
