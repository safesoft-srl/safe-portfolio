<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Requests\StorePortfolioRequest;
use App\Services\PortfolioService;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function __construct(
        private PortfolioService $portfolioService
    ){}

    public function store(StorePortfolioRequest $request) {
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
}
