<?php

namespace App\Services;

use App\Models\EmailVerification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class EmailVerificationService
{
    public function GenerateToken(User $account): EmailVerification
    {
        $token = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);

        $verification = EmailVerification::create([
            'user_id' => $account->id,
            'token' => $token,
            'expires_at' => now()->addMinutes(60),
        ]);

        $this->SendToken($account->email, $token);

        return $verification;
    }

    public function refreshToken(User $account): EmailVerification
    {
        $token = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);

        $verification = EmailVerification::firstOrNew([
            'user_id' => $account->id,
        ]);

        $verification->token = $token;
        $verification->expires_at = now()->addMinutes(60);
        $verification->used_at = null;
        $verification->save();

        $this->SendToken($account->email, $token);

        return $verification;
    }

    public function SendToken(string $email, string $token): void
    {
        Mail::raw("Tu código de verificación es: $token", function ($message) use ($email) {
            $message->to($email)
                ->subject('Código de verificación');
        });
    }
}
