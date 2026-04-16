<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Models\PortfolioSkill;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use App\Models\Portfolio;
use Throwable;

class PortfolioTechnicalSkillController extends Controller
{

    public function store(Request $request, int $portfolioId){

            Portfolio::where('id', $portfolioId)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $validated = $request->validate([
            'technical_skill_id' => 'required|exists:technical_skills,id',
            'level' => 'required|string|max:50',
        ]);

        try {

            $exists = PortfolioSkill::where('portfolio_id', $portfolioId)
            ->where('technical_skill_id', $validated['technical_skill_id'])
            ->exists();

            if ($exists) {
            return ApiResponse::error(
                    'Esta skill ya está registrada en este portafolio',
                    409,
                    null
                );
            }


            $skill = PortfolioSkill::create([
                'portfolio_id' => $portfolioId,
                'technical_skill_id' => $validated['technical_skill_id'],
                'level' => $validated['level'],
            ]);

            return ApiResponse::success(
                $skill,
                ResponseMessages::CREATED_SUCCESSFULLY,
                201
            );
        } catch (Throwable $e) {
            Log::error('Error creating portfolio technical skill', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                ResponseMessages::INTERNAL_SERVER_ERROR,
                500,
                null
            );
        }
    }






        public function update(Request $request, int $portfolioId)
        {
            Portfolio::where('id', $portfolioId)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $validated = $request->validate([
                'technical_skill_id' => 'required|exists:technical_skills,id',
                'level' => 'required|string|max:50',
            ]);

            try {
                $portfolioSkill = PortfolioSkill::where('portfolio_id', $portfolioId)
                    ->where('technical_skill_id', $validated['technical_skill_id'])
                    ->firstOrFail();

                $portfolioSkill->update([
                    'level' => $validated['level']
                ]);

                return ApiResponse::success(
                    $portfolioSkill,
                    ResponseMessages::UPDATED_SUCCESSFULLY
                );

            } catch (ModelNotFoundException $e) {
                return ApiResponse::error(
                    ResponseMessages::RESOURCE_NOT_FOUND,
                    404,
                    null
                );
            } catch (Throwable $e) {
                Log::error('Error updating portfolio technical skill', [
                    'error_message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return ApiResponse::error(
                    ResponseMessages::INTERNAL_SERVER_ERROR,
                    500,
                    null
                );
            }
        }



   public function destroy(Request $request, int $portfolioId)
    {
                Portfolio::where('id', $portfolioId)
                            ->where('user_id', auth()->id())
                            ->firstOrFail();

        $validated = $request->validate([
            'technical_skill_id' => 'required|exists:technical_skills,id',
        ]);

        try {
            $portfolioSkill = PortfolioSkill::where('portfolio_id', $portfolioId)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->firstOrFail();

            $portfolioSkill->delete();

            return ApiResponse::success(
                null,
                ResponseMessages::DELETED_SUCCESSFULLY
            );

        } catch (ModelNotFoundException $e) {
            return ApiResponse::error(
                ResponseMessages::RESOURCE_NOT_FOUND,
                null,
                404
            );
        } catch (Throwable $e) {
            Log::error('Error deleting portfolio technical skill', [
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
}
