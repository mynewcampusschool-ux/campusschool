<?php
// backend/controllers/AuthController.php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\UserModel;
use App\Helpers\{JwtHelper, Mailer, Response, Validator};

class AuthController
{
    private UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    // ── POST /api/auth/register ──────────────────────────────────────────────
    public function register(): void
    {
        $body = $this->json();

        $v = new Validator();
        $v->required('full_name', $body['full_name'] ?? null)
          ->required('email',     $body['email']     ?? null)
          ->required('password',  $body['password']  ?? null)
          ->email('email',        $body['email']     ?? null)
          ->strongPassword('password', $body['password'] ?? null)
          ->maxLength('full_name', $body['full_name'] ?? null, 150);

        if ($v->fails()) {
            Response::error('Validation failed.', 422, $v->errors());
        }

        $email = strtolower(trim($body['email']));

        if ($this->users->findByEmail($email)) {
            Response::error('An account with this email already exists.', 409);
        }

        $userId = $this->users->create([
            'full_name'     => Validator::sanitize($body['full_name']),
            'email'         => $email,
            'password_hash' => password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            'batch_year'    => Validator::sanitize($body['batch_year'] ?? ''),
            'school'        => Validator::sanitize($body['school']     ?? ''),
            'status'        => 'pending',
        ]);

        // Send verification email
        $token = bin2hex(random_bytes(32));
        $this->users->saveVerificationToken($userId, $token);
        Mailer::sendVerification($email, Validator::sanitize($body['full_name']), $token);

        Response::success(
            ['user_id' => $userId],
            'Registration successful. Please check your email to verify your account.',
            201
        );
    }

    // ── POST /api/auth/login ─────────────────────────────────────────────────
    public function login(): void
    {
        $body = $this->json();
        $ip   = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $ua   = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $v = new Validator();
        $v->required('email',    $body['email']    ?? null)
          ->required('password', $body['password'] ?? null)
          ->email('email',       $body['email']    ?? null);

        if ($v->fails()) {
            Response::error('Validation failed.', 422, $v->errors());
        }

        $email = strtolower(trim($body['email']));
        $user  = $this->users->findByEmail($email);

        if (!$user || !$user['password_hash'] || !password_verify($body['password'], $user['password_hash'])) {
            if ($user) {
                $this->users->logLogin((int)$user['id'], $ip, $ua, 'email', 'failed');
            }
            Response::error('Invalid email or password.', 401);
        }

        if ($user['status'] === 'banned') {
            Response::error('Your account has been suspended. Contact support.', 403);
        }

        if (!$user['email_verified']) {
            Response::error('Please verify your email before logging in.', 403);
        }

        $this->users->updateLastLogin((int)$user['id'], $ip);
        $this->users->logLogin((int)$user['id'], $ip, $ua, 'email', 'success');

        $tokens = $this->issueTokens($user);
        Response::success($tokens, 'Login successful.');
    }

    // ── POST /api/auth/logout ────────────────────────────────────────────────
    public function logout(): void
    {
        $body = $this->json();
        if (!empty($body['refresh_token'])) {
            $hash = hash('sha256', $body['refresh_token']);
            $this->users->revokeRefreshToken($hash);
        }
        Response::success(null, 'Logged out successfully.');
    }

    // ── POST /api/auth/refresh ───────────────────────────────────────────────
    public function refresh(): void
    {
        $body  = $this->json();
        $token = $body['refresh_token'] ?? '';

        if (!$token) {
            Response::error('Refresh token required.', 400);
        }

        $hash    = hash('sha256', $token);
        $stored  = $this->users->findRefreshToken($hash);

        if (!$stored) {
            Response::unauthorized('Invalid or expired refresh token.');
        }

        $user = $this->users->findById((int)$stored['user_id']);
        if (!$user) {
            Response::unauthorized('User not found.');
        }

        $this->users->revokeRefreshToken($hash);
        $tokens = $this->issueTokens($user);
        Response::success($tokens, 'Token refreshed.');
    }

    // ── POST /api/auth/verify-email ──────────────────────────────────────────
    public function verifyEmail(): void
    {
        $body  = $this->json();
        $token = trim($body['token'] ?? '');

        if (!$token) {
            Response::error('Verification token required.', 400);
        }

        $record = $this->users->findVerificationToken($token);
        if (!$record) {
            Response::error('Invalid or expired verification link.', 400);
        }

        $this->users->verifyEmail((int)$record['user_id']);
        $this->users->markVerificationUsed((int)$record['id']);

        $user   = $this->users->findById((int)$record['user_id']);
        $tokens = $this->issueTokens($user);
        Response::success($tokens, 'Email verified successfully. You are now logged in.');
    }

    // ── POST /api/auth/forgot-password ───────────────────────────────────────
    public function forgotPassword(): void
    {
        $body  = $this->json();
        $email = strtolower(trim($body['email'] ?? ''));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Valid email address required.', 422);
        }

        $user = $this->users->findByEmail($email);
        // Always return success to prevent email enumeration
        if ($user) {
            $token = bin2hex(random_bytes(32));
            $this->users->savePasswordResetToken($email, $token);
            Mailer::sendPasswordReset($email, $user['full_name'], $token);
        }

        Response::success(null, 'If that email exists, a reset link has been sent.');
    }

    // ── POST /api/auth/reset-password ────────────────────────────────────────
    public function resetPassword(): void
    {
        $body  = $this->json();
        $token = trim($body['token']    ?? '');
        $pass  = trim($body['password'] ?? '');

        $v = new Validator();
        $v->required('token',    $token)
          ->required('password', $pass)
          ->strongPassword('password', $pass);

        if ($v->fails()) {
            Response::error('Validation failed.', 422, $v->errors());
        }

        $record = $this->users->findPasswordResetToken($token);
        if (!$record) {
            Response::error('Invalid or expired reset link.', 400);
        }

        $user = $this->users->findByEmail($record['email']);
        if (!$user) {
            Response::error('User not found.', 404);
        }

        $this->users->updatePassword((int)$user['id'], password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]));
        $this->users->markResetUsed((int)$record['id']);

        Response::success(null, 'Password reset successfully. You can now log in.');
    }

    // ── GET /api/auth/me ─────────────────────────────────────────────────────
    public function me(): void
    {
        $token   = $this->bearerToken();
        $payload = JwtHelper::decode($token ?? '');

        if (!$payload || ($payload['type'] ?? '') !== 'access') {
            Response::unauthorized();
        }

        $user = $this->users->findById((int)$payload['user_id']);
        if (!$user) {
            Response::notFound('User not found.');
        }

        unset($user['password_hash']);
        Response::success($user);
    }

    // ── GET /api/auth/google ─────────────────────────────────────────────────
    public function googleRedirect(): void
    {
        $clientId    = $_ENV['GOOGLE_CLIENT_ID']    ?? '';
        $redirectUri = $_ENV['GOOGLE_REDIRECT_URI'] ?? '';
        $state       = bin2hex(random_bytes(16));

        setcookie('oauth_state', $state, time() + 600, '/', '', false, true);

        $params = http_build_query([
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'state'         => $state,
            'access_type'   => 'offline',
        ]);

        header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $params);
        exit;
    }

    // ── GET /api/auth/google/callback ────────────────────────────────────────
    public function googleCallback(): void
    {
        $code  = $_GET['code']  ?? '';
        $state = $_GET['state'] ?? '';

        if (!$code || $state !== ($_COOKIE['oauth_state'] ?? '')) {
            $this->redirectWithError('Google authentication failed.');
        }

        // Exchange code for token
        $tokenRes = $this->httpPost('https://oauth2.googleapis.com/token', [
            'code'          => $code,
            'client_id'     => $_ENV['GOOGLE_CLIENT_ID']     ?? '',
            'client_secret' => $_ENV['GOOGLE_CLIENT_SECRET'] ?? '',
            'redirect_uri'  => $_ENV['GOOGLE_REDIRECT_URI']  ?? '',
            'grant_type'    => 'authorization_code',
        ]);

        if (empty($tokenRes['access_token'])) {
            $this->redirectWithError('Google token exchange failed.');
        }

        // Get user info
        $profile = $this->httpGet(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            $tokenRes['access_token']
        );

        if (empty($profile['email'])) {
            $this->redirectWithError('Could not retrieve Google profile.');
        }

        $userId = $this->users->createOrUpdateSocial([
            'full_name' => $profile['name']    ?? $profile['email'],
            'email'     => strtolower($profile['email']),
            'avatar'    => $profile['picture'] ?? null,
        ]);

        $this->users->linkSocialAccount(
            $userId, 'google', $profile['id'],
            $profile['picture'] ?? null,
            $tokenRes['access_token']
        );

        $user   = $this->users->findById($userId);
        $tokens = $this->issueTokens($user);

        $this->redirectWithTokens($tokens);
    }

    // ── GET /api/auth/facebook ───────────────────────────────────────────────
    public function facebookRedirect(): void
    {
        $clientId    = $_ENV['FACEBOOK_APP_ID']       ?? '';
        $redirectUri = $_ENV['FACEBOOK_REDIRECT_URI'] ?? '';
        $state       = bin2hex(random_bytes(16));

        setcookie('oauth_state', $state, time() + 600, '/', '', false, true);

        $params = http_build_query([
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'state'         => $state,
            'scope'         => 'email,public_profile',
            'response_type' => 'code',
        ]);

        header('Location: https://www.facebook.com/v18.0/dialog/oauth?' . $params);
        exit;
    }

    // ── GET /api/auth/facebook/callback ─────────────────────────────────────
    public function facebookCallback(): void
    {
        $code  = $_GET['code']  ?? '';
        $state = $_GET['state'] ?? '';

        if (!$code || $state !== ($_COOKIE['oauth_state'] ?? '')) {
            $this->redirectWithError('Facebook authentication failed.');
        }

        $tokenRes = $this->httpPost('https://graph.facebook.com/v18.0/oauth/access_token', [
            'client_id'     => $_ENV['FACEBOOK_APP_ID']     ?? '',
            'client_secret' => $_ENV['FACEBOOK_APP_SECRET'] ?? '',
            'redirect_uri'  => $_ENV['FACEBOOK_REDIRECT_URI'] ?? '',
            'code'          => $code,
        ]);

        if (empty($tokenRes['access_token'])) {
            $this->redirectWithError('Facebook token exchange failed.');
        }

        $profile = $this->httpGet(
            'https://graph.facebook.com/me?fields=id,name,email,picture.type(large)',
            $tokenRes['access_token']
        );

        if (empty($profile['email'])) {
            $this->redirectWithError('Facebook did not provide an email address.');
        }

        $avatar = $profile['picture']['data']['url'] ?? null;
        $userId = $this->users->createOrUpdateSocial([
            'full_name' => $profile['name']  ?? $profile['email'],
            'email'     => strtolower($profile['email']),
            'avatar'    => $avatar,
        ]);

        $this->users->linkSocialAccount($userId, 'facebook', $profile['id'], $avatar, $tokenRes['access_token']);

        $user   = $this->users->findById($userId);
        $tokens = $this->issueTokens($user);
        $this->redirectWithTokens($tokens);
    }

    // ── GET /api/auth/linkedin ───────────────────────────────────────────────
    public function linkedinRedirect(): void
    {
        $clientId    = $_ENV['LINKEDIN_CLIENT_ID']    ?? '';
        $redirectUri = $_ENV['LINKEDIN_REDIRECT_URI'] ?? '';
        $state       = bin2hex(random_bytes(16));

        setcookie('oauth_state', $state, time() + 600, '/', '', false, true);

        $params = http_build_query([
            'response_type' => 'code',
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'state'         => $state,
            'scope'         => 'openid profile email',
        ]);

        header('Location: https://www.linkedin.com/oauth/v2/authorization?' . $params);
        exit;
    }

    // ── GET /api/auth/linkedin/callback ─────────────────────────────────────
    public function linkedinCallback(): void
    {
        $code  = $_GET['code']  ?? '';
        $state = $_GET['state'] ?? '';

        if (!$code || $state !== ($_COOKIE['oauth_state'] ?? '')) {
            $this->redirectWithError('LinkedIn authentication failed.');
        }

        $tokenRes = $this->httpPost('https://www.linkedin.com/oauth/v2/accessToken', [
            'grant_type'    => 'authorization_code',
            'code'          => $code,
            'client_id'     => $_ENV['LINKEDIN_CLIENT_ID']     ?? '',
            'client_secret' => $_ENV['LINKEDIN_CLIENT_SECRET'] ?? '',
            'redirect_uri'  => $_ENV['LINKEDIN_REDIRECT_URI']  ?? '',
        ]);

        if (empty($tokenRes['access_token'])) {
            $this->redirectWithError('LinkedIn token exchange failed.');
        }

        $profile = $this->httpGet('https://api.linkedin.com/v2/userinfo', $tokenRes['access_token']);

        if (empty($profile['email'])) {
            $this->redirectWithError('LinkedIn did not provide an email address.');
        }

        $avatar = $profile['picture'] ?? null;
        $userId = $this->users->createOrUpdateSocial([
            'full_name' => trim(($profile['given_name'] ?? '') . ' ' . ($profile['family_name'] ?? '')) ?: $profile['email'],
            'email'     => strtolower($profile['email']),
            'avatar'    => $avatar,
        ]);

        $this->users->linkSocialAccount($userId, 'linkedin', $profile['sub'], $avatar, $tokenRes['access_token']);

        $user   = $this->users->findById($userId);
        $tokens = $this->issueTokens($user);
        $this->redirectWithTokens($tokens);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private function issueTokens(array $user): array
    {
        $payload = [
            'user_id' => (int)$user['id'],
            'email'   => $user['email'],
            'role'    => $user['role_slug'] ?? 'alumni',
        ];

        $accessToken  = JwtHelper::generateAccessToken($payload);
        $refreshToken = bin2hex(random_bytes(40));
        $refreshHash  = hash('sha256', $refreshToken);
        $expiry       = (int)($_ENV['JWT_REFRESH_EXPIRY'] ?? 604800);

        $this->users->saveRefreshToken((int)$user['id'], $refreshHash, $expiry);

        return [
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type'    => 'Bearer',
            'expires_in'    => (int)($_ENV['JWT_EXPIRY'] ?? 3600),
            'user' => [
                'id'             => (int)$user['id'],
                'full_name'      => $user['full_name'],
                'email'          => $user['email'],
                'avatar'         => $user['avatar'],
                'batch_year'     => $user['batch_year'],
                'school'         => $user['school'],
                'role'           => $user['role_slug'] ?? 'alumni',
                'status'         => $user['status'],
                'email_verified' => (bool)$user['email_verified'],
            ],
        ];
    }

    private function json(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '{}', true) ?? [];
    }

    private function bearerToken(): ?string
    {
        $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        return str_starts_with($h, 'Bearer ') ? substr($h, 7) : null;
    }

    private function httpPost(string $url, array $data): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($data),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res ?: '{}', true) ?? [];
    }

    private function httpGet(string $url, string $accessToken): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$accessToken}"],
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res ?: '{}', true) ?? [];
    }

    private function redirectWithTokens(array $tokens): void
    {
        $frontendUrl = rtrim($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173', '/');
        $params = http_build_query([
            'access_token'  => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'],
        ]);
        header("Location: {$frontendUrl}/auth/social-callback?{$params}");
        exit;
    }

    private function redirectWithError(string $message): void
    {
        $frontendUrl = rtrim($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173', '/');
        header("Location: {$frontendUrl}/auth/login?error=" . urlencode($message));
        exit;
    }
}
