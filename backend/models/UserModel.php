<?php
// backend/models/UserModel.php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class UserModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT u.*, r.slug AS role_slug FROM users u
             JOIN roles r ON r.id = u.role_id
             WHERE u.id = ? AND u.deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (role_id, full_name, email, password_hash, batch_year, school, status)
             VALUES (:role_id, :full_name, :email, :password_hash, :batch_year, :school, :status)'
        );
        $stmt->execute([
            ':role_id'       => $data['role_id']       ?? 3,
            ':full_name'     => $data['full_name'],
            ':email'         => $data['email'],
            ':password_hash' => $data['password_hash']  ?? null,
            ':batch_year'    => $data['batch_year']     ?? null,
            ':school'        => $data['school']         ?? null,
            ':status'        => $data['status']         ?? 'pending',
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function createOrUpdateSocial(array $data): int
    {
        // Find existing user by email
        $existing = $this->findByEmail($data['email']);
        if ($existing) {
            // Update avatar if not set
            if (!$existing['avatar'] && !empty($data['avatar'])) {
                $this->db->prepare('UPDATE users SET avatar=?, updated_at=NOW() WHERE id=?')
                    ->execute([$data['avatar'], $existing['id']]);
            }
            return (int)$existing['id'];
        }

        // Create new user (social login — no password, auto-verified)
        $stmt = $this->db->prepare(
            'INSERT INTO users (role_id, full_name, email, avatar, status, email_verified, email_verified_at)
             VALUES (3, :full_name, :email, :avatar, "active", 1, NOW())'
        );
        $stmt->execute([
            ':full_name' => $data['full_name'],
            ':email'     => $data['email'],
            ':avatar'    => $data['avatar'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function linkSocialAccount(int $userId, string $provider, string $providerId, ?string $avatar, ?string $token): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO social_accounts (user_id, provider, provider_id, avatar, token)
             VALUES (:user_id, :provider, :provider_id, :avatar, :token)
             ON DUPLICATE KEY UPDATE avatar=VALUES(avatar), token=VALUES(token), updated_at=NOW()'
        );
        $stmt->execute([
            ':user_id'     => $userId,
            ':provider'    => $provider,
            ':provider_id' => $providerId,
            ':avatar'      => $avatar,
            ':token'       => $token,
        ]);
    }

    public function verifyEmail(int $userId): void
    {
        $this->db->prepare(
            'UPDATE users SET email_verified=1, email_verified_at=NOW(), status="active", updated_at=NOW() WHERE id=?'
        )->execute([$userId]);
    }

    public function updateLastLogin(int $userId, string $ip): void
    {
        $this->db->prepare(
            'UPDATE users SET last_login_at=NOW(), last_login_ip=? WHERE id=?'
        )->execute([$ip, $userId]);
    }

    public function updatePassword(int $userId, string $hash): void
    {
        $this->db->prepare(
            'UPDATE users SET password_hash=?, updated_at=NOW() WHERE id=?'
        )->execute([$hash, $userId]);
    }

    public function saveVerificationToken(int $userId, string $token): void
    {
        // Invalidate old tokens
        $this->db->prepare('UPDATE email_verifications SET used=1 WHERE user_id=?')->execute([$userId]);
        $this->db->prepare(
            'INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))'
        )->execute([$userId, $token]);
    }

    public function findVerificationToken(string $token): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM email_verifications WHERE token=? AND used=0 AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public function markVerificationUsed(int $id): void
    {
        $this->db->prepare('UPDATE email_verifications SET used=1 WHERE id=?')->execute([$id]);
    }

    public function savePasswordResetToken(string $email, string $token): void
    {
        $this->db->prepare('UPDATE password_resets SET used=1 WHERE email=?')->execute([$email]);
        $this->db->prepare(
            'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))'
        )->execute([$email, $token]);
    }

    public function findPasswordResetToken(string $token): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM password_resets WHERE token=? AND used=0 AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public function markResetUsed(int $id): void
    {
        $this->db->prepare('UPDATE password_resets SET used=1 WHERE id=?')->execute([$id]);
    }

    public function logLogin(int $userId, string $ip, string $agent, string $provider, string $status): void
    {
        $this->db->prepare(
            'INSERT INTO login_history (user_id, ip_address, user_agent, provider, status) VALUES (?,?,?,?,?)'
        )->execute([$userId, $ip, $agent, $provider, $status]);
    }

    public function saveRefreshToken(int $userId, string $tokenHash, int $expirySeconds): void
    {
        $this->db->prepare(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))'
        )->execute([$userId, $tokenHash, $expirySeconds]);
    }

    public function findRefreshToken(string $tokenHash): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM refresh_tokens WHERE token_hash=? AND revoked=0 AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([$tokenHash]);
        return $stmt->fetch() ?: null;
    }

    public function revokeRefreshToken(string $tokenHash): void
    {
        $this->db->prepare('UPDATE refresh_tokens SET revoked=1 WHERE token_hash=?')->execute([$tokenHash]);
    }

    public function roleIdBySlug(string $slug): int
    {
        $stmt = $this->db->prepare('SELECT id FROM roles WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ? (int)$row['id'] : 3; // default: alumni
    }

    public function updateFields(int $id, array $fields): void
    {
        if (empty($fields)) return;
        $sets   = implode(', ', array_map(fn($k) => "`{$k}` = ?", array_keys($fields)));
        $values = array_values($fields);
        $values[] = $id;
        $this->db->prepare("UPDATE users SET {$sets}, updated_at = NOW() WHERE id = ?")->execute($values);
    }

    // Admin: list all users with pagination + role filter
    public function listAll(int $page = 1, int $perPage = 20, string $search = '', string $status = '', string $role = ''): array
    {
        $offset = ($page - 1) * $perPage;
        $where  = ['u.deleted_at IS NULL'];
        $params = [];

        if ($search) {
            $where[]  = '(u.full_name LIKE ? OR u.email LIKE ? OR u.batch_year LIKE ?)';
            $like     = "%{$search}%";
            $params   = array_merge($params, [$like, $like, $like]);
        }
        if ($status) {
            $where[]  = 'u.status = ?';
            $params[] = $status;
        }
        if ($role) {
            $where[]  = 'r.slug = ?';
            $params[] = $role;
        }

        $whereStr = implode(' AND ', $where);

        $countStmt = $this->db->prepare("SELECT COUNT(*) FROM users u JOIN roles r ON r.id = u.role_id WHERE {$whereStr}");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $stmt = $this->db->prepare(
            "SELECT u.id, u.full_name, u.email, u.batch_year, u.school, u.avatar,
                    u.status, u.email_verified, u.last_login_at, u.created_at, r.name AS role
             FROM users u JOIN roles r ON r.id = u.role_id
             WHERE {$whereStr}
             ORDER BY u.created_at DESC
             LIMIT {$perPage} OFFSET {$offset}"
        );
        $stmt->execute($params);

        return [
            'data'       => $stmt->fetchAll(),
            'total'      => $total,
            'page'       => $page,
            'per_page'   => $perPage,
            'last_page'  => (int)ceil($total / $perPage),
        ];
    }

    public function updateStatus(int $id, string $status): void
    {
        $this->db->prepare('UPDATE users SET status=?, updated_at=NOW() WHERE id=?')->execute([$status, $id]);
    }

    public function softDelete(int $id): void
    {
        $this->db->prepare('UPDATE users SET deleted_at=NOW() WHERE id=?')->execute([$id]);
    }
}
