<?php
// backend/routes/api.php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\AdminAuthController;
use App\Controllers\AdminUsersController;
use App\Controllers\CmsController;
use App\Controllers\AlumniController;
use App\Helpers\Response;

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = '/' . trim(str_replace('/backend/api', '', $uri), '/');

$auth  = new AuthController();

// ── Public Auth ───────────────────────────────────────────────────────────────
if ($uri === '/auth/register'        && $method === 'POST')  { $auth->register();         return; }
if ($uri === '/auth/login'           && $method === 'POST')  { $auth->login();            return; }
if ($uri === '/auth/logout'          && $method === 'POST')  { $auth->logout();           return; }
if ($uri === '/auth/refresh'         && $method === 'POST')  { $auth->refresh();          return; }
if ($uri === '/auth/verify-email'    && $method === 'POST')  { $auth->verifyEmail();      return; }
if ($uri === '/auth/forgot-password' && $method === 'POST')  { $auth->forgotPassword();   return; }
if ($uri === '/auth/reset-password'  && $method === 'POST')  { $auth->resetPassword();    return; }
if ($uri === '/auth/me'              && $method === 'GET')   { $auth->me();               return; }

// Social OAuth
if ($uri === '/auth/google'            && $method === 'GET') { $auth->googleRedirect();   return; }
if ($uri === '/auth/google/callback'   && $method === 'GET') { $auth->googleCallback();   return; }
if ($uri === '/auth/facebook'          && $method === 'GET') { $auth->facebookRedirect(); return; }
if ($uri === '/auth/facebook/callback' && $method === 'GET') { $auth->facebookCallback(); return; }
if ($uri === '/auth/linkedin'          && $method === 'GET') { $auth->linkedinRedirect(); return; }
if ($uri === '/auth/linkedin/callback' && $method === 'GET') { $auth->linkedinCallback(); return; }

// ── Admin Auth ────────────────────────────────────────────────────────────────
$adminAuth = new AdminAuthController();
if ($uri === '/admin/auth/login'   && $method === 'POST') { $adminAuth->login();   return; }
if ($uri === '/admin/auth/logout'  && $method === 'POST') { $adminAuth->logout();  return; }
if ($uri === '/admin/auth/me'      && $method === 'GET')  { $adminAuth->me();      return; }
if ($uri === '/admin/auth/refresh' && $method === 'POST') { $adminAuth->refresh(); return; }

// ── Admin Users ───────────────────────────────────────────────────────────────
$adminUsers = new AdminUsersController();
if ($uri === '/admin/users'                                        && $method === 'GET')    { $adminUsers->index();                   return; }
if ($uri === '/admin/users'                                        && $method === 'POST')   { $adminUsers->store();                   return; }
if (preg_match('#^/admin/users/(\d+)$#', $uri, $m)                && $method === 'GET')    { $adminUsers->show((int)$m[1]);          return; }
if (preg_match('#^/admin/users/(\d+)$#', $uri, $m)                && $method === 'PUT')    { $adminUsers->update((int)$m[1]);        return; }
if (preg_match('#^/admin/users/(\d+)$#', $uri, $m)                && $method === 'DELETE') { $adminUsers->destroy((int)$m[1]);       return; }
if (preg_match('#^/admin/users/(\d+)/status$#', $uri, $m)         && $method === 'PATCH')  { $adminUsers->updateStatus((int)$m[1]); return; }
if (preg_match('#^/admin/users/(\d+)/role$#', $uri, $m)           && $method === 'PATCH')  { $adminUsers->updateRole((int)$m[1]);   return; }
if (preg_match('#^/admin/users/(\d+)/reset-password$#', $uri, $m) && $method === 'POST')   { $adminUsers->resetPassword((int)$m[1]);return; }

// ── CMS — Public reads ────────────────────────────────────────────────────────
$cms = new CmsController();
if ($uri === '/cms/settings'     && $method === 'GET') { $cms->getSettings();    return; }
if ($uri === '/cms/hero'         && $method === 'GET') { $cms->getHero();        return; }
if ($uri === '/cms/ticker'       && $method === 'GET') { $cms->getTicker();      return; }
if ($uri === '/cms/stats'        && $method === 'GET') { $cms->getStats();       return; }
if ($uri === '/cms/quick-access' && $method === 'GET') { $cms->getQuickAccess(); return; }
if ($uri === '/cms/cta'          && $method === 'GET') { $cms->getCTA();         return; }
if ($uri === '/cms/events'       && $method === 'GET') { $cms->getEvents();      return; }
if ($uri === '/cms/notices'      && $method === 'GET') { $cms->getNotices();     return; }
if ($uri === '/cms/testimonials' && $method === 'GET') { $cms->getTestimonials();return; }
if ($uri === '/cms/gallery'      && $method === 'GET') { $cms->getGallery();     return; }
if ($uri === '/cms/news'         && $method === 'GET') { $cms->getNews();        return; }
if ($uri === '/cms/blogs'        && $method === 'GET') { $cms->getBlogs();       return; }
if ($uri === '/cms/jobs'         && $method === 'GET') { $cms->getJobs();        return; }
if ($uri === '/cms/mentors'      && $method === 'GET') { $cms->getMentors();     return; }
if ($uri === '/cms/schools'      && $method === 'GET') { $cms->getSchools();     return; }

// ── CMS — Admin writes ────────────────────────────────────────────────────────
if ($uri === '/admin/cms/settings'     && $method === 'POST')   { $cms->updateSettings();    return; }
if ($uri === '/admin/cms/hero'         && $method === 'POST')   { $cms->saveHero();          return; }
if ($uri === '/admin/cms/ticker'       && $method === 'POST')   { $cms->saveTicker();        return; }
if ($uri === '/admin/cms/stats'        && $method === 'POST')   { $cms->saveStats();         return; }
if ($uri === '/admin/cms/quick-access' && $method === 'POST')   { $cms->saveQuickAccess();   return; }
if ($uri === '/admin/cms/cta'          && $method === 'POST')   { $cms->saveCTA();           return; }

if ($uri === '/admin/cms/events'                          && $method === 'POST')   { $cms->saveEvent();          return; }
if (preg_match('#^/admin/cms/events/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteEvent((int)$m[1]); return; }

if ($uri === '/admin/cms/notices'                          && $method === 'POST')   { $cms->saveNotice();          return; }
if (preg_match('#^/admin/cms/notices/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteNotice((int)$m[1]); return; }

if ($uri === '/admin/cms/testimonials'                          && $method === 'POST')   { $cms->saveTestimonial();          return; }
if (preg_match('#^/admin/cms/testimonials/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteTestimonial((int)$m[1]); return; }

if ($uri === '/admin/cms/gallery'                          && $method === 'POST')   { $cms->saveGalleryItem();          return; }
if (preg_match('#^/admin/cms/gallery/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteGalleryItem((int)$m[1]); return; }

if ($uri === '/admin/cms/news'                          && $method === 'POST')   { $cms->saveNews();          return; }
if (preg_match('#^/admin/cms/news/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteNews((int)$m[1]); return; }

if ($uri === '/admin/cms/blogs'                          && $method === 'POST')   { $cms->saveBlog();          return; }
if (preg_match('#^/admin/cms/blogs/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteBlog((int)$m[1]); return; }

if ($uri === '/admin/cms/jobs'                          && $method === 'POST')   { $cms->saveJob();          return; }
if (preg_match('#^/admin/cms/jobs/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteJob((int)$m[1]); return; }

if ($uri === '/admin/cms/mentors'                          && $method === 'POST')   { $cms->saveMentor();          return; }
if (preg_match('#^/admin/cms/mentors/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteMentor((int)$m[1]); return; }

if ($uri === '/admin/cms/schools'                          && $method === 'POST')   { $cms->saveSchool();          return; }
if (preg_match('#^/admin/cms/schools/(\d+)$#', $uri, $m)  && $method === 'DELETE') { $cms->deleteSchool((int)$m[1]); return; }

// ── Alumni — Public ───────────────────────────────────────────────────────────
$alumni = new AlumniController();
if ($uri === '/alumni'           && $method === 'GET') { $alumni->index();    return; }
if ($uri === '/alumni/batches'   && $method === 'GET') { $alumni->batches();  return; }
if ($uri === '/alumni/countries' && $method === 'GET') { $alumni->countries();return; }
if (preg_match('#^/alumni/(\d+)$#', $uri, $m) && $method === 'GET') { $alumni->show((int)$m[1]); return; }

// ── Alumni — Admin ────────────────────────────────────────────────────────────
if ($uri === '/admin/alumni'                                && $method === 'POST')   { $alumni->store();              return; }
if (preg_match('#^/admin/alumni/(\d+)$#', $uri, $m)        && $method === 'PUT')    { $alumni->update((int)$m[1]);   return; }
if (preg_match('#^/admin/alumni/(\d+)$#', $uri, $m)        && $method === 'DELETE') { $alumni->destroy((int)$m[1]);  return; }

// ── 404 ───────────────────────────────────────────────────────────────────────
Response::notFound('API endpoint not found.');
