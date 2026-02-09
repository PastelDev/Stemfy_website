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
if (!isset($data['posts'])) {
    $data['posts'] = [];
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isValidCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security check failed. Please refresh and try again.';
    } else {
        $postAction = $_POST['post_action'] ?? '';

        if ($postAction === 'create' || $postAction === 'update') {
            $existingPost = null;
            $existingMedia = [];
            $removedMedia = [];
            $uploadFolderValue = $_POST['upload_folder'] ?? '';

            if ($postAction === 'update') {
                foreach ($data['posts'] as $postItem) {
                    if ($postItem['id'] === $_POST['id']) {
                        $existingPost = $postItem;
                        break;
                    }
                }
                $existingMedia = $existingPost['media'] ?? [];
                if (empty($existingMedia) && !empty($existingPost['image_url'])) {
                    $existingMedia = [['type' => 'image', 'url' => $existingPost['image_url']]];
                }
                $removedMedia = $_POST['remove_media'] ?? [];
            }

            $keptMedia = array_values(array_filter($existingMedia, function($item) use ($removedMedia) {
                return !in_array($item['url'], $removedMedia, true);
            }));

            $uploadSubdir = getUploadSubdir($uploadFolderValue, $errors);
            [$targetDir, $targetUrlBase] = getUploadTarget(UPLOAD_POSTS_DIR, UPLOAD_BASE_URL . 'posts/', $uploadSubdir);
            $newMedia = uploadMediaFiles('media_files', $targetDir, $targetUrlBase, $errors);
            $media = array_merge($keptMedia, $newMedia);

            if (empty($media)) {
                $errors[] = 'Please upload at least one image or video.';
            }

            if (empty($errors)) {
                $post = [
                    'id' => $postAction === 'update' ? $_POST['id'] : generateId(),
                    'title_en' => sanitizeInput($_POST['title_en']),
                    'title_el' => sanitizeInput($_POST['title_el']),
                    'description_en' => sanitizeInput($_POST['description_en']),
                    'description_el' => sanitizeInput($_POST['description_el']),
                    'media' => $media,
                    'created_at' => $postAction === 'update' ? $_POST['created_at'] : date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];

                if ($postAction === 'update') {
                    $index = array_search($_POST['id'], array_column($data['posts'], 'id'));
                    if ($index !== false) {
                        $data['posts'][$index] = $post;
                        $message = 'Post updated successfully!';
                    }
                } else {
                    array_unshift($data['posts'], $post);
                    $message = 'Post created successfully!';
                }

                saveJsonData(POSTS_FILE, $data);

                foreach ($removedMedia as $removedUrl) {
                    deleteUploadedFile($removedUrl);
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
            $postToDelete = null;
            foreach ($data['posts'] as $postItem) {
                if ($postItem['id'] === $_POST['id']) {
                    $postToDelete = $postItem;
                    break;
                }
            }

            if ($postToDelete && !empty($postToDelete['media'])) {
                foreach ($postToDelete['media'] as $mediaItem) {
                    deleteUploadedFile($mediaItem['url'] ?? '');
                }
            }

            $data['posts'] = array_filter($data['posts'], fn($p) => $p['id'] !== $_POST['id']);
            $data['posts'] = array_values($data['posts']);
            saveJsonData(POSTS_FILE, $data);
            $message = 'Post deleted successfully!';
        }
    }
}

// Get post for editing
$editPost = null;
if ($action === 'edit' && $editId) {
    foreach ($data['posts'] as $post) {
        if ($post['id'] === $editId) {
            $editPost = $post;
            break;
        }
    }
}

include 'templates/header.php';
?>

<main class="main-content">
    <header class="content-header">
        <h2><?php echo $action === 'list' ? 'Posts' : ($action === 'edit' ? 'Edit Post' : 'New Post'); ?></h2>
        <p>Manage Instagram-style posts for the Posts page</p>
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
                <h3>All Posts (<?php echo count($data['posts']); ?>)</h3>
                <a href="?action=new" class="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Post
                </a>
            </div>

            <?php if (empty($data['posts'])): ?>
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <h4>No posts yet</h4>
                    <p>Create your first post to get started</p>
                </div>
            <?php else: ?>
                <div class="items-list">
                    <?php foreach ($data['posts'] as $post): ?>
                        <?php
                            $mediaItems = $post['media'] ?? [];
                            if (empty($mediaItems) && !empty($post['image_url'])) {
                                $mediaItems = [['type' => 'image', 'url' => $post['image_url']]];
                            }
                            $previewMedia = $mediaItems[0] ?? null;
                        ?>
                        <div class="item-card">
                            <div class="item-preview">
                                <?php if ($previewMedia && ($previewMedia['type'] ?? '') === 'image'): ?>
                                    <img src="<?php echo htmlspecialchars($previewMedia['url']); ?>" alt="">
                                <?php elseif ($previewMedia && ($previewMedia['type'] ?? '') === 'video'): ?>
                                    <div class="media-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                        </svg>
                                    </div>
                                <?php else: ?>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                <?php endif; ?>
                                <?php if (count($mediaItems) > 1): ?>
                                    <span class="media-count"><?php echo count($mediaItems); ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="item-content">
                                <h4><?php echo htmlspecialchars($post['title_en']); ?></h4>
                                <p><?php echo htmlspecialchars($post['description_en']); ?></p>
                                <div class="item-meta">
                                    <span><?php echo count($mediaItems); ?> media</span>
                                    <span>Created: <?php echo date('M j, Y', strtotime($post['created_at'])); ?></span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <a href="?action=edit&id=<?php echo $post['id']; ?>" class="btn btn-secondary btn-sm">Edit</a>
                                <form method="POST" style="display:inline" onsubmit="return confirm('Are you sure you want to delete this post?')">
                                    <input type="hidden" name="post_action" value="delete">
                                    <?php echo csrfInputField(); ?>
                                    <input type="hidden" name="id" value="<?php echo $post['id']; ?>">
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
                <input type="hidden" name="post_action" value="<?php echo $editPost ? 'update' : 'create'; ?>">
                <?php echo csrfInputField(); ?>
                <?php if ($editPost): ?>
                    <input type="hidden" name="id" value="<?php echo $editPost['id']; ?>">
                    <input type="hidden" name="created_at" value="<?php echo $editPost['created_at']; ?>">
                <?php endif; ?>

                <div class="form-row">
                    <div class="form-group">
                        <label for="title_en">Title (English)</label>
                        <input type="text" id="title_en" name="title_en" required
                               value="<?php echo $editPost ? htmlspecialchars($editPost['title_en']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="title_el">Title (Greek)</label>
                        <input type="text" id="title_el" name="title_el" required
                               value="<?php echo $editPost ? htmlspecialchars($editPost['title_el']) : ''; ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="description_en">Description (English)</label>
                        <textarea id="description_en" name="description_en" required><?php echo $editPost ? htmlspecialchars($editPost['description_en']) : ''; ?></textarea>
                    </div>
                    <div class="form-group">
                        <label for="description_el">Description (Greek)</label>
                        <textarea id="description_el" name="description_el" required><?php echo $editPost ? htmlspecialchars($editPost['description_el']) : ''; ?></textarea>
                    </div>
                </div>

                <?php if ($editPost): ?>
                    <?php
                        $editMediaItems = $editPost['media'] ?? [];
                        if (empty($editMediaItems) && !empty($editPost['image_url'])) {
                            $editMediaItems = [['type' => 'image', 'url' => $editPost['image_url']]];
                        }
                    ?>
                    <?php if (!empty($editMediaItems)): ?>
                        <div class="form-group">
                            <label>Existing Media</label>
                            <div class="media-grid">
                                <?php foreach ($editMediaItems as $mediaItem): ?>
                                    <label class="media-tile">
                                        <input type="checkbox" name="remove_media[]" value="<?php echo htmlspecialchars($mediaItem['url']); ?>">
                                        <div class="media-thumb">
                                            <?php if (($mediaItem['type'] ?? '') === 'image'): ?>
                                                <img src="<?php echo htmlspecialchars($mediaItem['url']); ?>" alt="">
                                            <?php else: ?>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                                </svg>
                                            <?php endif; ?>
                                        </div>
                                        <span>Remove</span>
                                    </label>
                                <?php endforeach; ?>
                            </div>
                            <p class="form-hint">Check any media you want to remove.</p>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>

                <div class="form-group">
                    <label for="upload_folder">Upload Folder (optional)</label>
                    <input type="text" id="upload_folder" name="upload_folder" value="<?php echo htmlspecialchars($uploadFolderValue); ?>" placeholder="e.g. 2024/instagram">
                    <p class="form-hint">Files will be stored in /admin/uploads/posts/{folder}. Use letters, numbers, dashes, underscores, and slashes.</p>
                </div>

                <div class="form-group">
                    <label for="media_files">Upload Media (Images &amp; Videos)</label>
                    <input type="file" id="media_files" name="media_files[]" class="js-upload-input" data-max-size="<?php echo UPLOAD_MAX_SIZE; ?>" accept="image/*,video/*" multiple <?php echo $editPost ? '' : 'required'; ?>>
                    <p class="form-hint">Select multiple files for carousel posts. Supported: JPG, PNG, GIF, WebP, MP4, WebM, MOV. Max 50 MB per file.</p>
                </div>

                <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="submit" class="btn btn-primary">
                        <?php echo $editPost ? 'Update Post' : 'Create Post'; ?>
                    </button>
                    <a href="posts.php" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    <?php endif; ?>
</main>

<?php include 'templates/footer.php'; ?>
