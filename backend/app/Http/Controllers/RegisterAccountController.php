<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RegisterAccountController extends Controller
{
    public function getUser()
    {
        $user = auth()->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 200);
    }

    public function register(Request $request, EmailVerificationService $emailVerificationService)
    {
        try {

            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/'],
                'username' => 'required|string|max:50',
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8',
            ]);

            $account = User::where('email', $validatedData['email'])->first();

            if ($account) {

                if ($account->verified) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Este correo ya está registrado y verificado',
                    ], 409);
                }

                $usernameExists = User::where('username', $validatedData['username'])
                    ->where('id', '!=', $account->id)
                    ->exists();

                if ($usernameExists) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Este nombre de usuario ya está en uso',
                    ], 409);
                }

                $account->name = $validatedData['name'];
                $account->username = $validatedData['username'];
                $account->password = bcrypt($validatedData['password']);
                $account->save();

                $emailVerificationService->refreshToken($account);

                return response()->json([
                    'success' => true,
                    'message' => 'Cuenta actualizada, se reenviará el token',
                ], 200);
            }

            $usernameExists = User::where('username', $validatedData['username'])->exists();

            if ($usernameExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este nombre de usuario ya está en uso',
                ], 409);
            }

            $account = User::create([
                'name' => $validatedData['name'],
                'username' => $validatedData['username'],
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
