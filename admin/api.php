<?php
/**
 * Public API endpoint for fetching posts and news
 * This endpoint is accessible without authentication for the public website
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=300'); // Cache for 5 minutes

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

$type = $_GET['type'] ?? '';

function getJsonData($file) {
    if (file_exists($file)) {
        return json_decode(file_get_contents($file), true);
    }
    return [];
}

switch ($type) {
    case 'posts':
        $data = getJsonData(POSTS_FILE);
        echo json_encode([
            'success' => true,
            'posts' => $data['posts'] ?? [],
            'resources' => $data['resources'] ?? []
        ]);
        break;

    case 'news':
        $data = getJsonData(NEWS_FILE);
        $announcements = $data['announcements'] ?? [];

        // Sort: pinned items first, then by date
        usort($announcements, function($a, $b) {
            if ($a['pinned'] && !$b['pinned']) return -1;
            if (!$a['pinned'] && $b['pinned']) return 1;
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        echo json_encode([
            'success' => true,
            'announcements' => $announcements
        ]);
        break;

    case 'all':
        $postsData = getJsonData(POSTS_FILE);
        $newsData = getJsonData(NEWS_FILE);

        echo json_encode([
            'success' => true,
            'posts' => $postsData['posts'] ?? [],
            'resources' => $postsData['resources'] ?? [],
            'announcements' => $newsData['announcements'] ?? []
        ]);
        break;

    default:
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid type parameter. Use: posts, news, or all'
        ]);
}
