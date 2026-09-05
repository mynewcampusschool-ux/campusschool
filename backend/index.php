<?php
// backend/index.php  — Main entry point

declare(strict_types=1);

// ── Autoload ─────────────────────────────────────────────────────────────────
require_once __DIR__ . '/vendor/autoload.php';

// ── Load .env ────────────────────────────────────────────────────────────────
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// ── CORS ─────────────────────────────────────────────────────────────────────
use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;

CorsMiddleware::handle();

// ── Rate limiting (60 req/min per IP) ────────────────────────────────────────
RateLimitMiddleware::handle(60, 60);

// ── Route ─────────────────────────────────────────────────────────────────────
require_once __DIR__ . '/routes/api.php';
