<?php
// backend/controllers/AdminAuthController.php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\AdminModel;
use App\Helpers\{JwtHelper, Response, Validator};

class AdminAuthController
{
    private AdminModel $admins;

    public function __construct()
    {
        $this->admins = new AdminModel();
        // Ensure default super-admin exists on every boot
        $this->admins->ensureDefaultAdmin();
    }

    // POST /api/admin/auth/login
    public function login(): void
    {
        $body = $this->json();

        $v = new Validator();
        $v->required('email',    $body['email']    ?? null)
          ->required('password', $body['password'] ?? null)
          ->email('email',       $body['email']    ?? null);

        if ($v->fails()) {
            Response::error('Validation failed.', 422, $v->errors());
        }

        $email = strtolower(trim($body['email']));
        $admin = $this->admins->findByEmail($email);

        if (!$admin || !password_verify($body['password'], $admin['password_hash'])) {
            Response::error('Invalid email or password.', 401);
        }

        if (!$admin['is_active']) {
            Response::error('This admin account is disabled.', 403);
        }

        $this->admins->updateLastLogin((int)$admin['id']);

        $tokens = $this->issueTokens($admin);
        Response::success($tokens, 'Admin login successful.');
    }

    // POST /api/admin/auth/logout
    public function logout(): void
    {
        $body = $this->json();
        if (!empty($body['refresh_token'])) {
            $hash = hash('sha256', $body['refresh_token']);
            $this->admins->revokeRefreshToken($hash);
        }
        Response::success(null, 'Logged out successfully.');
    }

    // GET /api/admin/auth/me
    public function me(): void
    {
        $payload = $this->requireAdminToken();
        $admin   = $this->admins->findById((int)$payload['admin_id']);
        if (!$admin) Response::notFound('Admin not found.');
        unset($admin['password_hash']);
        Response::success($admin);
    }

    // POST /api/admin/auth/refresh
    public function refresh(): void
    {
        $body  = $this->json();
        $token = $body['refresh_token'] ?? '';
        if (!$token) Response::error('Refresh token required.', 400);

        $hash   = hash('sha256', $token);
        $stored = $this->admins->findRefreshToken($hash);
        if (!$stored) Response::unauthorized('Invalid or expired refresh token.');

        $admin = $this->admins->findById((int)$stored['admin_id']);
        if (!$admin) Response::unauthorized('Admin not found.');

        $this->admins->revokeRefreshToken($hash);
        $tokens = $this->issueTokens($admin);
        Response::success($tokens, 'Token refreshed.');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function issueTokens(array $admin): array
    {
        $payload = [
            'admin_id' => (int)$admin['id'],
            'email'    => $admin['email'],
            'role'     => $admin['role_slug'],
        ];

        $accessToken  = JwtHelper::generateAdminAccessToken($payload);
        $refreshToken = bin2hex(random_bytes(40));
        $refreshHash  = hash('sha256', $refreshToken);
        $expiry       = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 604800);

        $this->admins->saveRefreshToken((int)$admin['id'], $refreshHash, $expiry);

        return [
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type'    => 'Bearer',
            'expires_in'    => (int)($_ENV['JWT_EXPIRY'] ?? 3600),
            'admin' => [
                'id'        => (int)$admin['id'],
                'full_name' => $admin['full_name'],
                'email'     => $admin['email'],
                'role'      => $admin['role_slug'],
                'avatar'    => $admin['avatar'] ?? null,
            ],
        ];
    }

    public function requireAdminToken(): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token  = str_starts_with($header, 'Bearer ') ? substr($header, 7) : null;
        if (!$token) Response::unauthorized('No token provided.');

        $payload = JwtHelper::decodeAdminToken($token);
        if (!$payload || ($payload['type'] ?? '') !== 'admin_access') {
            Response::unauthorized('Invalid or expired admin token.');
        }
        if (!in_array($payload['role'] ?? '', ['admin', 'superadmin'], true)) {
            Response::forbidden('Admin access required.');
        }
        return $payload;
    }

    private function json(): array
    {
        return json_decode(file_get_contents('php://input') ?: '{}', true) ?? [];
    }
}
