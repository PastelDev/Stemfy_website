<?php
require_once 'config.php';
requireLogin();

$message = '';
$error = '';
$errors = [];
$action = $_GET['action'] ?? 'list';
$editId = $_GET['id'] ?? null;
$uploadFolderValue = '';

$data = getJsonData(POSTS_FILE);
if (!isset($data['resources'])) {
    $data['resources'] = [];
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isValidCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security check failed. Please refresh and try again.';
    } else {
        $postAction = $_POST['post_action'] ?? '';

        if ($postAction === 'create' || $postAction === 'update') {
            $existingResource = null;
            $existingFileUrl = null;
            $uploadFolderValue = $_POST['upload_folder'] ?? '';

            if ($postAction === 'update') {
                foreach ($data['resources'] as $resourceItem) {
                    if ($resourceItem['id'] === $_POST['id']) {
                        $existingResource = $resourceItem;
                        break;
                    }
                }
                $existingFileUrl = $existingResource['file_url'] ?? null;
            }

            $uploadSubdir = getUploadSubdir($uploadFolderValue, $errors);
            [$targetDir, $targetUrlBase] = getUploadTarget(UPLOAD_RESOURCES_DIR, UPLOAD_BASE_URL . 'resources/', $uploadSubdir);
            $uploadedFileUrl = uploadPdfFile('file_upload', $targetDir, $targetUrlBase, $errors);
            $fileUrl = $uploadedFileUrl ?: $existingFileUrl;

            if (!$fileUrl) {
                $errors[] = 'Please upload a PDF file.';
            }

            if (empty($errors)) {
                $resource = [
                    'id' => $postAction === 'update' ? $_POST['id'] : generateId(),
                    'title_en' => sanitizeInput($_POST['title_en']),
                    'title_el' => sanitizeInput($_POST['title_el']),
                    'description_en' => sanitizeInput($_POST['description_en']),
                    'description_el' => sanitizeInput($_POST['description_el']),
                    'file_url' => $fileUrl,
                    'type' => sanitizeInput($_POST['type']),
                    'created_at' => $postAction === 'update' ? $_POST['created_at'] : date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];

                if ($postAction === 'update') {
                    $index = array_search($_POST['id'], array_column($data['resources'], 'id'));
                    if ($index !== false) {
                        $data['resources'][$index] = $resource;
                        $message = 'Resource updated successfully!';
                    }
                } else {
                    array_unshift($data['resources'], $resource);
                    $message = 'Resource created successfully!';
                }

                saveJsonData(POSTS_FILE, $data);

                if ($uploadedFileUrl && $existingFileUrl) {
                    deleteUploadedFile($existingFileUrl);
                }

                $action = 'list';
            } else {
                $error = implode(' ', $errors);
                if ($postAction === 'update') {
                    $editId = $_POST['id'];
                }
                $action = $postAction === 'update' ? 'edit' : 'new';
            }

        } elseif ($postAction === 'delete' && isset($_POST['id'])) {
            $resourceToDelete = null;
            foreach ($data['resources'] as $resourceItem) {
                if ($resourceItem['id'] === $_POST['id']) {
                    $resourceToDelete = $resourceItem;
                    break;
                }
            }
            if ($resourceToDelete && !empty($resourceToDelete['file_url'])) {
                deleteUploadedFile($resourceToDelete['file_url']);
            }

            $data['resources'] = array_filter($data['resources'], fn($r) => $r['id'] !== $_POST['id']);
            $data['resources'] = array_values($data['resources']);
            saveJsonData(POSTS_FILE, $data);
            $message = 'Resource deleted successfully!';
        }
    }
}

// Get resource for editing
$editResource = null;
if ($action === 'edit' && $editId) {
    foreach ($data['resources'] as $resource) {
        if ($resource['id'] === $editId) {
            $editResource = $resource;
            break;
        }
    }
}

include 'templates/header.php';
?>

<main class="main-content">
    <header class="content-header">
        <h2><?php echo $action === 'list' ? 'Educational Resources' : ($action === 'edit' ? 'Edit Resource' : 'New Resource'); ?></h2>
        <p>Manage PDFs and educational materials</p>
    </header>

    <?php if ($message): ?>
        <div class="alert alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <?php echo $message; ?>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <?php if ($action === 'list'): ?>
        <div class="content-panel">
            <div class="panel-header">
                <h3>All Resources (<?php echo count($data['resources']); ?>)</h3>
                <a href="?action=new" class="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Resource
                </a>
            </div>

            <?php if (empty($data['resources'])): ?>
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h4>No resources yet</h4>
                    <p>Add your first educational resource</p>
                </div>
            <?php else: ?>
                <div class="items-list">
                    <?php foreach ($data['resources'] as $resource): ?>
                        <div class="item-card">
                            <div class="item-preview">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                            </div>
                            <div class="item-content">
                                <h4><?php echo htmlspecialchars($resource['title_en']); ?></h4>
                                <p><?php echo htmlspecialchars($resource['description_en']); ?></p>
                                <div class="item-meta">
                                    <span>Type: <?php echo htmlspecialchars($resource['type']); ?></span>
                                    <span>Created: <?php echo date('M j, Y', strtotime($resource['created_at'])); ?></span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <a href="?action=edit&id=<?php echo $resource['id']; ?>" class="btn btn-secondary btn-sm">Edit</a>
                                <form method="POST" style="display:inline" onsubmit="return confirm('Are you sure you want to delete this resource?')">
                                    <input type="hidden" name="post_action" value="delete">
                                    <?php echo csrfInputField(); ?>
                                    <input type="hidden" name="id" value="<?php echo $resource['id']; ?>">
                                    <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

    <?php else: ?>
        <div class="content-panel">
            <form method="POST" enctype="multipart/form-data" data-upload-form="true">
                <input type="hidden" name="post_action" value="<?php echo $editResource ? 'update' : 'create'; ?>">
                <?php echo csrfInputField(); ?>
                <?php if ($editResource): ?>
                    <input type="hidden" name="id" value="<?php echo $editResource['id']; ?>">
                    <input type="hidden" name="created_at" value="<?php echo $editResource['created_at']; ?>">
                <?php endif; ?>

                <div class="form-row">
                    <div class="form-group">
                        <label for="title_en">Title (English)</label>
                        <input type="text" id="title_en" name="title_en" required
                               value="<?php echo $editResource ? htmlspecialchars($editResource['title_en']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="title_el">Title (Greek)</label>
                        <input type="text" id="title_el" name="title_el" required
                               value="<?php echo $editResource ? htmlspecialchars($editResource['title_el']) : ''; ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="description_en">Description (English)</label>
                        <textarea id="description_en" name="description_en" required><?php echo $editResource ? htmlspecialchars($editResource['description_en']) : ''; ?></textarea>
                    </div>
                    <div class="form-group">
                        <label for="description_el">Description (Greek)</label>
                        <textarea id="description_el" name="description_el" required><?php echo $editResource ? htmlspecialchars($editResource['description_el']) : ''; ?></textarea>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="upload_folder">Upload Folder (optional)</label>
                        <input type="text" id="upload_folder" name="upload_folder" value="<?php echo htmlspecialchars($uploadFolderValue); ?>" placeholder="e.g. 2024/resources">
                        <p class="form-hint">Files will be stored in /admin/uploads/resources/{folder}. Use letters, numbers, dashes, underscores, and slashes.</p>
                    </div>
                    <div class="form-group">
                        <label for="file_upload">PDF Upload</label>
                        <input type="file" id="file_upload" name="file_upload" class="js-upload-input" data-max-size="<?php echo UPLOAD_MAX_SIZE; ?>" accept="application/pdf" <?php echo $editResource ? '' : 'required'; ?>>
                        <p class="form-hint">Upload a PDF file for this resource. Max 50 MB.</p>
                        <?php if ($editResource && !empty($editResource['file_url'])): ?>
                            <p class="form-hint">Current file: <a href="<?php echo htmlspecialchars($editResource['file_url']); ?>" target="_blank" rel="noopener">View PDF</a></p>
                        <?php endif; ?>
                    </div>
                    <div class="form-group">
                        <label for="type">Resource Type</label>
                        <select id="type" name="type" required>
                            <option value="pdf" <?php echo ($editResource && $editResource['type'] === 'pdf') ? 'selected' : ''; ?>>PDF Document</option>
                            <option value="infographic" <?php echo ($editResource && $editResource['type'] === 'infographic') ? 'selected' : ''; ?>>Infographic</option>
                            <option value="guide" <?php echo ($editResource && $editResource['type'] === 'guide') ? 'selected' : ''; ?>>Study Guide</option>
                            <option value="video" <?php echo ($editResource && $editResource['type'] === 'video') ? 'selected' : ''; ?>>Video</option>
                            <option value="other" <?php echo ($editResource && $editResource['type'] === 'other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="submit" class="btn btn-primary">
                        <?php echo $editResource ? 'Update Resource' : 'Create Resource'; ?>
                    </button>
                    <a href="resources.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    <?php endif; ?>
</main>

<?php include 'templates/footer.php'; ?>
