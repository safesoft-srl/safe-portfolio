<?php

use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\RegisterAccountController;
use App\Http\Controllers\ResendTokenController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterAccountController::class, 'register']);
// Api   http://localhost:8000/api/register   (Para registrar nuevos usuarios)  JSON(name,email,password)
Route::post('/verify-email', [EmailVerificationController::class, 'verifyEmail']);
// Api  http://localhost:8000/api/verify-email   (Para  Verificar el correo de un usuario nuevo registrandose) JSON(email,token)
Route::post('/resend-token', [ResendTokenController::class, 'resend']);
// Api: http://localhost:8000/api/resend-token   (Para reenviar el token de verificación)  JSON(email)
