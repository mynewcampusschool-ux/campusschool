<?php
// backend/helpers/JwtHelper.php

declare(strict_types=1);

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtHelper
{
    private static function secret(): string
    {
        return $_ENV['JWT_SECRET'] ?? 'fallback_secret_change_in_production';
    }

    public static function generateAccessToken(array $payload): string
    {
        $expiry = (int)($_ENV['JWT_EXPIRY'] ?? 3600);
        $data = array_merge($payload, [
            'iat' => time(),
            'exp' => time() + $expiry,
            'type' => 'access',
        ]);
        return JWT::encode($data, self::secret(), 'HS256');
    }

    public static function generateRefreshToken(array $payload): string
    {
        $expiry = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 604800);
        $data = array_merge($payload, [
            'iat' => time(),
            'exp' => time() + $expiry,
            'type' => 'refresh',
        ]);
        return JWT::encode($data, self::secret(), 'HS256');
    }

    public static function decode(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key(self::secret(), 'HS256'));
            return (array)$decoded;
        } catch (Exception) {
            return null;
        }
    }

    public static function generateAdminAccessToken(array $payload): string
    {
        $expiry = (int)($_ENV['JWT_EXPIRY'] ?? 3600);
        $data = array_merge($payload, [
            'iat'  => time(),
            'exp'  => time() + $expiry,
            'type' => 'admin_access',
        ]);
        return JWT::encode($data, self::secret(), 'HS256');
    }

    public static function decodeAdminToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key(self::secret(), 'HS256'));
            $arr = (array)$decoded;
            return ($arr['type'] ?? '') === 'admin_access' ? $arr : null;
        } catch (Exception) {
            return null;
        }
    }

    public static function getUserIdFromToken(string $token): ?int
    {
        $data = self::decode($token);
        return isset($data['user_id']) ? (int)$data['user_id'] : null;
    }
}
