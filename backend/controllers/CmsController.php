<?php
// backend/controllers/CmsController.php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Middleware\AuthMiddleware;

class CmsController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private function requireAdmin(): void
    {
        $payload = AuthMiddleware::requireAdmin();
        if (!$payload) {
            Response::unauthorized('Admin access required.');
            exit;
        }
    }

    private function body(): array
    {
        return (array) json_decode(file_get_contents('php://input'), true);
    }

    private function rows(string $sql, array $params = []): array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    private function row(string $sql, array $params = []): ?array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $r = $stmt->fetch();
        return $r ?: null;
    }

    // ── Settings ─────────────────────────────────────────────────────────────

    public function getSettings(): void
    {
        $rows = $this->rows('SELECT `key`, `value` FROM cms_settings ORDER BY `key`');
        $out = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        Response::success($out);
    }

    public function updateSettings(): void
    {
        $this->requireAdmin();
        $data = $this->body();
        $stmt = $this->db->prepare('INSERT INTO cms_settings (`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)');
        foreach ($data as $k => $v) {
            $stmt->execute([(string)$k, (string)$v]);
        }
        Response::success(null, 'Settings updated.');
    }

    // ── Hero Slides ───────────────────────────────────────────────────────────

    public function getHero(): void
    {
        Response::success($this->rows('SELECT * FROM cms_hero_slides ORDER BY sort_order'));
    }

    public function saveHero(): void
    {
        $this->requireAdmin();
        $slides = $this->body();
        $this->db->exec('DELETE FROM cms_hero_slides');
        $stmt = $this->db->prepare('INSERT INTO cms_hero_slides (id,image,title,subtitle,description,primary_btn_label,primary_btn_link,secondary_btn_label,secondary_btn_link,sort_order,enabled) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
        foreach ($slides as $i => $s) {
            $stmt->execute([$s['id'] ?? null, $s['image'], $s['title'], $s['subtitle'] ?? null, $s['description'] ?? null, $s['primaryBtnLabel'] ?? 'Join Alumni Network', $s['primaryBtnLink'] ?? '/auth/register', $s['secondaryBtnLabel'] ?? 'Explore Community', $s['secondaryBtnLink'] ?? '/directory', $i, isset($s['enabled']) ? (int)$s['enabled'] : 1]);
        }
        Response::success(null, 'Hero slides saved.');
    }

    // ── Ticker ────────────────────────────────────────────────────────────────

    public function getTicker(): void
    {
        Response::success($this->rows('SELECT * FROM cms_ticker ORDER BY sort_order'));
    }

    public function saveTicker(): void
    {
        $this->requireAdmin();
        $items = $this->body();
        $this->db->exec('DELETE FROM cms_ticker');
        $stmt = $this->db->prepare('INSERT INTO cms_ticker (id,text,highlight,emoji,sort_order,enabled) VALUES (?,?,?,?,?,?)');
        foreach ($items as $i => $t) {
            $stmt->execute([$t['id'] ?? null, $t['text'], $t['highlight'] ?? null, $t['emoji'] ?? null, $i, isset($t['enabled']) ? (int)$t['enabled'] : 1]);
        }
        Response::success(null, 'Ticker saved.');
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    public function getStats(): void
    {
        Response::success($this->rows('SELECT * FROM cms_stats ORDER BY sort_order'));
    }

    public function saveStats(): void
    {
        $this->requireAdmin();
        $items = $this->body();
        $stmt = $this->db->prepare('INSERT INTO cms_stats (id,label,value,suffix,sort_order) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE label=VALUES(label),value=VALUES(value),suffix=VALUES(suffix),sort_order=VALUES(sort_order)');
        foreach ($items as $i => $s) {
            $stmt->execute([$s['id'] ?? null, $s['label'], (int)$s['value'], $s['suffix'] ?? '', $i]);
        }
        Response::success(null, 'Stats saved.');
    }

    // ── Quick Access ──────────────────────────────────────────────────────────

    public function getQuickAccess(): void
    {
        Response::success($this->rows('SELECT * FROM cms_quick_access ORDER BY sort_order'));
    }

    public function saveQuickAccess(): void
    {
        $this->requireAdmin();
        $items = $this->body();
        $this->db->exec('DELETE FROM cms_quick_access');
        $stmt = $this->db->prepare('INSERT INTO cms_quick_access (id,icon,title,link,sort_order,enabled) VALUES (?,?,?,?,?,?)');
        foreach ($items as $i => $q) {
            $stmt->execute([$q['id'] ?? null, $q['icon'], $q['title'], $q['link'], $i, isset($q['enabled']) ? (int)$q['enabled'] : 1]);
        }
        Response::success(null, 'Quick access saved.');
    }

    // ── CTA ───────────────────────────────────────────────────────────────────

    public function getCTA(): void
    {
        $row = $this->row('SELECT * FROM cms_cta WHERE id=1');
        Response::success($row);
    }

    public function saveCTA(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $this->db->prepare('INSERT INTO cms_cta (id,heading,description,primary_btn_label,primary_btn_link,secondary_btn_label,secondary_btn_link) VALUES (1,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE heading=VALUES(heading),description=VALUES(description),primary_btn_label=VALUES(primary_btn_label),primary_btn_link=VALUES(primary_btn_link),secondary_btn_label=VALUES(secondary_btn_label),secondary_btn_link=VALUES(secondary_btn_link)')
            ->execute([$d['heading'], $d['description'] ?? null, $d['primaryBtnLabel'] ?? null, $d['primaryBtnLink'] ?? null, $d['secondaryBtnLabel'] ?? null, $d['secondaryBtnLink'] ?? null]);
        Response::success(null, 'CTA saved.');
    }

    // ── Generic CRUD factory ──────────────────────────────────────────────────

    private function listTable(string $table, string $order = 'id'): void
    {
        Response::success($this->rows("SELECT * FROM `{$table}` ORDER BY `{$order}`"));
    }

    private function deleteRow(string $table, int $id): void
    {
        $this->requireAdmin();
        $this->db->prepare("DELETE FROM `{$table}` WHERE id=?")->execute([$id]);
        Response::success(null, 'Deleted.');
    }

    // ── Events ────────────────────────────────────────────────────────────────

    public function getEvents(): void { $this->listTable('cms_events', 'id'); }

    public function saveEvent(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_events SET title=?,date_day=?,date_month=?,time=?,location=?,image=?,description=?,register_link=?,enabled=? WHERE id=?')
                ->execute([$d['title'], $d['date'] ?? null, $d['month'] ?? null, $d['time'] ?? null, $d['location'] ?? null, $d['image'] ?? null, $d['description'] ?? null, $d['registerLink'] ?? '/events', isset($d['enabled']) ? (int)$d['enabled'] : 1, $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_events (title,date_day,date_month,time,location,image,description,register_link,enabled) VALUES (?,?,?,?,?,?,?,?,?)')
                ->execute([$d['title'], $d['date'] ?? null, $d['month'] ?? null, $d['time'] ?? null, $d['location'] ?? null, $d['image'] ?? null, $d['description'] ?? null, $d['registerLink'] ?? '/events', isset($d['enabled']) ? (int)$d['enabled'] : 1]);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Event saved.');
    }

    public function deleteEvent(int $id): void { $this->deleteRow('cms_events', $id); }

    // ── Notices ───────────────────────────────────────────────────────────────

    public function getNotices(): void { $this->listTable('cms_notices', 'id'); }

    public function saveNotice(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_notices SET title=?,text=?,date=?,tag=?,tag_color=?,category=?,priority=?,enabled=? WHERE id=?')
                ->execute([$d['title'], $d['text'] ?? null, $d['date'] ?? null, $d['tag'] ?? null, $d['tagColor'] ?? '#0B6B4B', $d['category'] ?? 'General', $d['priority'] ?? 'medium', isset($d['enabled']) ? (int)$d['enabled'] : 1, $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_notices (title,text,date,tag,tag_color,category,priority,enabled) VALUES (?,?,?,?,?,?,?,?)')
                ->execute([$d['title'], $d['text'] ?? null, $d['date'] ?? null, $d['tag'] ?? null, $d['tagColor'] ?? '#0B6B4B', $d['category'] ?? 'General', $d['priority'] ?? 'medium', isset($d['enabled']) ? (int)$d['enabled'] : 1]);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Notice saved.');
    }

    public function deleteNotice(int $id): void { $this->deleteRow('cms_notices', $id); }

    // ── Testimonials ──────────────────────────────────────────────────────────

    public function getTestimonials(): void { $this->listTable('cms_testimonials', 'id'); }

    public function saveTestimonial(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_testimonials SET name=?,batch=?,designation=?,photo=?,text=?,enabled=? WHERE id=?')
                ->execute([$d['name'], $d['batch'] ?? null, $d['designation'] ?? null, $d['photo'] ?? null, $d['text'], isset($d['enabled']) ? (int)$d['enabled'] : 1, $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_testimonials (name,batch,designation,photo,text,enabled) VALUES (?,?,?,?,?,?)')
                ->execute([$d['name'], $d['batch'] ?? null, $d['designation'] ?? null, $d['photo'] ?? null, $d['text'], isset($d['enabled']) ? (int)$d['enabled'] : 1]);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Testimonial saved.');
    }

    public function deleteTestimonial(int $id): void { $this->deleteRow('cms_testimonials', $id); }

    // ── Gallery ───────────────────────────────────────────────────────────────

    public function getGallery(): void { $this->listTable('cms_gallery', 'sort_order'); }

    public function saveGalleryItem(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_gallery SET src=?,thumb=?,caption=?,category=?,span=?,sort_order=?,enabled=? WHERE id=?')
                ->execute([$d['src'], $d['thumb'] ?? $d['src'], $d['caption'] ?? null, $d['category'] ?? 'General', $d['span'] ?? '', $d['order'] ?? 0, isset($d['enabled']) ? (int)$d['enabled'] : 1, $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_gallery (src,thumb,caption,category,span,sort_order,enabled) VALUES (?,?,?,?,?,?,?)')
                ->execute([$d['src'], $d['thumb'] ?? $d['src'], $d['caption'] ?? null, $d['category'] ?? 'General', $d['span'] ?? '', $d['order'] ?? 0, isset($d['enabled']) ? (int)$d['enabled'] : 1]);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Gallery item saved.');
    }

    public function deleteGalleryItem(int $id): void { $this->deleteRow('cms_gallery', $id); }

    // ── News ──────────────────────────────────────────────────────────────────

    public function getNews(): void { $this->listTable('cms_news', 'id'); }

    public function saveNews(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_news SET title=?,category=?,author=?,date=?,image=?,excerpt=?,content=?,status=? WHERE id=?')
                ->execute([$d['title'], $d['category'] ?? 'General', $d['author'] ?? 'Admin', $d['date'] ?? null, $d['image'] ?? null, $d['excerpt'] ?? null, $d['content'] ?? null, $d['status'] ?? 'Draft', $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_news (title,category,author,date,image,excerpt,content,status) VALUES (?,?,?,?,?,?,?,?)')
                ->execute([$d['title'], $d['category'] ?? 'General', $d['author'] ?? 'Admin', $d['date'] ?? null, $d['image'] ?? null, $d['excerpt'] ?? null, $d['content'] ?? null, $d['status'] ?? 'Draft']);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'News saved.');
    }

    public function deleteNews(int $id): void { $this->deleteRow('cms_news', $id); }

    // ── Blogs ─────────────────────────────────────────────────────────────────

    public function getBlogs(): void { $this->listTable('cms_blogs', 'id'); }

    public function saveBlog(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_blogs SET title=?,author=?,category=?,date=?,image=?,excerpt=?,content=?,views=?,status=? WHERE id=?')
                ->execute([$d['title'], $d['author'] ?? null, $d['category'] ?? 'General', $d['date'] ?? null, $d['image'] ?? null, $d['excerpt'] ?? null, $d['content'] ?? null, (int)($d['views'] ?? 0), $d['status'] ?? 'Draft', $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_blogs (title,author,category,date,image,excerpt,content,views,status) VALUES (?,?,?,?,?,?,?,?,?)')
                ->execute([$d['title'], $d['author'] ?? null, $d['category'] ?? 'General', $d['date'] ?? null, $d['image'] ?? null, $d['excerpt'] ?? null, $d['content'] ?? null, (int)($d['views'] ?? 0), $d['status'] ?? 'Draft']);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Blog saved.');
    }

    public function deleteBlog(int $id): void { $this->deleteRow('cms_blogs', $id); }

    // ── Jobs ──────────────────────────────────────────────────────────────────

    public function getJobs(): void { $this->listTable('cms_jobs', 'id'); }

    public function saveJob(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $skills = is_array($d['skills'] ?? null) ? implode(',', $d['skills']) : ($d['skills'] ?? '');
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_jobs SET title=?,company=?,location=?,type=?,skills=?,posted_by=?,deadline=?,description=?,status=? WHERE id=?')
                ->execute([$d['title'], $d['company'] ?? null, $d['location'] ?? null, $d['type'] ?? 'Full-time', $skills, $d['postedBy'] ?? null, $d['deadline'] ?? null, $d['description'] ?? null, $d['status'] ?? 'Active', $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_jobs (title,company,location,type,skills,posted_by,deadline,description,status) VALUES (?,?,?,?,?,?,?,?,?)')
                ->execute([$d['title'], $d['company'] ?? null, $d['location'] ?? null, $d['type'] ?? 'Full-time', $skills, $d['postedBy'] ?? null, $d['deadline'] ?? null, $d['description'] ?? null, $d['status'] ?? 'Active']);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Job saved.');
    }

    public function deleteJob(int $id): void { $this->deleteRow('cms_jobs', $id); }

    // ── Mentors ───────────────────────────────────────────────────────────────

    public function getMentors(): void { $this->listTable('cms_mentors', 'id'); }

    public function saveMentor(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $expertise = is_array($d['expertise'] ?? null) ? implode(',', $d['expertise']) : ($d['expertise'] ?? '');
        $availability = is_array($d['availability'] ?? null) ? implode(',', $d['availability']) : ($d['availability'] ?? '');
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_mentors SET name=?,photo=?,designation=?,company=?,expertise=?,rating=?,sessions=?,bio=?,availability=?,status=? WHERE id=?')
                ->execute([$d['name'], $d['photo'] ?? null, $d['designation'] ?? null, $d['company'] ?? null, $expertise, (float)($d['rating'] ?? 5.0), (int)($d['sessions'] ?? 0), $d['bio'] ?? null, $availability, $d['status'] ?? 'Active', $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_mentors (name,photo,designation,company,expertise,rating,sessions,bio,availability,status) VALUES (?,?,?,?,?,?,?,?,?,?)')
                ->execute([$d['name'], $d['photo'] ?? null, $d['designation'] ?? null, $d['company'] ?? null, $expertise, (float)($d['rating'] ?? 5.0), (int)($d['sessions'] ?? 0), $d['bio'] ?? null, $availability, $d['status'] ?? 'Active']);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'Mentor saved.');
    }

    public function deleteMentor(int $id): void { $this->deleteRow('cms_mentors', $id); }

    // ── Schools ───────────────────────────────────────────────────────────────

    public function getSchools(): void { $this->listTable('cms_schools', 'id'); }

    public function saveSchool(): void
    {
        $this->requireAdmin();
        $d = $this->body();
        $id = isset($d['id']) && $d['id'] ? (int)$d['id'] : null;
        if ($id) {
            $this->db->prepare('UPDATE cms_schools SET name=?,description=?,image=?,established=?,students=?,location=?,status=? WHERE id=?')
                ->execute([$d['name'], $d['description'] ?? null, $d['image'] ?? null, $d['established'] ?? null, (int)($d['students'] ?? 0), $d['location'] ?? 'Pantnagar', $d['status'] ?? 'Active', $id]);
        } else {
            $this->db->prepare('INSERT INTO cms_schools (name,description,image,established,students,location,status) VALUES (?,?,?,?,?,?,?)')
                ->execute([$d['name'], $d['description'] ?? null, $d['image'] ?? null, $d['established'] ?? null, (int)($d['students'] ?? 0), $d['location'] ?? 'Pantnagar', $d['status'] ?? 'Active']);
            $id = (int)$this->db->lastInsertId();
        }
        Response::success(['id' => $id], 'School saved.');
    }

    public function deleteSchool(int $id): void { $this->deleteRow('cms_schools', $id); }
}
