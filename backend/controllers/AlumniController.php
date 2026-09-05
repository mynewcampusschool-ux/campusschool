<?php
// backend/controllers/AlumniController.php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Middleware\AuthMiddleware;

class AlumniController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    private function requireAdmin(): void
    {
        $payload = AuthMiddleware::requireAdmin();
        if (!$payload) { Response::unauthorized('Admin access required.'); exit; }
    }

    private function body(): array
    {
        return (array) json_decode(file_get_contents('php://input'), true);
    }

    // GET /alumni — public listing with search/filter/pagination
    public function index(): void
    {
        $page    = max(1, (int)($_GET['page'] ?? 1));
        $limit   = min(100, max(1, (int)($_GET['limit'] ?? 20)));
        $offset  = ($page - 1) * $limit;
        $search  = trim($_GET['search'] ?? '');
        $batch   = trim($_GET['batch'] ?? '');
        $country = trim($_GET['country'] ?? '');

        $where = ['1=1'];
        $params = [];

        if ($search !== '') {
            $where[] = '(full_name LIKE ? OR organization LIKE ? OR profession LIKE ? OR city LIKE ?)';
            $like = "%{$search}%";
            array_push($params, $like, $like, $like, $like);
        }
        if ($batch !== '') {
            $where[] = 'batch = ?';
            $params[] = $batch;
        }
        if ($country !== '') {
            $where[] = 'country = ?';
            $params[] = $country;
        }

        $whereStr = implode(' AND ', $where);

        $total = (int)$this->db->prepare("SELECT COUNT(*) FROM alumni_records WHERE {$whereStr}")
            ->execute($params) ? $this->db->prepare("SELECT COUNT(*) FROM alumni_records WHERE {$whereStr}")->execute($params) : 0;

        $countStmt = $this->db->prepare("SELECT COUNT(*) FROM alumni_records WHERE {$whereStr}");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $dataStmt = $this->db->prepare("SELECT * FROM alumni_records WHERE {$whereStr} ORDER BY id LIMIT {$limit} OFFSET {$offset}");
        $dataStmt->execute($params);
        $rows = $dataStmt->fetchAll();

        Response::success([
            'data'       => $rows,
            'total'      => $total,
            'page'       => $page,
            'limit'      => $limit,
            'totalPages' => (int)ceil($total / $limit),
        ]);
    }

    // GET /alumni/:id
    public function show(int $id): void
    {
        $stmt = $this->db->prepare('SELECT * FROM alumni_records WHERE id=?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) { Response::notFound('Alumni not found.'); return; }
        Response::success($row);
    }

    // POST /admin/alumni — admin create
    public function store(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $this->db->prepare('INSERT INTO alumni_records (full_name,nickname,batch,designation,organization,profession,qualification,city,country,photo_url,linkedin_url,facebook_url,registered_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
            ->execute([$d['fullName'] ?? $d['full_name'], $d['nickname'] ?? null, $d['batch'] ?? null, $d['designation'] ?? null, $d['organization'] ?? null, $d['profession'] ?? null, $d['qualification'] ?? null, $d['city'] ?? null, $d['country'] ?? 'India', $d['photoUrl'] ?? $d['photo_url'] ?? null, $d['linkedinUrl'] ?? $d['linkedin_url'] ?? null, $d['facebookUrl'] ?? $d['facebook_url'] ?? null, $d['registeredAt'] ?? $d['registered_at'] ?? date('Y-m-d')]);
        Response::success(['id' => (int)$this->db->lastInsertId()], 'Alumni created.');
    }

    // PUT /admin/alumni/:id — admin update
    public function update(int $id): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $this->db->prepare('UPDATE alumni_records SET full_name=?,nickname=?,batch=?,designation=?,organization=?,profession=?,qualification=?,city=?,country=?,photo_url=?,linkedin_url=?,facebook_url=? WHERE id=?')
            ->execute([$d['fullName'] ?? $d['full_name'], $d['nickname'] ?? null, $d['batch'] ?? null, $d['designation'] ?? null, $d['organization'] ?? null, $d['profession'] ?? null, $d['qualification'] ?? null, $d['city'] ?? null, $d['country'] ?? 'India', $d['photoUrl'] ?? $d['photo_url'] ?? null, $d['linkedinUrl'] ?? $d['linkedin_url'] ?? null, $d['facebookUrl'] ?? $d['facebook_url'] ?? null, $id]);
        Response::success(null, 'Alumni updated.');
    }

    // DELETE /admin/alumni/:id — admin delete
    public function destroy(int $id): void
    {
        $this->requireAdmin();
        $this->db->prepare('DELETE FROM alumni_records WHERE id=?')->execute([$id]);
        Response::success(null, 'Alumni deleted.');
    }

    // GET /alumni/count — total registered users count
    public function count(): void
    {
        $stmt = $this->db->query('SELECT COUNT(*) FROM users WHERE status != \'banned\' AND deleted_at IS NULL');
        $total = (int)$stmt->fetchColumn();
        Response::success(['count' => $total]);
    }

    // GET /alumni/batches — distinct batch years for filter
    public function batches(): void
    {
        $stmt = $this->db->query("SELECT DISTINCT batch FROM alumni_records WHERE batch IS NOT NULL AND batch != '' ORDER BY batch DESC");
        Response::success($stmt->fetchAll(\PDO::FETCH_COLUMN));
    }

    // GET /alumni/countries — distinct countries for filter
    public function countries(): void
    {
        $stmt = $this->db->query("SELECT DISTINCT country FROM alumni_records WHERE country IS NOT NULL AND country != '' ORDER BY country");
        Response::success($stmt->fetchAll(\PDO::FETCH_COLUMN));
    }
}
