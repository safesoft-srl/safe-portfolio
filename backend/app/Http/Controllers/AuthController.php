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
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return $this->errorResponse('Invalid credentials', 401);
            }
        } catch (JWTException $e) {
            return $this->errorResponse('Could not create authentication token', 500);
        }

        return $this->respondWithToken($token, 'Login successful');
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        // auth('api')->user() returns the logged-in user 
        // using the bearer token sent in the headers.
        return $this->successResponse(auth('api')->user(), 'User profile retrieved successfully');
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        // This will blacklist the token so it can't be used again
        auth('api')->logout();

        return $this->successResponse([], 'Successfully logged out');
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        // Gives a brand new token and invalidates the old one
        return $this->respondWithToken(auth('api')->refresh(), 'Token refreshed successfully');
    }

    /**
     * Get the token array structure.
     * We extracted this logic into a helper function to keep the code DRY.
     *
     * @param  string $token
     * @param  string $message
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $message)
    {
        $data = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ];

        return $this->successResponse($data, $message);
    }
}
