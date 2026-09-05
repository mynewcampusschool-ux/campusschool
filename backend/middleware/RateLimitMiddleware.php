<?php
// backend/middleware/RateLimitMiddleware.php

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Response;

class RateLimitMiddleware
{
    public static function handle(int $maxRequests = 60, int $windowSeconds = 60): void
    {
        $ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $key     = md5($ip . '_' . floor(time() / $windowSeconds));
        $logDir  = __DIR__ . '/../logs/rate/';

        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $file = $logDir . $key . '.json';
        $data = ['count' => 0, 'reset' => time() + $windowSeconds];

        if (file_exists($file)) {
            $stored = json_decode(file_get_contents($file), true);
            if ($stored && $stored['reset'] > time()) {
                $data = $stored;
            }
        }

        $data['count']++;
        file_put_contents($file, json_encode($data), LOCK_EX);

        header('X-RateLimit-Limit: ' . $maxRequests);
        header('X-RateLimit-Remaining: ' . max(0, $maxRequests - $data['count']));
        header('X-RateLimit-Reset: ' . $data['reset']);

        if ($data['count'] > $maxRequests) {
            Response::error('Too many requests. Please try again later.', 429);
        }
    }
}
