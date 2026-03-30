<?php

namespace App\Services;

use App\Models\Account;
use App\Models\EmailVerification;
use Illuminate\Support\Facades\Mail;

class EmailVerificationService
{
    public function GenerateToken(Account $account): EmailVerification
    {
        $token = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);

        $verification = EmailVerification::create([
            'account_id' => $account->id,
            'token' => $token,
            'expires_at' => now()->addMinutes(60),
        ]);

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
