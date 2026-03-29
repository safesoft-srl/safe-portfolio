<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Authenticate user and return a JWT.
     *
     * @param LoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        // 1. Tomamos solo email y password que ya pasaron por el request de validación
        $credentials = $request->only('email', 'password');

        try {
            // 2. Intentamos iniciar sesión. Si falla, botamos error con nuestro Trait (ApiResponse)
            if (! $token = JWTAuth::attempt($credentials)) {
                return $this->errorResponse('Credenciales inválidas', 401);
            }
        } catch (JWTException $e) {
            // Error raro en el servidor con JWT
            return $this->errorResponse('No se pudo crear el token de autenticación', 500);
        }

        // 3. Todo salió bien, armamos la información que necesita el frontend (Dylan)
        $data = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ];

        // Usamos nuestro Trait para responder con el estándar del equipo
        return $this->successResponse($data, 'Login exitoso');
    }
}
