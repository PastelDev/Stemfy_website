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

// Data file paths
define('DATA_DIR', __DIR__ . '/data/');
define('POSTS_FILE', DATA_DIR . 'posts.json');
define('NEWS_FILE', DATA_DIR . 'news.json');

// Upload paths
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_BASE_URL', '/admin/uploads/');
define('UPLOAD_POSTS_DIR', UPLOAD_DIR . 'posts/');
define('UPLOAD_RESOURCES_DIR', UPLOAD_DIR . 'resources/');
define('UPLOAD_NEWS_DIR', UPLOAD_DIR . 'news/');
define('UPLOAD_MAX_SIZE', 52428800); // 50 MB

// Ensure data and upload directories exist
ensureDir(DATA_DIR);
ensureDir(UPLOAD_DIR);
ensureDir(UPLOAD_POSTS_DIR);
ensureDir(UPLOAD_RESOURCES_DIR);
ensureDir(UPLOAD_NEWS_DIR);

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
        return json_decode(file_get_contents($file), true);
    }
    return [];
}

function saveJsonData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function generateId() {
    return uniqid() . '_' . time();
}

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function ensureDir($dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
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
