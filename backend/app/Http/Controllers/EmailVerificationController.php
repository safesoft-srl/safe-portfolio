<?php

namespace App\Http\Controllers;

use App\Models\EmailVerification;
use App\Models\User;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verifyEmail(Request $request)
    {

        $request->validate([
            'email' => 'required|string|email|max:255',
            'token' => 'required|string|max:10',
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
                'success' => true,
                'message' => 'La cuenta ya estaba verificada',
            ], 200);
        }

        $verification = EmailVerification::where('user_id', $account->id)
            ->where('token', $request->token)
            ->first();

        if (! $verification) {
            return response()->json([
                'success' => false,
                'message' => 'Token incorrecto',
            ], 400);
        }

        if ($verification->used_at) {
            return response()->json([
                'success' => false,
                'message' => 'Token ya utilizado',
            ], 400);
        }

        if ($verification->expires_at && now()->greaterThan($verification->expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Token expirado',
            ], 400);
        }

        $account->verified = true;
        $account->save();
        $verification->used_at = now();
        $verification->save();

        return response()->json([
            'success' => true,
            'message' => 'Correo verificado exitosamente',
        ], 200);
    }
}
