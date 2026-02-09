<?php
/**
 * Admin Configuration
 *
 * Credentials are loaded from a separate file for security.
 * Create 'credentials.php' in the admin folder with:
 *
 *   <?php
 *   define('ADMIN_USERNAME', 'your_username');
 *   define('ADMIN_PASSWORD', 'your_password');
 *
 * This file is gitignored and must be created manually on the server.
 */

// Session configuration
ini_set('session.use_strict_mode', '1');
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// Load credentials from separate file
$credentialsFile = __DIR__ . '/credentials.php';
if (file_exists($credentialsFile)) {
    require_once $credentialsFile;
} else {
    // Credentials not configured
    define('ADMIN_USERNAME', false);
    define('ADMIN_PASSWORD', false);
}

// Data file paths (allow override for deployments)
$dataDir = defined('STEMFY_DATA_DIR') ? STEMFY_DATA_DIR : getenv('STEMFY_DATA_DIR');
$defaultDataDir = dirname(__DIR__) . '/posts/';
if (!is_dir($defaultDataDir)) {
    $defaultDataDir = __DIR__ . '/data/';
}
$dataDir = $dataDir ?: $defaultDataDir;
define('DATA_DIR', rtrim($dataDir, '/\\') . DIRECTORY_SEPARATOR);
define('POSTS_FILE', DATA_DIR . 'posts.json');
define('NEWS_FILE', DATA_DIR . 'news.json');

// Upload paths (allow override for deployments)
$uploadDir = defined('STEMFY_UPLOAD_DIR') ? STEMFY_UPLOAD_DIR : getenv('STEMFY_UPLOAD_DIR');
$uploadDir = $uploadDir ?: (__DIR__ . '/uploads/');
define('UPLOAD_DIR', rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR);
$uploadBaseUrl = defined('STEMFY_UPLOAD_BASE_URL') ? STEMFY_UPLOAD_BASE_URL : getenv('STEMFY_UPLOAD_BASE_URL');
define('UPLOAD_BASE_URL', $uploadBaseUrl ?: '/admin/uploads/');
define('UPLOAD_POSTS_DIR', UPLOAD_DIR . 'posts/');
define('UPLOAD_RESOURCES_DIR', UPLOAD_DIR . 'resources/');
define('UPLOAD_NEWS_DIR', UPLOAD_DIR . 'news/');
define('UPLOAD_MAX_SIZE', 52428800); // 50 MB

// Login protection
define('LOGIN_ATTEMPT_MAX', 5);
define('LOGIN_ATTEMPT_WINDOW', 900); // 15 minutes
define('LOGIN_ATTEMPT_BLOCK', 900); // 15 minutes
define('LOGIN_ATTEMPTS_FILE', DATA_DIR . 'login_attempts.json');

// Ensure data and upload directories exist
ensureDir(DATA_DIR);
ensureDir(UPLOAD_DIR);
ensureDir(UPLOAD_POSTS_DIR);
ensureDir(UPLOAD_RESOURCES_DIR);
ensureDir(UPLOAD_NEWS_DIR);
if (!file_exists(LOGIN_ATTEMPTS_FILE)) {
    file_put_contents(LOGIN_ATTEMPTS_FILE, json_encode([], JSON_PRETTY_PRINT));
}

// Initialize data files if they don't exist
if (!file_exists(POSTS_FILE)) {
    file_put_contents(POSTS_FILE, json_encode(['posts' => [], 'resources' => []], JSON_PRETTY_PRINT));
}

if (!file_exists(NEWS_FILE)) {
    file_put_contents(NEWS_FILE, json_encode(['announcements' => []], JSON_PRETTY_PRINT));
}

// Helper functions
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function getJsonData($file) {
    if (file_exists($file)) {
        $decoded = json_decode(file_get_contents($file), true);
        return is_array($decoded) ? $decoded : [];
    }
    return [];
}

function saveJsonData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function generateId() {
    return uniqid() . '_' . time();
}

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function getCsrfToken() {
    if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function isValidCsrfToken($token) {
    if (!is_string($token) || $token === '') {
        return false;
    }
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    return is_string($sessionToken) && $sessionToken !== '' && hash_equals($sessionToken, $token);
}

function csrfInputField() {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(getCsrfToken(), ENT_QUOTES, 'UTF-8') . '">';
}

function getClientIp() {
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? null,
        $_SERVER['HTTP_X_REAL_IP'] ?? null,
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null
    ];

    foreach ($candidates as $candidate) {
        if (!$candidate) {
            continue;
        }

        $parts = array_map('trim', explode(',', $candidate));
        foreach ($parts as $part) {
            if (filter_var($part, FILTER_VALIDATE_IP)) {
                return $part;
            }
        }
    }

    return 'unknown';
}

function readLoginAttempts() {
    if (!file_exists(LOGIN_ATTEMPTS_FILE)) {
        return [];
    }

    $raw = file_get_contents(LOGIN_ATTEMPTS_FILE);
    if ($raw === false) {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function writeLoginAttempts($attempts) {
    return file_put_contents(
        LOGIN_ATTEMPTS_FILE,
        json_encode($attempts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

function pruneLoginAttempts($attempts, $now) {
    foreach ($attempts as $ip => $data) {
        $last = isset($data['last']) ? (int) $data['last'] : 0;
        $blockedUntil = isset($data['blocked_until']) ? (int) $data['blocked_until'] : 0;
        if ($last < ($now - (LOGIN_ATTEMPT_WINDOW * 2)) && $blockedUntil < $now) {
            unset($attempts[$ip]);
        }
    }
    return $attempts;
}

function isLoginRateLimited($ip, &$retryAfter = 0) {
    $retryAfter = 0;
    if (!$ip) {
        return false;
    }

    $now = time();
    $attempts = pruneLoginAttempts(readLoginAttempts(), $now);
    if (!isset($attempts[$ip])) {
        writeLoginAttempts($attempts);
        return false;
    }

    $entry = $attempts[$ip];
    $blockedUntil = isset($entry['blocked_until']) ? (int) $entry['blocked_until'] : 0;
    if ($blockedUntil > $now) {
        $retryAfter = $blockedUntil - $now;
        return true;
    }

    if ($blockedUntil > 0 && $blockedUntil <= $now) {
        unset($attempts[$ip]);
        writeLoginAttempts($attempts);
    }

    return false;
}

function recordLoginFailure($ip) {
    if (!$ip) {
        return;
    }

    $now = time();
    $attempts = pruneLoginAttempts(readLoginAttempts(), $now);
    $entry = $attempts[$ip] ?? [
        'count' => 0,
        'first' => $now,
        'last' => $now,
        'blocked_until' => 0
    ];

    $first = isset($entry['first']) ? (int) $entry['first'] : $now;
    if (($now - $first) > LOGIN_ATTEMPT_WINDOW) {
        $entry['count'] = 0;
        $entry['first'] = $now;
    }

    $entry['count'] = ((int) ($entry['count'] ?? 0)) + 1;
    $entry['last'] = $now;
    if ($entry['count'] >= LOGIN_ATTEMPT_MAX) {
        $entry['blocked_until'] = $now + LOGIN_ATTEMPT_BLOCK;
    }

    $attempts[$ip] = $entry;
    writeLoginAttempts($attempts);
}

function clearLoginFailures($ip) {
    if (!$ip) {
        return;
    }

    $attempts = readLoginAttempts();
    if (isset($attempts[$ip])) {
        unset($attempts[$ip]);
        writeLoginAttempts($attempts);
    }
}

function ensureDir($dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

function getUploadSubdir($input, &$errors) {
    $raw = trim((string) $input);
    if ($raw === '') {
        return '';
    }
    $normalized = str_replace('\\', '/', $raw);
    $normalized = trim($normalized, '/');
    if ($normalized === '') {
        return '';
    }
    if (strpos($normalized, '..') !== false) {
        $errors[] = 'Upload folder cannot include "..".';
        return '';
    }
    if (!preg_match('#^[a-zA-Z0-9/_-]+$#', $normalized)) {
        $errors[] = 'Upload folder contains invalid characters.';
        return '';
    }
    return $normalized;
}

function getUploadTarget($baseDir, $baseUrl, $subdir) {
    $destDir = rtrim($baseDir, '/\\') . DIRECTORY_SEPARATOR;
    $destUrlBase = rtrim($baseUrl, '/') . '/';
    if ($subdir) {
        $destDir .= str_replace('/', DIRECTORY_SEPARATOR, $subdir) . DIRECTORY_SEPARATOR;
        $destUrlBase .= $subdir . '/';
    }
    ensureDir($destDir);
    return [$destDir, $destUrlBase];
}

function normalizeFilesArray($files) {
    $normalized = [];
    if (!$files || !isset($files['name'])) {
        return $normalized;
    }

    if (is_array($files['name'])) {
        $count = count($files['name']);
        for ($i = 0; $i < $count; $i++) {
            $normalized[] = [
                'name' => $files['name'][$i],
                'type' => $files['type'][$i] ?? '',
                'tmp_name' => $files['tmp_name'][$i],
                'error' => $files['error'][$i],
                'size' => $files['size'][$i]
            ];
        }
    } else {
        $normalized[] = [
            'name' => $files['name'],
            'type' => $files['type'] ?? '',
            'tmp_name' => $files['tmp_name'],
            'error' => $files['error'],
            'size' => $files['size']
        ];
    }

    return $normalized;
}

function getFileExtension($filename) {
    return strtolower(pathinfo($filename, PATHINFO_EXTENSION));
}

function detectMimeType($tmpPath) {
    if (!function_exists('finfo_open')) {
        return '';
    }
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if (!$finfo) {
        return '';
    }
    $mime = finfo_file($finfo, $tmpPath);
    finfo_close($finfo);
    return $mime ?: '';
}

function moveUploadedFile($tmpPath, $destDir, $destUrlBase, $extension) {
    $filename = uniqid('upload_', true) . '.' . $extension;
    $destination = $destDir . $filename;
    if (!move_uploaded_file($tmpPath, $destination)) {
        return null;
    }
    return $destUrlBase . $filename;
}

function uploadMediaFiles($fieldName, $destDir, $destUrlBase, &$errors) {
    $media = [];
    $files = normalizeFilesArray($_FILES[$fieldName] ?? null);
    $imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $videoExts = ['mp4', 'webm', 'mov', 'm4v'];

    foreach ($files as $file) {
        if ($file['error'] === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = 'Upload failed for ' . $file['name'] . '.';
            continue;
        }
        if ($file['size'] > UPLOAD_MAX_SIZE) {
            $errors[] = 'File too large: ' . $file['name'] . '.';
            continue;
        }

        $ext = getFileExtension($file['name']);
        $mediaType = null;
        $requiredMimePrefix = '';

        if (in_array($ext, $imageExts, true)) {
            $mediaType = 'image';
            $requiredMimePrefix = 'image/';
        } elseif (in_array($ext, $videoExts, true)) {
            $mediaType = 'video';
            $requiredMimePrefix = 'video/';
        } else {
            $errors[] = 'Unsupported file type: ' . $file['name'] . '.';
            continue;
        }

        $mime = detectMimeType($file['tmp_name']);
        if ($mime && strpos($mime, $requiredMimePrefix) !== 0) {
            $errors[] = 'Invalid file content: ' . $file['name'] . '.';
            continue;
        }

        $url = moveUploadedFile($file['tmp_name'], $destDir, $destUrlBase, $ext);
        if (!$url) {
            $errors[] = 'Could not save file: ' . $file['name'] . '.';
            continue;
        }

        $media[] = [
            'type' => $mediaType,
            'url' => $url
        ];
    }

    return $media;
}

function uploadPdfFile($fieldName, $destDir, $destUrlBase, &$errors) {
    $files = normalizeFilesArray($_FILES[$fieldName] ?? null);
    if (empty($files)) {
        return null;
    }

    $file = $files[0];
    if ($file['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Upload failed for ' . $file['name'] . '.';
        return null;
    }
    if ($file['size'] > UPLOAD_MAX_SIZE) {
        $errors[] = 'File too large: ' . $file['name'] . '.';
        return null;
    }

    $ext = getFileExtension($file['name']);
    if ($ext !== 'pdf') {
        $errors[] = 'Only PDF files are allowed: ' . $file['name'] . '.';
        return null;
    }

    $mime = detectMimeType($file['tmp_name']);
    if ($mime && $mime !== 'application/pdf') {
        $errors[] = 'Invalid PDF file: ' . $file['name'] . '.';
        return null;
    }

    $url = moveUploadedFile($file['tmp_name'], $destDir, $destUrlBase, $ext);
    if (!$url) {
        $errors[] = 'Could not save file: ' . $file['name'] . '.';
        return null;
    }

    return $url;
}

function deleteUploadedFile($publicUrl) {
    if (!$publicUrl || strpos($publicUrl, UPLOAD_BASE_URL) !== 0) {
        return false;
    }

    $relative = substr($publicUrl, strlen(UPLOAD_BASE_URL));
    $target = realpath(UPLOAD_DIR . $relative);
    $base = realpath(UPLOAD_DIR);

    if ($target && $base && strpos($target, $base) === 0 && file_exists($target)) {
        return unlink($target);
    }

    return false;
}
