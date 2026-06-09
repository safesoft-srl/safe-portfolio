<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions)
    {
        $user = auth()->user();

        if ($user->role === 'Super Admin') {
            return $next($request);
        }

        foreach ($permissions as $permission) {
            if (in_array($permission, $user->permissions ?? [])) {
                return $next($request);
            }
        }

        return response()->json([
            'message' => 'No autorizado.'
        ], 403);
    }
}
