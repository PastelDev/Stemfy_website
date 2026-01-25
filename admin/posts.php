<?php
require_once 'config.php';
requireLogin();

$message = '';
$error = '';
$action = $_GET['action'] ?? 'list';
$editId = $_GET['id'] ?? null;

$data = getJsonData(POSTS_FILE);
if (!isset($data['posts'])) {
    $data['posts'] = [];
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postAction = $_POST['post_action'] ?? '';

    if ($postAction === 'create' || $postAction === 'update') {
        $post = [
            'id' => $postAction === 'update' ? $_POST['id'] : generateId(),
            'title_en' => sanitizeInput($_POST['title_en']),
            'title_el' => sanitizeInput($_POST['title_el']),
            'description_en' => sanitizeInput($_POST['description_en']),
            'description_el' => sanitizeInput($_POST['description_el']),
            'image_url' => sanitizeInput($_POST['image_url']),
            'link_url' => sanitizeInput($_POST['link_url']),
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
        $action = 'list';

    } elseif ($postAction === 'delete' && isset($_POST['id'])) {
        $data['posts'] = array_filter($data['posts'], fn($p) => $p['id'] !== $_POST['id']);
        $data['posts'] = array_values($data['posts']);
        saveJsonData(POSTS_FILE, $data);
        $message = 'Post deleted successfully!';
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
                        <div class="item-card">
                            <div class="item-preview">
                                <?php if (!empty($post['image_url'])): ?>
                                    <img src="<?php echo htmlspecialchars($post['image_url']); ?>" alt="">
                                <?php else: ?>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                <?php endif; ?>
                            </div>
                            <div class="item-content">
                                <h4><?php echo htmlspecialchars($post['title_en']); ?></h4>
                                <p><?php echo htmlspecialchars($post['description_en']); ?></p>
                                <div class="item-meta">
                                    <span>Created: <?php echo date('M j, Y', strtotime($post['created_at'])); ?></span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <a href="?action=edit&id=<?php echo $post['id']; ?>" class="btn btn-secondary btn-sm">Edit</a>
                                <form method="POST" style="display:inline" onsubmit="return confirm('Are you sure you want to delete this post?')">
                                    <input type="hidden" name="post_action" value="delete">
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
            <form method="POST">
                <input type="hidden" name="post_action" value="<?php echo $editPost ? 'update' : 'create'; ?>">
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

                <div class="form-group">
                    <label for="image_url">Image URL</label>
                    <input type="url" id="image_url" name="image_url"
                           value="<?php echo $editPost ? htmlspecialchars($editPost['image_url']) : ''; ?>"
                           placeholder="https://example.com/image.jpg">
                    <p class="form-hint">Direct link to the image (Instagram post image, uploaded image, etc.)</p>
                </div>

                <div class="form-group">
                    <label for="link_url">Link URL (optional)</label>
                    <input type="url" id="link_url" name="link_url"
                           value="<?php echo $editPost ? htmlspecialchars($editPost['link_url']) : ''; ?>"
                           placeholder="https://instagram.com/p/...">
                    <p class="form-hint">Link to the original post or related content</p>
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
