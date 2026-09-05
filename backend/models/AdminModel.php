<?php
// backend/models/AdminModel.php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class AdminModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // Ensure the default Super Admin exists (idempotent)
    public function ensureDefaultAdmin(): void
    {
        $stmt = $this->db->prepare('SELECT id FROM admins WHERE email = ? LIMIT 1');
        $stmt->execute(['admin@campusschool.edu']);
        if ($stmt->fetch()) return;

        // Also try the legacy email from schema
        $stmt2 = $this->db->prepare('SELECT id FROM admins WHERE email = ? LIMIT 1');
        $stmt2->execute(['admin@campusschool.in']);
        if ($stmt2->fetch()) return;

        $this->db->prepare(
            'INSERT INTO admins (full_name, email, password_hash, role_id, is_active)
             VALUES (?, ?, ?, 1, 1)'
        )->execute([
            'Super Admin',
            'admin@campusschool.edu',
            password_hash('Admin@123', PASSWORD_BCRYPT, ['cost' => 12]),
        ]);
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT a.*, r.slug AS role_slug
             FROM admins a JOIN roles r ON r.id = a.role_id
             WHERE a.email = ? LIMIT 1'
        );
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT a.*, r.slug AS role_slug
             FROM admins a JOIN roles r ON r.id = a.role_id
             WHERE a.id = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function updateLastLogin(int $id): void
    {
        $this->db->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = ?')->execute([$id]);
    }

    public function saveRefreshToken(int $adminId, string $tokenHash, int $expirySeconds): void
    {
        $this->db->prepare(
            'INSERT INTO admin_refresh_tokens (admin_id, token_hash, expires_at)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))'
        )->execute([$adminId, $tokenHash, $expirySeconds]);
    }

    public function findRefreshToken(string $tokenHash): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM admin_refresh_tokens
             WHERE token_hash = ? AND revoked = 0 AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([$tokenHash]);
        return $stmt->fetch() ?: null;
    }

    public function revokeRefreshToken(string $tokenHash): void
    {
        $this->db->prepare(
            'UPDATE admin_refresh_tokens SET revoked = 1 WHERE token_hash = ?'
        )->execute([$tokenHash]);
    }
}
