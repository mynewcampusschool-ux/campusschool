<?php
// backend/controllers/AdminUsersController.php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\UserModel;
use App\Middleware\AuthMiddleware;
use App\Helpers\{Response, Validator};

class AdminUsersController
{
    private UserModel $users;

    public function __construct()
    {
        AuthMiddleware::handleAdmin();
        $this->users = new UserModel();
    }

    // GET /api/admin/users
    public function index(): void
    {
        $page   = max(1, (int)($_GET['page']     ?? 1));
        $per    = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $search = Validator::sanitize($_GET['search'] ?? '');
        $status = Validator::sanitize($_GET['status'] ?? '');
        $role   = Validator::sanitize($_GET['role']   ?? '');

        Response::success($this->users->listAll($page, $per, $search, $status, $role));
    }

    // POST /api/admin/users
    public function store(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $v = new Validator();
        $v->required('full_name', $body['full_name'] ?? null)
          ->required('email',     $body['email']     ?? null)
          ->required('password',  $body['password']  ?? null)
          ->email('email',        $body['email']     ?? null);

        if ($v->fails()) Response::error('Validation failed.', 422, $v->errors());

        $email = strtolower(trim($body['email']));
        if ($this->users->findByEmail($email)) {
            Response::error('Email already exists.', 409);
        }

        $userId = $this->users->create([
            'full_name'     => Validator::sanitize($body['full_name']),
            'email'         => $email,
            'password_hash' => password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            'batch_year'    => Validator::sanitize($body['batch_year'] ?? ''),
            'school'        => Validator::sanitize($body['school']     ?? ''),
            'role_id'       => $this->users->roleIdBySlug(Validator::sanitize($body['role'] ?? 'alumni')),
            'status'        => in_array($body['status'] ?? '', ['active','inactive','pending','banned'], true)
                               ? $body['status'] : 'active',
        ]);

        // Auto-verify when admin creates user
        $this->users->verifyEmail($userId);

        $user = $this->users->findById($userId);
        unset($user['password_hash']);
        Response::success($user, 'User created successfully.', 201);
    }

    // GET /api/admin/users/{id}
    public function show(int $id): void
    {
        $user = $this->users->findById($id);
        if (!$user) Response::notFound('User not found.');
        unset($user['password_hash']);
        Response::success($user);
    }

    // PUT /api/admin/users/{id}
    public function update(int $id): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $user = $this->users->findById($id);
        if (!$user) Response::notFound('User not found.');

        $updates = [];
        if (isset($body['full_name'])) $updates['full_name'] = Validator::sanitize($body['full_name']);
        if (isset($body['batch_year'])) $updates['batch_year'] = Validator::sanitize($body['batch_year']);
        if (isset($body['school']))    $updates['school']    = Validator::sanitize($body['school']);
        if (isset($body['phone']))     $updates['phone']     = Validator::sanitize($body['phone']);
        if (isset($body['status']) && in_array($body['status'], ['active','inactive','banned','pending'], true)) {
            $updates['status'] = $body['status'];
        }
        if (isset($body['role'])) {
            $updates['role_id'] = $this->users->roleIdBySlug(Validator::sanitize($body['role']));
        }

        if (!empty($updates)) $this->users->updateFields($id, $updates);

        $updated = $this->users->findById($id);
        unset($updated['password_hash']);
        Response::success($updated, 'User updated.');
    }

    // DELETE /api/admin/users/{id}
    public function destroy(int $id): void
    {
        $this->users->softDelete($id);
        Response::success(null, 'User deleted.');
    }

    // PATCH /api/admin/users/{id}/status
    public function updateStatus(int $id): void
    {
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = $body['status'] ?? '';

        if (!in_array($status, ['active', 'inactive', 'banned', 'pending'], true)) {
            Response::error('Invalid status value.', 422);
        }

        $this->users->updateStatus($id, $status);
        Response::success(null, 'User status updated.');
    }

    // PATCH /api/admin/users/{id}/role
    public function updateRole(int $id): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $role = Validator::sanitize($body['role'] ?? '');

        $roleId = $this->users->roleIdBySlug($role);
        if (!$roleId) Response::error('Invalid role.', 422);

        $this->users->updateFields($id, ['role_id' => $roleId]);
        Response::success(null, 'User role updated.');
    }

    // POST /api/admin/users/{id}/reset-password
    public function resetPassword(int $id): void
    {
        $body     = json_decode(file_get_contents('php://input'), true) ?? [];
        $password = $body['password'] ?? '';

        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters.', 422);
        }

        $this->users->updatePassword($id, password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]));
        Response::success(null, 'Password reset successfully.');
    }
}
