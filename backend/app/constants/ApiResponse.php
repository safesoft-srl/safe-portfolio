<?php

namespace App\Constants;

class ApiResponse
{
    public static function success($data = null, string $message = '', int $status = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $status);
    }

    public static function error(string $message = '', int $status = 400)
    {
        return response()->json([
            'success' => false,
            'data' => null,
            'message' => $message,
        ], $status);
    }
}
