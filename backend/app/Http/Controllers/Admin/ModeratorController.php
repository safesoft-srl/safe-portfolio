<?php

namespace App\Http\Controllers\Admin;

use App\Constants\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreModeratorRequest;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Throwable;

class ModeratorController extends Controller
{
    /**
     * Lista todos los administradores/moderadores excepto el usuario autenticado.
     */
    public function index()
    {
        $currentUserId = auth('api')->id();

        $moderators = User::where('role', 'admin')
            ->where('id', '!=', $currentUserId)
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success(
            $moderators,
            'Moderadores obtenidos correctamente.'
        );
    }

    /**
     * Asciende a un usuario existente a moderador/administrador.
     */
    public function store(StoreModeratorRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->firstOrFail();

            if ($user->role === 'admin') {
                return ApiResponse::error(
                    'Este usuario ya es un moderador.',
                    400
                );
            }

            $user->update([
                'role' => 'admin',
                'permissions' => $request->permissions ?? [],
            ]);

            return ApiResponse::success(
                $user,
                'Usuario ascendido a moderador correctamente.',
                200
            );
        } catch (Throwable $e) {
            Log::error('Error al ascender moderador', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo ascender al usuario. Intenta nuevamente.',
                500
            );
        }
    }

    /**
     * Degrada un moderador a usuario normal. No permite auto-degradación.
     */
    public function destroy(int $id)
    {
        $currentUserId = auth('api')->id();

        if ($id === $currentUserId) {
            return ApiResponse::error(
                'No puedes removerte los permisos a ti mismo.',
                403
            );
        }

        $moderator = User::where('role', 'admin')->find($id);

        if (!$moderator) {
            return ApiResponse::error(
                'Moderador no encontrado.',
                404
            );
        }

        $name = $moderator->name;
        $moderator->update([
            'role' => 'user',
            'permissions' => null,
        ]);

        return ApiResponse::success(
            null,
            "El rol de moderador de '{$name}' fue removido correctamente."
        );
    }
}
