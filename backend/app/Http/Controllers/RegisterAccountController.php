<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RegisterAccountController extends Controller
{
    public function register(Request $request, EmailVerificationService $emailVerificationService)
    {
        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:6',
            ]);

            $account = User::where('email', $validatedData['email'])->first();

            if ($account) {

                if ($account->verified) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Este correo ya está registrado y verificado',
                    ], 409);
                }

                $account->name = $validatedData['name'];
                $account->password = bcrypt($validatedData['password']);
                $account->save();

                $emailVerificationService->refreshToken($account);

                return response()->json([
                    'success' => true,
                    'message' => 'Cuenta actualizada, se reenviará el token',
                ], 200);
            }

            $account = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password']),
                'verified' => false,
            ]);

            $emailVerificationService->GenerateToken($account);

            return response()->json([
                'success' => true,
                'message' => 'Cuenta registrada correctamente',
            ], 201);

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
