<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, X-Requested-With, X-XSRF-TOKEN, Accept, Origin, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Access-Control-Expose-Headers', 'XSRF-TOKEN');
        
        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(200);
            $response->setContent(null);
        }

        return $response;
    }
}
