<?php
// backend/middleware/AuthMiddleware.php

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\JwtHelper;
use App\Helpers\Response;

class AuthMiddleware
{
    public static function handle(): array
    {
        $token = self::extractToken();
        if (!$token) {
            Response::unauthorized('No authentication token provided.');
        }

        $payload = JwtHelper::decode($token);
        if (!$payload || ($payload['type'] ?? '') !== 'access') {
            Response::unauthorized('Invalid or expired token.');
        }

        return $payload;
    }

    public static function handleAdmin(): array
    {
        $token = self::extractToken();
        if (!$token) {
            Response::unauthorized('No authentication token provided.');
        }

        // Support both admin_access tokens (new) and legacy access tokens with admin role
        $payload = JwtHelper::decodeAdminToken($token);
        if (!$payload) {
            // Fallback: try regular access token with admin role
            $payload = JwtHelper::decode($token);
            if (!$payload || ($payload['type'] ?? '') !== 'access') {
                Response::unauthorized('Invalid or expired token.');
            }
        }

        $role = $payload['role'] ?? '';
        if (!in_array($role, ['admin', 'superadmin'], true)) {
            Response::forbidden('Admin access required.');
        }
        return $payload;
    }

    // Alias used by CmsController / AlumniController
    public static function requireAdmin(): ?array
    {
        try {
            return self::handleAdmin();
        } catch (\Throwable) {
            return null;
        }
    }

    private static function extractToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($header, 'Bearer ')) {
            return substr($header, 7);
        }
        // Also check cookie
        return $_COOKIE['auth_token'] ?? null;
    }
}
