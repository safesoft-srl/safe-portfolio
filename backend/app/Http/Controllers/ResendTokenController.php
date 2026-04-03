<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ResendTokenController extends Controller
{
    protected $emailVerificationService;

    public function __construct(EmailVerificationService $emailVerificationService)
    {
        $this->emailVerificationService = $emailVerificationService;
    }

    public function resend(Request $request)
    {
        try {

            $request->validate([
                'email' => 'required|string|email|max:255',
            ]);

            $account = User::where('email', $request->email)->first();

            if (! $account) {
                return response()->json([
                    'success' => false,
                    'message' => 'Correo no registrado',
                ], 404);
            }

            if ($account->verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'La cuenta ya está verificada',
                ], 400);
            }

            $this->emailVerificationService->refreshToken($account);

            return response()->json([
                'success' => true,
                'message' => 'Token reenviado al correo',
            ], 200);

        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
