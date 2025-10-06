<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'password/*',
        'email/verification-notification',
        'forgot-password',
        'reset-password',
        'verify-email',
    ];

    protected function tokensMatch($request)
    {
        $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');
        
        if (!$token && $header = $request->header('X-XSRF-TOKEN')) {
            $token = $this->encrypter->decrypt($header, static::serialized());
        }
        
        return hash_equals($request->session()->token(), (string) $token);
    }
}
