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

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
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
