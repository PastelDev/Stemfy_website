<?php
/**
 * Download Backup
 *
 * Creates a ZIP archive of the posts/ folder for backup purposes.
 * Requires admin authentication.
 */

require_once __DIR__ . '/config.php';
requireLogin();

// Ensure ZipArchive is available
if (!class_exists('ZipArchive')) {
    http_response_code(500);
    die('ZipArchive extension is not available on this server.');
}

// Get the data directory (posts folder)
$postsDir = DATA_DIR;

if (!is_dir($postsDir)) {
    http_response_code(404);
    die('Posts directory not found.');
}

// Create a temporary file for the ZIP
$zipFile = tempnam(sys_get_temp_dir(), 'stemfy_backup_');
$zip = new ZipArchive();

if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    die('Could not create ZIP archive.');
}

// Add files from the posts directory
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($postsDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
);

$filesAdded = 0;
foreach ($files as $file) {
    if ($file->isFile()) {
        $filePath = $file->getRealPath();
        $relativePath = 'posts/' . substr($filePath, strlen($postsDir));

        // Skip the README file that's only for development
        if (strpos($relativePath, 'README-DELETE') !== false) {
            continue;
        }

        $zip->addFile($filePath, $relativePath);
        $filesAdded++;
    }
}

// Also add uploads if they exist (for complete backup)
$uploadsDir = UPLOAD_DIR;
if (is_dir($uploadsDir)) {
    $uploadFiles = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($uploadsDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($uploadFiles as $file) {
        if ($file->isFile()) {
            $filePath = $file->getRealPath();
            $relativePath = 'admin/uploads/' . substr($filePath, strlen($uploadsDir));
            $zip->addFile($filePath, $relativePath);
            $filesAdded++;
        }
    }
}

if ($filesAdded === 0) {
    $zip->close();
    unlink($zipFile);
    http_response_code(404);
    die('No files found to backup.');
}

$zip->close();

// Generate filename with timestamp
$timestamp = date('Y-m-d_H-i-s');
$downloadName = "stemfy_backup_{$timestamp}.zip";

// Send the ZIP file to the browser
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Content-Length: ' . filesize($zipFile));
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

readfile($zipFile);

// Clean up
unlink($zipFile);
exit;
