<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Requests\StorePortfolioRequest;
use App\Services\PortfolioService;

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

    public function show(int $id)
    {
        $portfolio = $this->portfolioService->getById($id);

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function update(int $id, StorePortfolioRequest $request)
    {
        $portfolio = $this->portfolioService->update($id, $request->validated());

        return ApiResponse::success(
            $portfolio,
            ResponseMessages::UPDATED_SUCCESSFULLY
        );
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
