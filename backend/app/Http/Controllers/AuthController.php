<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Authenticate user and return a JWT.
     *
     * @return JsonResponse
     */
    public function login(LoginRequest $request)
    {
        // El frontend envía todo en el campo 'email', pero internamente evaluamos si es usuario o correo
        $loginValue = $request->input('email');
        $password = $request->input('password');

        $fieldType = filter_var($loginValue, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $fieldType => $loginValue,
            'password' => $password,
            'verified' => true
        ];

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return $this->errorResponse('Credenciales incorrectas.', 401);
            }
        } catch (JWTException $e) {
            return $this->errorResponse('No se pudo crear el token de autenticación.', 500);
        }

        return $this->respondWithToken($token, 'Inicio de sesión exitoso.');
    }

    /**
     * Get the authenticated User.
     *
     * @return JsonResponse
     */
    public function me()
    {
        // auth('api')->user() returns the logged-in user
        // using the bearer token sent in the headers.
        return $this->successResponse(auth('api')->user(), 'Perfil de usuario recuperado exitosamente.');
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return JsonResponse
     */
    public function logout()
    {
        // This will blacklist the token so it can't be used again
        auth('api')->logout();

        return $this->successResponse([], 'Sesión cerrada exitosamente.');
    }

    /**
     * Refresh a token.
     *
     * @return JsonResponse
     */
    public function refresh()
    {
        // Gives a brand new token and invalidates the old one
        return $this->respondWithToken(auth('api')->refresh(), 'Token actualizado correctamente.');
    }

    /**
     * Get the token array structure.
     * We extracted this logic into a helper function to keep the code DRY.
     *
     * @param  string  $token
     * @param  string  $message
     * @return JsonResponse
     */
    protected function respondWithToken($token, $message)
    {
        $data = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
        ];

        return $this->successResponse($data, $message);
    }
}
